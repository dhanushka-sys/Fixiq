# AGENTS.md — Development Guidelines for AI & Human Contributors

Welcome to **Fixiq** (Repair Intelligence Platform). This document specifies the non-negotiable architectural invariants, domain rules, coding standards, and operational workflows for this repository.

---

## 1. System Purpose & Core Philosophy

Fixiq is **not** a generic repair shop CRUD or Point-of-Sale tool.
* **The Repair Shop Workflow is the Data-Generation Layer.**
* **The Real Product is the Explainable Failure Intelligence** accumulated from historical repairs.

Every feature, schema, and API endpoint must serve the goal of turning raw, chaotic repair actions into structured, queryable, and mathematically sound hardware failure intelligence.

---

## 2. Non-Negotiable Architectural Invariants

### Invariant 1: Multi-Tenant Isolation (Zero Trust)
* Fixiq is strictly multi-tenant. Every tenant-scoped entity (`Customer`, `Device`, `RepairJob`, `DiagnosticObservation`, `RepairAction`, `RepairTest`, `Component`) belongs to an `Organization`.
* **Database Isolation:** Every database query affecting tenant data **MUST** filter by `organizationId`.
* **Zero Frontend Trust:** Tenant isolation must be enforced on the backend via authentication middleware and service-level checks. Never rely on frontend client parameters.

### Invariant 2: Suspected vs. Confirmed Component Segregation
* In precision diagnostics, a technician's initial hypothesis often differs from the final verified root cause.
* **Schema Enforcement:** Diagnostic records must explicitly separate:
  * `SUSPECTED` components (hypothesized during initial triage/testing).
  * `CONFIRMED` components (empirically proven faulty after isolation/testing/replacement).
* **Intelligence Purity:** The failure pattern intelligence engine **MUST ONLY** weigh `CONFIRMED` components with verified successful outcomes. Guesswork must never poison the historical knowledge graph.

### Invariant 3: Deterministic & Explainable Intelligence
* The intelligence engine must be **deterministic, transparent, and auditable**.
* **No "Black-Box" Hallucinations:** Recommendations must be backed by empirical evidence counts:
  ```json
  {
    "symptom": "NO_POWER",
    "model": "ThinkPad T14 Gen 2",
    "confirmedComponent": "TPS65988",
    "totalSimilarCases": 42,
    "confirmedCases": 31,
    "successfulRepairs": 28,
    "confidence": "HIGH",
    "evidenceStrength": 0.903
  }
  ```
* Never display ungrounded assertions like *"Replace this chip."* Always display *"Historical repair records show 31 confirmed cases out of 42..."*

### Invariant 4: Modular Monolith Boundaries
* We do **not** use distributed microservices. We use a **Modular Monolith**.
* Each domain module (`identity`, `organizations`, `devices`, `repairs`, `diagnostics`, `components`, `intelligence`, `analytics`) lives with high cohesion and low coupling.
* Cross-module communication must happen via exported services or interfaces, never by querying another module's internal database tables directly.

### Invariant 5: Closed-Loop Verification
* A repair is not complete when an action is taken; it is complete when a **verification test** is recorded (`SUCCESSFUL`, `PARTIAL`, `FAILED`, `UNREPAIRABLE`).
* Only repairs marked with `SUCCESSFUL` outcomes contribute positively to the confidence scoring of failure relationships.

---

## 3. Technology Stack & Workspace Structure

### Monorepo Structure
```text
Fixiq/
├── apps/
│   ├── web/               # Next.js 15 (App Router), Tailwind CSS, shadcn/ui
│   └── api/               # Node.js + Fastify / Express, TypeScript REST API
├── packages/
│   ├── database/          # Prisma ORM schema, client, migrations, seeds
│   ├── shared/            # Shared TypeScript types, enums, constants
│   └── validation/        # Zod validation schemas for all domain entities
├── modules/ (or api modules)
│   ├── identity/          # Auth, JWT, RBAC
│   ├── organizations/     # Multi-tenancy context
│   ├── customers/         # Customer profiles
│   ├── devices/           # Device registry, make/model catalog
│   ├── repairs/           # Repair job lifecycle state machine
│   ├── diagnostics/       # Symptoms, observations, measurements
│   ├── components/        # Component catalog & pinouts
│   ├── intelligence/      # Deterministic failure pattern engine
│   └── analytics/         # Failure metrics, comeback detection
├── docs/                  # Architectural documentation & research
└── docker/                # Docker compose for PostgreSQL & local services
```

---

## 4. Coding Standards & Conventions

### TypeScript & Linting
* **Strict Type Safety:** `"strict": true` in all `tsconfig.json`. No usage of `any`. Use `unknown` with type guards where data is untyped.
* **Validation at Boundaries:** All external inputs (HTTP requests, query params, headers, webhooks) must be validated via **Zod** schemas before reaching controllers or services.
* **Naming Conventions:**
  * Files: `kebab-case.ts` (e.g., `repair-job.service.ts`).
  * Classes & Types: `PascalCase` (e.g., `RepairJobService`, `DiagnosticObservation`).
  * Functions & Variables: `camelCase` (e.g., `calculateFailureRate`).
  * Enums & Constants: `UPPER_SNAKE_CASE` (e.g., `RepairStatus.INSPECTION`).

