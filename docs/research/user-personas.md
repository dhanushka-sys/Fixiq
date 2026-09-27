# User Personas & Journey Mapping

## Executive Summary

To build an intuitive system that technicians actually use under high-pressure bench conditions, Fixiq must be designed around real human workflows rather than abstract administrative ideals. This document defines the primary user personas, their operational environments, acute pain points, and specific "Aha!" moments within Fixiq.

---

## 1. Persona 1: The Bench Technician (Junior / Mid-Level)

### Profile: Alex Rivera (Age 24)
* **Role:** Electronics Repair Technician (2 years experience)
* **Skill Level:** Proficient in modular assembly (screens, batteries, charging ports); intermediate micro-soldering (can replace single-pin passives, basic SOIC/QFN ICs with hot air); beginner schematic reader.
* **Work Environment:** Cluttered workbench with a stereo microscope, Hakko micro-pencil soldering iron, hot air rework station, bench DC power supply, thermal camera, and a PC monitor mounted above the bench.
* **Volume:** Handles 8–14 repairs per day.

```text
┌────────────────────────────────────────────────────────┐
│ "I know how to solder clean joints, but when a laptop  │
│ has no power and no visible water damage, I don't know │
│ which of the 20 power rails to test first. I waste an  │
│ hour, guess, and end up bugging the lead tech."       │
└────────────────────────────────────────────────────────┘
```

### Key Frustrations
* **The "Blank Canvas" Intimidation:** Staring at an 8-layer motherboard schematic with 80 pages of circuitry without knowing where common failure points cluster on this specific model.
* **Comeback Guilt:** Replaces a visibly damaged capacitor, only for the device to return 10 days later because the degraded PWM driver that blew the capacitor wasn't addressed.
* **Hostile Ticketing Software:** Hates current POS systems (RepairDesk/RepairShopr) because they require clicking through dozens of accounting tabs just to log a technical note.

### Goals in Fixiq
* Get immediate, probabilistic guidance on what commonly fails on the specific device model on his bench.
* Learn standard diagnostic sequences and expected voltage rail readings without feeling incompetent or constantly interrupting senior staff.
* Complete technical documentation in under 60 seconds with structured click-to-select inputs.

### The Fixiq "Aha!" Moment
> Alex selects **Dell XPS 15 9500** and selects symptom **"No Power / 0.02A draw"**. Fixiq instantly shows:
> *"Historical Cases: 42. Top confirmed failure: Inductor PL301 shorted via High-Side MOSFET PQ302 (29 cases, 88% success rate)."*
> Alex touches his multimeter probe to PQ302: it reads $0.01\,\Omega$ to ground. Within 3 minutes, he has confirmed the root cause without guessing or escalating.

---

## 2. Persona 2: The Master Technician / Shop Lead

### Profile: Marcus Vance (Age 39)
* **Role:** Lead Diagnostic & Micro-Soldering Specialist (14 years experience)
* **Skill Level:** Master micro-soldering, BGA reballing, reverse-engineering schematics, trace rebuilding, data recovery.
* **Work Environment:** Dedicated ESD diagnostic lab; dual-screen workstation, digital storage oscilloscope, thermal imaging analyzer, ultrasonic cleaner.
* **Volume:** Handles the 3–5 most difficult logic board escalations daily and oversees 4 junior technicians.

```text
┌────────────────────────────────────────────────────────┐
│ "I spend 40% of my day answering the exact same        │
│ questions for junior techs: 'Check rail 3V3_S5',       │
│ 'Replace the dual diode near the battery connector.'   │
│ I can't do my own billable board repairs because I'm   │
│ everyone else's human search engine."                 │
└────────────────────────────────────────────────────────┘
```

### Key Frustrations
* **Knowledge Siphon:** His hard-earned diagnostic expertise is locked in his head; if he takes a week off, shop revenue and turnaround times plummet.
* **Lack of Historical Traceability:** Forgets a rare, obscure fault he solved on an Asus ROG laptop 8 months ago, having to re-diagnose it from scratch when another unit comes in.
* **Junior Quality Control:** Finding that junior techs closed tickets with "fixed" without documenting what parts they changed, making warranty rework a nightmare.

### Goals in Fixiq
* Turn his diagnostic knowledge into permanent, structured shop assets that junior techs query first before escalating.
* Record complex, multi-component diagnostic observations (e.g., thermal hotspots, diode mode drops, cascade failures).
* Review escalated repairs with full access to what junior techs already tested and ruled out.

### The Fixiq "Aha!" Moment
> Marcus takes a day off. When he returns, the shop manager informs him that junior tech Alex successfully diagnosed and repaired two complex MacBook logic boards using the historical patterns Marcus documented two months prior. The shop maintained full turnaround velocity without him.

---

## 3. Persona 3: The Repair Shop Owner / Operations Manager

