import { Router, Request, Response } from 'express';
import { prisma } from '@fixiq/database';
import { resolveOrganizationId } from '../../utils/tenant.js';

export const repairsRouter = Router();

// GET /api/repairs - List all repair jobs
repairsRouter.get('/repairs', async (req: Request, res: Response) => {
  try {
    const orgId = await resolveOrganizationId(req);
    const jobs = await prisma.repairJob.findMany({
      where: { organizationId: orgId },
      include: {
        device: {
          include: {
            model: true,
            customer: true,
          },
        },
        assignedTechnician: {
          select: { id: true, name: true, email: true },
        },
        symptoms: {
          include: {
            symptom: true,
          },
        },
        observations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        confirmedComponents: {
          include: {
            component: true,
          },
        },
        repairActions: true,
        repairTests: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format for easy consumption
    const formatted = jobs.map((job) => {
      const primarySymptom = job.symptoms[0]?.symptom?.name ?? 'Unspecified symptom';
      const obs = job.observations[0];

      return {
        id: `FIX-${job.id.substring(0, 4).toUpperCase()}`,
        dbId: job.id,
        device: job.device.model.modelName,
        board: job.device.model.boardNumber ?? 'Universal Board',
        serial: job.device.serialNumber,
        customer: job.device.customer.name,
        technician: job.assignedTechnician?.name ?? 'Unassigned',
        status: job.status,
        priority: job.priority,
        symptom: primarySymptom,
        intakeDate: new Date(job.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        completedAt: job.completedAt,
        measurements: obs
          ? {
              vbusVoltage: obs.vbusVoltageVolts ? `${obs.vbusVoltageVolts}V` : null,
              vbusCurrent: obs.vbusCurrentAmps !== null ? `${obs.vbusCurrentAmps}A` : null,
              thermalPeak: obs.thermalDeltaCelsius ? `+${obs.thermalDeltaCelsius}°C` : null,
            }
          : null,
      };
    });

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch repair jobs from database' });
  }
});

// GET /api/repairs/:id - Get repair details
repairsRouter.get('/repairs/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : '';
    if (!id) {
      res.status(400).json({ success: false, error: 'Invalid repair ID' });
      return;
    }

    const orgId = await resolveOrganizationId(req);
    const cleanId = id.replace(/^FIX-/i, '').toLowerCase();
    const job = await prisma.repairJob.findFirst({
      where: {
        organizationId: orgId,
        OR: [
          { id },
          { id: { startsWith: cleanId } },
        ],
      },
      include: {
        device: {
          include: { model: true, customer: true },
        },
        assignedTechnician: true,
        symptoms: { include: { symptom: true } },
        observations: true,
        confirmedComponents: { include: { component: true } },
        repairActions: true,
        repairTests: true,
      },
    });

    if (!job) {
      res.status(404).json({ success: false, error: 'Repair job not found' });
      return;
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch repair job' });
  }
});

// POST /api/repairs - Create a new repair ticket (supports manual intake and AI parser output)
repairsRouter.post('/repairs', async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = await resolveOrganizationId(req);
    const tech = await prisma.user.findFirst({
      where: { organizationId: orgId },
      select: { id: true },
    });

    const {
      deviceId,
      modelName,
      boardNumber,
      serialNumber,
      customerName,
      symptoms = [],
      measurements,
      priority = 'NORMAL',
      notes,
    } = req.body;

    let targetDeviceId = deviceId;

    // If no explicit deviceId is provided, resolve or create Customer and Device
    if (!targetDeviceId) {
      // Find or create customer
      let customer = await prisma.customer.findFirst({
        where: {
          organizationId: orgId,
          name: customerName?.trim() || 'Workbench Walk-in Customer',
        },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            organizationId: orgId,
            name: customerName?.trim() || 'Workbench Walk-in Customer',
            email: 'walkin@apexfix.com',
            phone: '+1 (555) 234-5678',
          },
        });
      }

      // Find or create DeviceModel
      let model = await prisma.deviceModel.findFirst({
        where: {
          OR: [
            { boardNumber: boardNumber?.trim() },
            { modelName: { contains: modelName?.trim() || 'Generic' } },
          ],
        },
      });

      if (!model) {
        model = await prisma.deviceModel.create({
          data: {
            manufacturer: 'Standard OEM',
            modelName: modelName?.trim() || 'Standard Laptop',
            modelNumber: 'FIX-GENERIC',
            deviceType: 'Laptop',
            boardNumber: boardNumber?.trim() || 'Schematic Pending',
          },
        });
      }

      // Upsert device
      const cleanSerial = (serialNumber?.trim() || `SN-${Date.now().toString(36).toUpperCase()}`).toUpperCase();
      const device = await prisma.device.upsert({
        where: {
          organizationId_serialNumber: {
            organizationId: orgId,
            serialNumber: cleanSerial,
          },
        },
        update: {},
        create: {
          organizationId: orgId,
          customerId: customer.id,
          modelId: model.id,
          serialNumber: cleanSerial,
        },
      });
      targetDeviceId = device.id;
    }

    // Create the RepairJob
    const job = await prisma.repairJob.create({
      data: {
        organizationId: orgId,
        deviceId: targetDeviceId,
        assignedTechnicianId: tech?.id ?? null,
        status: 'RECEIVED',
        priority: priority || 'NORMAL',
        intakeCondition: {
          notes: notes || 'Intake via Fixiq Diagnostic Workbench',
          liquidExposure: false,
        },
      },
    });

    // Link symptoms if provided
    if (Array.isArray(symptoms) && symptoms.length > 0) {
      for (const symName of symptoms) {
        const symptom = await prisma.symptom.findFirst({
          where: { name: symName },
        });
        if (symptom) {
          await prisma.repairJobSymptom.create({
            data: {
              repairJobId: job.id,
              symptomId: symptom.id,
            },
          }).catch(() => {});
        }
      }
    }

    // Record initial observation if measurements are given
    if (measurements && tech?.id) {
      const vbusVolt = parseFloat(measurements.vbusVoltage);
      const vbusCurr = parseFloat(measurements.vbusCurrent);
      const tempDelta = parseFloat(measurements.thermalPeak);

      await prisma.diagnosticObservation.create({
        data: {
          organizationId: orgId,
          repairJobId: job.id,
          technicianId: tech.id,
          vbusVoltageVolts: isNaN(vbusVolt) ? null : vbusVolt,
          vbusCurrentAmps: isNaN(vbusCurr) ? null : vbusCurr,
          thermalDeltaCelsius: isNaN(tempDelta) ? null : tempDelta,
          shortedPowerRails: measurements.isShort ? ['VBUS_MAIN'] : [],
          diodeModeReadings: measurements.diodeReading ? { diode: measurements.diodeReading } : {},
          notes: measurements.hotspotPart ? `Hotspot detected on: ${measurements.hotspotPart}` : null,
        },
      }).catch((e) => console.warn('Failed to record observation:', e));
    }

    res.status(201).json({
      success: true,
      data: {
        id: job.id,
        ticketId: `FIX-${job.id.substring(0, 4).toUpperCase()}`,
        status: job.status,
      },
    });
  } catch (error) {
    console.error('Error creating repair job:', error);
    res.status(500).json({ success: false, error: 'Failed to create repair job' });
  }
});

