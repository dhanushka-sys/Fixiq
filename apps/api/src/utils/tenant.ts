import { Request } from 'express';
import { prisma } from '@fixiq/database';

/**
 * Resolves the active organization ID for multi-tenant isolation.
 * Prioritizes authenticated tenant context, falling back to the organization record.
 */
export async function resolveOrganizationId(req: Request): Promise<string> {
  if (req.tenant?.organizationId) {
    return req.tenant.organizationId;
  }

  // Fallback to active organization (e.g. Apex Micro Lab seeded org)
  const defaultOrg = await prisma.organization.findFirst({
    where: { slug: 'apex-micro-lab' },
    select: { id: true },
  });
  if (defaultOrg) return defaultOrg.id;

  const anyOrg = await prisma.organization.findFirst({ select: { id: true } });
  if (anyOrg) return anyOrg.id;

  const newOrg = await prisma.organization.create({
    data: { name: 'Apex Micro Lab', slug: 'apex-micro-lab' },
    select: { id: true },
  });
  return newOrg.id;
}