### Profile: Elena Rostova (Age 42)
* **Role:** Owner & Managing Director of a 2-location electronics repair business (7 technicians, 2 front-desk staff).
* **Focus:** Profit margins, turnaround times (TAT), first-time fix rates, warranty liability, technician retention.
* **Work Environment:** Front office, mobile dashboard, reviewing P&L reports, vendor parts accounts, customer feedback.

```text
┌────────────────────────────────────────────────────────┐
│ "Board repair is my highest-margin service, but it's   │
│ also my highest operational risk. Warranty comebacks   │
│ kill our profitability, and if Marcus leaves, my board │
│ repair department disappears with him."               │
└────────────────────────────────────────────────────────┘
```

### Key Frustrations
* **Unpredictable Diagnostic Margins:** Some board repairs take 20 minutes, others take 4 hours; quoting customers flat-rate pricing feels like gambling.
* **Dead Inventory Waste:** Technicians order expensive ICs and donor boards on "hunches," leaving $4,000 of unused silicon sitting in bins.
* **Customer Warranty Friction:** Disputed warranty claims where customers insist a repeat failure was caused by the previous repair, with no technical evidence to prove or disprove the claim.

### Goals in Fixiq
* Track operational diagnostic metrics: First-Time Fix Rate (FTFR), repeat failure rate by device model, and diagnostic turnaround time.
* Order spare components proactively based on real empirical failure frequencies rather than subjective technician guesses.
* Protect shop liability with an immutable technical audit trail of intake condition, diagnostic observations, parts replaced, and post-repair verification tests.

### The Fixiq "Aha!" Moment
> Elena opens the **Fixiq Analytics Dashboard** at the end of the quarter. She sees that warranty comebacks dropped from 11.2% to 4.1%, saving $3,800 in unbillable bench hours. Furthermore, Fixiq identified that a specific batch of replacement USB-C controller chips from a secondary vendor had a 35% failure rate, allowing her to claim a full supplier refund.

---

## 4. Persona 4: The Community Contributor / Open Hardware Researcher (Future Scope)

### Profile: Kai Tanaka (Age 31)
* **Role:** Right-to-Repair Advocate, Electronics Repair YouTuber, Open Hardware Contributor.
* **Focus:** Public repair documentation, reverse-engineering OEM design flaws, advocating for fair repair legislation.
* **Work Environment:** Lab workspace, camera rig, active across GitHub, Badcaps, and RepairWiki communities.

```text
┌────────────────────────────────────────────────────────┐
│ "OEMs constantly claim their hardware is reliable and  │
│ that independent repairs are dangerous. We need large- │
│ scale, empirical proof that certain devices have       │
│ systemic engineering defects (like flexgate or bad     │
│ power stages)."                                       │
└────────────────────────────────────────────────────────┘
```

### Key Frustrations
* Repair data is fragmented across thousands of video comments, forum posts, and Reddit threads.
* No standardized, anonymized format exists to aggregate real repair outcomes across multiple independent shops.

### Goals in Fixiq
* Query and contribute to open, anonymized device failure knowledge graphs.
* Use empirical data to prove manufacturer design flaws to regulatory bodies and consumer protection agencies.

---

## 5. End-to-End User Journey Comparison

The table below contrasts the technician's journey in traditional repair software versus Fixiq:

```text
JOURNEY STEP      TRADITIONAL RSMS (Status Quo)             FIXIQ INTELLIGENCE PLATFORM
────────────────────────────────────────────────────────────────────────────────────────────────
1. Intake         Enters customer name, serial number,      Enters customer & device; selects
                  and free-text problem: "laptop dead".     categorized symptoms (Power > No Power)
                                                            and records intake physical conditions.

2. Diagnostic     Technician opens ticket; blank notes      Technician opens ticket; Fixiq displays:
   Triage         box. Must search Google/forums or         "Dell 5420: 38 historical cases with No Power.
                  probe blindly.                            Top confirmed failure: TPS65988 (76%)."

3. Investigation  Probes rails; writes notes on scrap       Inputs quantitative observations (5V 0.00A;
                  paper. No tracking of ruled-out parts.    PPBUS shorted). Flags TPS65988 as SUSPECTED.

4. Intervention   Replaces IC; writes "fixed" in POS.       Replaces IC; updates status to CONFIRMED.
                                                            Records specific part number & donor source.

5. Verification   Boots laptop; immediately closes ticket.  Follows standardized post-repair test:
                                                            Verifies 20V negotiation, thermal delta.
                                                            Logs outcome: SUCCESSFUL.

6. Feedback Loop  Knowledge is lost. Nothing changes for    Fixiq increments evidence count:
                  future repairs.                           TPS65988 cases = 39, success rate = 94%.
                                                            Intelligence engine updates instantly!
```