### Error Handling
* Throw domain-specific errors derived from a base `AppError` class:
  * `NotFoundError` (HTTP 404)
  * `UnauthorizedError` (HTTP 401)
  * `ForbiddenError` (HTTP 403)
  * `ConflictError` (HTTP 409)
  * `ValidationError` (HTTP 400)
* All controllers must delegate error formatting to the global error-handling middleware.

### Shell Execution on Windows
* When running terminal commands in this environment (Windows PowerShell):
  * Use `npm.cmd` instead of `npm`.
  * Use `npx.cmd` instead of `npx`.
  * Use `;` to separate statements, not `&&`.

---

## 5. Security & RBAC Guidelines

Four roles are supported:
1. `OWNER`: Full organization access, billing, user management, audit logs.
2. `MANAGER`: View analytics, monitor technicians, manage devices and repairs, inventory.
3. `TECHNICIAN`: Receive devices, log symptoms/observations, perform repairs, record tests.
4. `VIEWER`: Read-only access to repair history and reports.

Permissions are checked on every protected endpoint using server-side authorization guards.

---

## 6. Testing Philosophy

* **Unit Tests (`Vitest`):** Pure functions, deterministic failure calculations, state transitions, validation schemas.
* **Integration Tests:** API endpoints with PostgreSQL test container, testing tenant isolation and authorization.
* **E2E Tests (`Playwright`):** Complete technician workflow: Login $\rightarrow$ Create Customer $\rightarrow$ Register Device $\rightarrow$ Intake Repair $\rightarrow$ Log Symptoms & Observations $\rightarrow$ Confirm Component $\rightarrow$ Record Test $\rightarrow$ Verify Intelligence Generation.

---

## 7. Frontend Architecture, Hydration & UX Best Practices

### Hydration Integrity & Browser Extension Resilience
* **Browser Extension Attribute Injection (`bis_skin_checked`, etc.):**
  * Third-party browser extensions (ColorZilla, Bitdefender, VPN plugins, password managers) frequently inject attributes like `bis_skin_checked="1"` or `data-lastpass-root` into DOM elements before or during React hydration.
  * **Sanitization:** Root layout must include the synchronous `<HydrationFix />` sanitizer in `<head>` that cleans and observes injected attributes using a `MutationObserver` on `document.documentElement`.
  * **Suppression:** Always apply `suppressHydrationWarning` on `<html>`, `<body>`, and root layout shell wrappers.
* **Client-Side Only State:**
  * Dynamic or environment-dependent values (`Date.now()`, `Math.random()`, `window.innerWidth`, locale formatting) must never be evaluated directly in the render phase of SSR components.
  * Always initialize client-only state inside `useEffect` or behind mounting guards (`isMounted`).

### Responsive Mobile-First & Touch Usability
* **Dual-View Data Presentations:**
  * Complex data tables must provide an adaptive dual view:
    * **Mobile (`< sm`):** High-density, thumb-friendly tap cards displaying key identifiers (Ticket #, Device, Board, Status) and prominent action buttons.
    * **Desktop (`≥ sm`):** Multi-column structured data tables with responsive horizontal scroll fallback.
* **Touch Target Standards:**
  * All interactive elements (navigation links, buttons, filter chips) must have a minimum tap height of **42px to 44px** on mobile viewports.
* **Scroll & Modal Management:**
  * Always lock background document scrolling (`document.body.style.overflow = 'hidden'`) when mobile navigation drawers or modal dialogs (like the Command Palette) are open.
  * Always implement `Escape` key listeners and backdrop tap dismissal for all overlays.
* **Global Command Palette (`⌘K` / `Ctrl+K`):**
  * Provide global keyboard shortcuts and mobile quick-search triggers for instant fuzzy-navigation across tickets, devices, components, and views.

---

## 8. Git Branching & Conventional Commits Workflow

* **Branching Strategy:**
  * All active development must occur in dedicated feature/sub-branches (`develop` or `feature/*`). Never commit directly to `main`.
* **Major & Atomic Commits:**
  * Group logically cohesive sets of enhancements into clear, major commits.
  * Avoid committing noisy intermediate broken states.
  * Follow **Conventional Commits** formatting:
    * `feat(web): ...` for new capabilities or UX views.
    * `fix(web): ...` for bug fixes or hydration error resolutions.
    * `refactor(web): ...` for code quality, cleanup, and restructuring.
    * `docs: ...` for architectural or guideline updates.
* **Pre-Push Quality Gate:**
  * Always execute and pass workspace type-checking and production builds prior to pushing:
    ```powershell
    npm.cmd run typecheck; npm.cmd run build --workspace=@fixiq/web
    ```

