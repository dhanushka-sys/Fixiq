'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  GitBranch,
  Terminal,
  Database,
  Layers,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            System Invariants &amp; Architecture
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            AGENTS.md Standard
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fixiq is engineered around 5 non-negotiable architectural invariants to maintain ground-truth hardware data purity.
        </p>
      </div>

      {/* 5 Invariants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Invariant 1 */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <Lock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Multi-Tenant Isolation (Zero Trust)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Fixiq is strictly multi-tenant. Every tenant-scoped entity (<code className="text-cyan-700 dark:text-cyan-300">Customer</code>, <code className="text-cyan-700 dark:text-cyan-300">Device</code>, <code className="text-cyan-700 dark:text-cyan-300">RepairJob</code>, <code className="text-cyan-700 dark:text-cyan-300">DiagnosticObservation</code>) belongs to an <code className="text-cyan-700 dark:text-cyan-300">Organization</code>. Every query filters by <code className="text-cyan-700 dark:text-cyan-300 font-mono">organizationId</code>. Zero frontend trust.
          </p>
        </div>

        {/* Invariant 2 */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Suspected vs. Confirmed Segregation
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Diagnostic records strictly isolate <strong className="text-amber-600 dark:text-amber-400">SUSPECTED</strong> hypotheses from <strong className="text-emerald-600 dark:text-emerald-400">CONFIRMED</strong> components proven faulty after micro-soldering replacement. Guesswork never pollutes the failure pattern engine.
          </p>
        </div>

        {/* Invariant 3 */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Deterministic &amp; Explainable Intel
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The failure engine is 100% deterministic and mathematically auditable. Recommendations display exact empirical sample sizes, confirmed counts, and Bayesian probability ratios. No generative hallucinations.
          </p>
        </div>

        {/* Invariant 4 */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Modular Monolith Boundaries
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            No distributed microservice overhead. Domains (<code className="text-amber-700 dark:text-amber-300">repairs</code>, <code className="text-amber-700 dark:text-amber-300">diagnostics</code>, <code className="text-amber-700 dark:text-amber-300">intelligence</code>, <code className="text-amber-700 dark:text-amber-300">analytics</code>) communicate via exported TypeScript service interfaces, never by querying foreign database tables directly.
          </p>
        </div>

        {/* Invariant 5 */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Closed-Loop Verification
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A repair is only complete when a verification test is logged (<code className="text-emerald-700 dark:text-emerald-300">SUCCESSFUL</code>, <code className="text-amber-700 dark:text-amber-300">PARTIAL</code>, <code className="text-rose-700 dark:text-rose-300">FAILED</code>, <code className="text-slate-500">UNREPAIRABLE</code>). Only <code className="text-emerald-700 dark:text-emerald-300 font-bold">SUCCESSFUL</code> repairs contribute positively to failure relationship scoring.
          </p>
        </div>

        {/* Monorepo Structure Summary */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              06
            </div>
            <GitBranch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Monorepo Package Structure
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Structured into npm workspaces: <code className="text-blue-700 dark:text-blue-300">apps/web</code> (Next.js 15), <code className="text-blue-700 dark:text-blue-300">apps/api</code> (Express REST API), <code className="text-blue-700 dark:text-blue-300">packages/database</code> (Prisma ORM), <code className="text-blue-700 dark:text-blue-300">packages/shared</code>, and <code className="text-blue-700 dark:text-blue-300">packages/validation</code> (Zod).
          </p>
        </div>
      </div>

      {/* JSON Payload Inspection Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center space-x-2">
          <FileCode className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Sample Deterministic Intelligence Output Payload
          </h3>
        </div>
        <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
{`{
  "symptom": "NO_POWER",
  "model": "ThinkPad T14 Gen 2",
  "board": "NM-D351",
  "confirmedComponent": "TPS65988DJ",
  "designator": "U112",
  "totalSimilarCases": 51,
  "confirmedCases": 42,
  "successfulRepairs": 40,
  "confidence": "HIGH",
  "evidenceStrength": 0.824,
  "isolatedSuspectedCount": 7,
  "verificationOutcomes": {
    "SUCCESSFUL": 40,
    "PARTIAL": 2
  }
}`}
        </pre>
      </div>
    </div>
  );
}