// PATCH /api/repairs/:id/status - State machine lifecycle transition
repairsRouter.patch('/repairs/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = typeof rawId === 'string' ? rawId : '';
    const { targetStatus } = req.body;

    if (!id || !targetStatus) {
      res.status(400).json({ success: false, error: 'Valid repair ID and target status required' });
      return;
    }

    const orgId = await resolveOrganizationId(req);
    const cleanId = id.replace(/^FIX-/i, '').toLowerCase();
    const job = await prisma.repairJob.findFirst({
      where: {
        organizationId: orgId,
        OR: [{ id }, { id: { startsWith: cleanId } }],
      },
    });

    if (!job) {
      res.status(404).json({ success: false, error: 'Repair job not found' });
      return;
    }

    // Check transition validity
    const { canTransitionRepairStatus, allowedTransitions } = await import('./repair-lifecycle.js');
    const curStatus = job.status as unknown as import('@fixiq/shared').RepairStatus;
    const tgtStatus = targetStatus as unknown as import('@fixiq/shared').RepairStatus;

    if (!canTransitionRepairStatus(curStatus, tgtStatus)) {
      res.status(400).json({
        success: false,
        error: `Invalid lifecycle transition from ${job.status} to ${targetStatus}`,
        allowedTransitions: allowedTransitions[curStatus] || [],
      });
      return;
    }

    const isTerminal = ['COMPLETED', 'RETURNED', 'UNREPAIRABLE'].includes(targetStatus);
    const updated = await prisma.repairJob.update({
      where: { id: job.id },
      data: {
        status: targetStatus,
        completedAt: isTerminal ? new Date() : undefined,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        status: updated.status,
        completedAt: updated.completedAt,
      },
    });
  } catch (error) {
    console.error('Error transitioning repair status:', error);
    res.status(500).json({ success: false, error: 'Failed to update repair status' });
  }
});
