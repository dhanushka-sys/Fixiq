import { Router, Request, Response } from 'express';
import { prisma } from '@fixiq/database';
import { resolveOrganizationId } from '../../utils/tenant.js';

export const devicesRouter = Router();

// GET /api/devices - List all registered devices and models
devicesRouter.get('/devices', async (req: Request, res: Response) => {
  try {
    const orgId = await resolveOrganizationId(req);
    const models = await prisma.deviceModel.findMany({
      include: {
        devices: {
          where: { organizationId: orgId },
          include: {
            customer: true,
            repairJobs: {
              where: { organizationId: orgId },
              select: { id: true, status: true },
            },
          },
        },
        failurePatterns: {
          include: {
            component: true,
          },
          orderBy: { confirmedCases: 'desc' },
          take: 1,
        },
      },
    });

    const formatted = models.map((m) => {
      const topPattern = m.failurePatterns[0];
      const totalRepairs = m.devices.reduce((acc, d) => acc + d.repairJobs.length, 0);

      return {
        id: m.id,
        model: m.modelName,
        brand: m.manufacturer,
        boardNumber: m.boardNumber ?? 'Schematic Pending',
        cpuArch: m.deviceType,
        formFactor: m.deviceType.includes('Ultrabook') ? '14" Ultrabook' : '14" Laptop',
        repairCount: totalRepairs,
        topFailureIC: topPattern ? `${topPattern.component.partNumber} (${topPattern.circuitDesignator})` : 'TPS65988 (USB-PD)',
        registeredUnits: m.devices.length,
      };
    });

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch devices from database' });
  }
});
