# System Architecture: High-Level Overview

## Architectural Pattern: Modular Monolith

Fixiq is designed as a **Modular Monolith** in TypeScript. This pattern was deliberately selected over distributed microservices for several core reasons:

1. **Transactional Integrity:** Diagnostics, repairs, component allocations, and test outcomes frequently require atomic database transactions across domain boundaries.
2. **Operational Simplicity:** Independent repair shops and single-server deployments can run Fixiq with a single `docker compose` command without Kubernetes or distributed messaging infrastructure.
3. **High Velocity with Low Latency:** At-bench diagnostic queries execute in under 10ms with zero network hops between distributed services.
4. **Clean Domain Boundaries:** Modules are logically partitioned with explicit interfaces. If a specific module (such as the Global Community Intelligence Engine) ever requires independent horizontal scaling in the future, it can be extracted without refactoring business logic.

---

## High-Level Topology

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (Web)                   │
│ Next.js 15 App Router (SSR + Client Components)       │
│ Tailwind CSS + shadcn/ui Design Tokens                │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / JSON REST API
                           ▼
┌────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                   │
│ Fastify / Express Router with Zod Schema Validation    │
│ Authentication & Organization Context Middleware       │
└──────────────────────────┬─────────────────────────────┘
                           │
 ┌─────────────────────────┴─────────────────────────────┐
 │                 DOMAIN MODULES LAYER                  │
 │                                                       │
 │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
 │  │   Identity   │  │Organization  │  │   Customer   │ │
 │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
 │         │                 │                 │         │
 │  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐ │
 │  │    Device    │  │  Repair Job  │  │  Diagnostics │ │
 │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
 │         │                 │                 │         │
 │  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐ │
 │  │  Components  │  │ Intelligence │  │  Analytics   │ │
 │  └──────────────┘  └──────────────┘  └──────────────┘ │
 └─────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                PERSISTENCE & DATA LAYER                │
│ Prisma ORM Client (with Organization Isolation Filter) │
│ PostgreSQL 16 Relational Engine                        │
└────────────────────────────────────────────────────────┘
```

---

## Data Flow: From Bench Action to Explainable Intelligence

```text
1. Technician Intake
   - Device registered with Make, Model, Serial, Asset ID.
   - Physical intake conditions and initial symptoms logged.

2. Diagnostic Bench Work
   - Technician probes board and enters electrical observations:
     * USB-C VBUS ammeter reading (e.g., 5V 0.00A).
     * Power rail voltages and diode-mode impedance to ground.
   - Technician tags SUSPECTED component (e.g., U7000 / ISL9240).

3. Repair Intervention & Confirmation
   - Component is replaced or repaired.
   - Component status updated to CONFIRMED (or NOT_FAULTY if test fails).
   - Specific part number and donor source recorded.

4. Empirical Test Verification
   - Post-repair stress test conducted (thermal, charging, power sequencing).
   - Outcome recorded: SUCCESSFUL, PARTIAL, or FAILED.

5. Intelligence Engine Aggregation
   - If outcome is SUCCESSFUL, intelligence engine updates the historical
     association index for (DeviceModel + Symptom -> ConfirmedComponent).
   - Evidence confidence score is recalculated deterministically.
   - Repeat failure detection monitors for matching device serials within 90 days.
```
