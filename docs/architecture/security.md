# Security & Role-Based Access Control (RBAC)

## Security Architecture Overview

Fixiq handles sensitive hardware serial numbers, customer contact information, and proprietary repair diagnostic knowledge. Security is integrated into the core architecture through defense-in-depth principles:

```text
HTTP Request
     │
     ▼
TLS Termination (HTTPS)
     │
     ▼
Rate Limiting & Helmet Headers
     │
     ▼
JWT Authentication (Identity Verification)
     │
     ▼
Tenant Isolation Middleware (Organization Context)
     │
     ▼
Role & Permission Guards (RBAC)
     │
     ▼
Zod Input Schema Validation (Boundary Sanitization)
     │
     ▼
Domain Service & Business Invariants
     │
     ▼
Tenant-Scoped Database Query (Prisma / PostgreSQL)
```

---

## 1. Role Hierarchy & Permission Matrix

Four distinct roles exist within an organization:

| Permission | OWNER | MANAGER | TECHNICIAN | VIEWER |
| :--- | :---: | :---: | :---: | :---: |
| `organization.manage` | ✅ | ❌ | ❌ | ❌ |
| `user.manage` | ✅ | ✅ | ❌ | ❌ |
| `analytics.read` | ✅ | ✅ | ⚠️ Personal | ⚠️ Basic |
| `customer.read` | ✅ | ✅ | ✅ | ✅ |
| `customer.write` | ✅ | ✅ | ✅ | ❌ |
| `device.read` | ✅ | ✅ | ✅ | ✅ |
| `device.write` | ✅ | ✅ | ✅ | ❌ |
| `repair.read` | ✅ | ✅ | ✅ | ✅ |
| `repair.create` | ✅ | ✅ | ✅ | ❌ |
| `repair.update` | ✅ | ✅ | ✅ | ❌ |
| `diagnostic.create` | ✅ | ✅ | ✅ | ❌ |
| `repair.delete` | ✅ | ❌ | ❌ | ❌ |

---

## 2. Authentication Protocol

* **Access Tokens:** Short-lived JSON Web Tokens (JWT) with 15-minute expiration, signed with HS256/RS256.
* **Refresh Tokens:** Long-lived (7–30 days), stored in database with device fingerprinting and automatic rotation upon use. Revocable per user or per session.
* **Password Hashing:** Passwords hashed with `bcrypt` (work factor 12) or Argon2id. Plaintext passwords are never logged, printed, or retained.

---

## 3. Input Validation & Injection Defense

* Every API route uses **Zod schemas** to strictly parse and validate incoming payloads:
  * Strict typing (strings, integers, UUIDs).
  * Stripping unknown keys (`.strict()` or default Zod parsing).
  * Sanitizing malicious inputs to prevent SQL injection, XSS, and prototype pollution.
* All database interaction occurs through Prisma's parameterized query engine, preventing SQL injection by design.
