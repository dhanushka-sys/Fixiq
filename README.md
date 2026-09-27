# Fixiq — Repair Intelligence Platform 🧠🔧

> **Transforming the chaotic, unstructured activity of hardware diagnostics into structured, reusable, and explainable failure intelligence.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Modular Monolith](https://img.shields.io/badge/Architecture-Modular%20Monolith-green.svg)](#architecture)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)

---

## The Vision

Most electronics repair software is simply a **Point-of-Sale with a ticketing form**. It tracks customers, prints invoices, and deducts parts from inventory. The actual technical diagnosis—the most valuable event in the shop—is discarded into an unindexed text box (*"fixed no power"*).

**Fixiq changes this paradigm:**
* The repair shop is the **data-generation layer**.
* The real product is the **accumulated failure intelligence**.

Every time a technician diagnoses a shorted power rail, measures a diode-mode voltage drop, or replaces a confirmed faulty IC, Fixiq captures that empirical ground truth. As repairs accumulate, Fixiq's deterministic intelligence engine synthesizes this history into **explainable failure patterns** that guide technicians on future repairs.

```text
                     ┌──────────────────┐
                     │   Repair Shop    │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ Device Registry  │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ Repair History   │
                     └────────┬─────────┘
                              │
                    structured observations
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
          Symptoms        Components       Conditions
              │               │                │
              └───────────────┼────────────────┘
                              ▼
                     ┌──────────────────┐
                     │ Failure Patterns │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Intelligence &  │
                     │ Evidence Engine  │
                     └──────────────────┘
```

---

## Key Differentiators

| Traditional Repair POS (Status Quo) | Fixiq Repair Intelligence Platform |
| :--- | :--- |
| Free-text notes (`"replaced chip, working"`) | Structured ontology: Model $\rightarrow$ Symptom $\rightarrow$ Observations $\rightarrow$ Components |
| Diagnostic trial-and-error takes 45–90 min | Instant probabilistic failure guidance reduces bench time to 15 min |
| Guesses are lumped in with verified fixes | Strict separation: `SUSPECTED` vs. `CONFIRMED` components |
| Repeat comebacks erode shop profit margins | Automated repeat-failure & cascade defect detection |
| Diagnostic knowledge is trapped in lead tech's head | Institutional memory is permanently captured in the shop's private database |

---

## Core Architecture

Fixiq is designed as a **Modular Monolith** using TypeScript:

```text
Fixiq/
├── apps/
│   ├── web/               # Next.js 15 (App Router), Tailwind CSS, shadcn/ui
│   └── api/               # Node.js + Fastify / Express, TypeScript REST API
├── packages/
│   ├── database/          # Prisma ORM schema, client, migrations, seed data
│   ├── shared/            # Shared TypeScript types, enums, domain interfaces
│   └── validation/        # Zod validation schemas
├── modules/
│   ├── identity/          # Authentication & RBAC (OWNER, MANAGER, TECHNICIAN, VIEWER)
│   ├── organizations/     # Multi-tenancy context & strict tenant isolation
│   ├── customers/         # Customer profiles & device ownership
│   ├── devices/           # Device registry, make/model catalog
│   ├── repairs/           # Repair job lifecycle (RECEIVED -> DIAGNOSIS -> REPAIR -> TEST -> CLOSED)
│   ├── diagnostics/       # Symptoms, observations, ammeter/voltage readings
│   ├── components/        # Component catalog (ICs, MOSFETs, capacitors, coils)
│   ├── intelligence/      # Deterministic failure pattern & evidence engine
│   └── analytics/         # Quality metrics, comeback detection, failure frequencies
├── docs/                  # Architecture & research documentation
└── docker/                # Local development infrastructure (PostgreSQL)
```

---

## Non-Negotiable Invariants

1. **Strict Multi-Tenancy:** Every tenant-scoped database query filters by `organizationId`. Tenant boundaries are enforced server-side.
2. **Ground-Truth Segregation:** Diagnostic records strictly segregate `SUSPECTED` from `CONFIRMED` components. Unverified hunches never contaminate the failure pattern engine.
3. **Deterministic & Explainable:** Recommendations display verifiable case counts and success rates (e.g., *"38 historical cases $\rightarrow$ 29 confirmed Part X failures $\rightarrow$ 93% repair success rate"*). No opaque AI hallucinations.
4. **Closed-Loop Verification:** Repairs must conclude with an empirical test result (`SUCCESSFUL`, `PARTIAL`, `FAILED`, `UNREPAIRABLE`) before contributing to historical intelligence.

---

## Technology Stack

* **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** Node.js 24+, TypeScript, Fastify / Express REST API
* **Database & ORM:** PostgreSQL 16, Prisma ORM
* **Validation:** Zod (end-to-end schema validation)
* **Testing:** Vitest, Playwright, Supertest
* **Infrastructure:** Docker, Docker Compose

---

## Getting Started

### Prerequisites
* Node.js >= 20.x (Node 24 LTS recommended)
* Docker & Docker Compose (or local PostgreSQL 16 instance)

### Installation

```bash
# Clone the repository
git clone https://github.com/dhanushka-sys/Fixiq.git
cd Fixiq

# Install dependencies across all workspaces
npm install

# Start local PostgreSQL database
docker compose -f docker/docker-compose.yml up -d

# Run database migrations and seed realistic failure dataset
npm run db:migrate
npm run db:seed

# Start development servers (API & Web)
npm run dev
```

---

## Research & Documentation

* [Market Research](docs/research/market-research.md): Industry economics, Right to Repair, and micro-soldering margins.
* [Competitive Analysis](docs/research/existing-solutions.md): Teardown of RepairDesk, RepairShopr, RepairQ, InvenTree, and automotive analogs (Identifix).
* [Problem Validation](docs/research/problem-validation.md): The anatomy of lost diagnostic data and cost analysis.
* [User Personas](docs/research/user-personas.md): Operational journeys for junior technicians, master technicians, and shop owners.
* [Strategic Opportunity](docs/research/opportunity.md): Product thesis, defensibility, and commercialization roadmap.

---

## Contributing & Security

Please review:
* [AGENTS.md](AGENTS.md) for code structure, architectural rules, and multi-tenant invariants.
* [CONTRIBUTING.md](CONTRIBUTING.md) for pull request protocols and coding standards.
* [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines.

---

## License

This project is licensed under the [MIT License](LICENSE).
