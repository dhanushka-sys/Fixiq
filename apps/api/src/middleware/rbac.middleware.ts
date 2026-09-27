import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError, UserRole } from '@fixiq/shared';

const roleHierarchy: Record<UserRole, number> = {
  [UserRole.OWNER]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.TECHNICIAN]: 2,
  [UserRole.VIEWER]: 1,
};

export function requireRole(minimumRole: UserRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.tenant) {
      throw new UnauthorizedError('Authentication required');
    }

    const userLevel = roleHierarchy[req.tenant.role];
    const requiredLevel = roleHierarchy[minimumRole];

    if (userLevel === undefined || userLevel < requiredLevel) {
      throw new ForbiddenError(
        `Insufficient privileges. Requires role: ${minimumRole} or higher.`
      );
    }

    next();
  };
}
