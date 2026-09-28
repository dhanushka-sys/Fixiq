import { Router, Request, Response } from 'express';
import { prisma } from '@fixiq/database';
import { resolveOrganizationId } from '../../utils/tenant.js';

export const customersRouter = Router();

// GET /api/customers - List all customers with fleet and repair counts
customersRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    const orgId = await resolveOrganizationId(req);
    const customers = await prisma.customer.findMany({
      where: { organizationId: orgId },
      include: {
        devices: {
          where: { organizationId: orgId },
          include: {
            repairJobs: {
              where: {
                organizationId: orgId,
                status: {
                  in: ['RECEIVED', 'INSPECTION', 'DIAGNOSIS', 'AWAITING_APPROVAL', 'REPAIRING', 'TESTING'],
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = customers.map((c, index) => {
      const activeRepairs = c.devices.reduce((acc, d) => acc + d.repairJobs.length, 0);

      // Determine customer status
      let status = 'INDIVIDUAL';
      if (c.name.includes('Enterprise')) status = 'ENTERPRISE';
      else if (c.name.includes('Logistics') || c.name.includes('LLC')) status = 'BUSINESS';
      else if (c.name.includes('Warranty') || c.name.includes('Services')) status = 'PARTNER';

      return {
        id: `CUST-00${index + 1}`,
        dbId: c.id,
        name: c.name,
        contactPerson: c.notes?.split(':')[0]?.replace('Contact: ', '') ?? 'Account Manager',
        email: c.email ?? 'support@apexfix.com',
        phone: c.phone ?? '+1 (555) 000-0000',
        devicesCount: c.devices.length,
        activeRepairs,
        status,
        address: c.address,
      };
    });

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customers from database' });
  }
});
