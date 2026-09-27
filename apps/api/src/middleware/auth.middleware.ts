import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError, UserRole } from '@fixiq/shared';

interface DecodedToken {
  userId: string;
  organizationId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token!, env.JWT_SECRET) as DecodedToken;

    req.tenant = {
      userId: decoded.userId,
      organizationId: decoded.organizationId,
      role: decoded.role,
    };

    next();
  } catch {
    throw new UnauthorizedError('Token is invalid or expired');
  }
}
