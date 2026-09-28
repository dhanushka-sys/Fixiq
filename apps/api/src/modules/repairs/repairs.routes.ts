import { Router, Request, Response } from 'express';
import { prisma } from '@fixiq/database';

export const repairsRouter = Router();

// GET /api/repairs - List all repair jobs
repairsRouter.get('/repairs', async (_req: Request, res: Response) => {
  try {
    const jobs = await prisma.repairJob.findMany({
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

    const cleanId = id.replace(/^FIX-/i, '').toLowerCase();
    const job = await prisma.repairJob.findFirst({
      where: {
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
