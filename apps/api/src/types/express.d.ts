import { TenantContext } from '@fixiq/shared';

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}
