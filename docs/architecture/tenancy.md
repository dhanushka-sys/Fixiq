# Multi-Tenancy Architecture

## Tenant Isolation Strategy: Row-Level Scoping with Context Middleware

Fixiq enforces a strict **Pooled Database, Shared Schema, Row-Level Isolated** multi-tenant architecture. This guarantees that small independent shops and enterprise repair centers can be hosted reliably on a single relational PostgreSQL cluster while preventing cross-tenant data leakage.

---

## 1. Tenancy Model: Organization Anchor

Every business entity in the system is anchored to an `Organization`:

```text
Organization (Tenant Root)
   ├── Users (Technicians, Managers, Owners)
   ├── Customers
   ├── Devices
   ├── RepairJobs
   │     ├── PhysicalConditions
   │     ├── Symptoms
   │     ├── DiagnosticObservations
   │     ├── SuspectedComponents
   │     ├── ConfirmedComponents
   │     ├── RepairActions
   │     └── RepairTests
   └── FailurePatterns (Local Shop Knowledge)
```

---

## 2. Request Lifecycle & Context Injection

1. **Authentication Token Parsing:**
   Incoming HTTP requests carry a signed JWT bearing `userId`, `organizationId`, and `role`.
2. **Tenant Extraction Middleware:**
   ```typescript
   export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
     const tokenPayload = verifyToken(req.headers.authorization);
     if (!tokenPayload?.organizationId) {
       throw new UnauthorizedError('Missing or invalid organization context');
     }
     
     // Bind tenant context to request lifecycle
     req.tenant = {
       organizationId: tokenPayload.organizationId,
       userId: tokenPayload.userId,
       role: tokenPayload.role
     };
     
     next();
   }
   ```
3. **Repository-Level Filtering:**
   All Prisma queries must include `where: { organizationId: req.tenant.organizationId, ... }`.
4. **Prisma Client Extension (Defense in Depth):**
   A Prisma client query extension automatically injects `organizationId` into all `findMany`, `findFirst`, `update`, and `delete` operations for tenant-scoped models, preventing developer oversight.

---

## 3. Strict Prohibitions

* **No Frontend Tenant Selection for Data Access:** The frontend never sends `?orgId=xyz` to authorize access. The tenant context is extracted solely from the cryptographically verified JWT.
* **No Cross-Tenant Joins:** A query joining `Customer` and `RepairJob` must ensure both entities share the exact same `organizationId`.
* **Zero Tenant Leaks in Error Messages:** Error responses for records that exist in another tenant must return `404 Not Found` rather than `403 Forbidden`, preventing tenant enumeration attacks.
