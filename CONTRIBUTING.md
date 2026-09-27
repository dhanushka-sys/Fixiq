# Contributing to Fixiq

Thank you for your interest in contributing to **Fixiq**! We are committed to building an open-source, enterprise-grade Repair Intelligence Platform with clean code, strong typing, and strict multi-tenant boundaries.

---

## 1. Development Principles

Before writing code, please review [AGENTS.md](AGENTS.md) for architectural invariants:
1. **Strict Multi-Tenancy:** Never write queries that omit `organizationId`.
2. **Deterministic Intelligence:** Intelligence calculations must remain pure, testable, and explainable functions.
3. **Suspected vs. Confirmed:** Always maintain segregation between hypothesized and verified components.
4. **Zod Validation:** All endpoints must validate request parameters, bodies, and query strings.
5. **No `any`:** Strict TypeScript everywhere.

---

## 2. Pull Request Workflow

1. Fork the repo and create your feature branch:
   ```bash
   git checkout -b feature/repair-lifecycle-engine
   ```
2. Commit your changes with semantic commit messages:
   * `feat: add repeat failure detection service`
   * `fix: prevent null pointer on unverified repair outcome`
   * `test: add unit tests for Bayesian confidence calculator`
   * `docs: update module interaction diagrams`
3. Ensure all tests and linting pass:
   ```bash
   npm run lint
   npm run test
   npm run typecheck
   ```
4. Open a Pull Request referencing the related issue.

---

## 3. Monorepo Organization

* `apps/web`: Next.js frontend application.
* `apps/api`: Node.js REST API.
* `packages/database`: Prisma schema, migrations, and seed scripts.
* `packages/shared`: Shared types, interfaces, enums, constants.
* `packages/validation`: Zod validation schemas.
