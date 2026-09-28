'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Laptop,
  Layers,
  ArrowRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Database,
  Terminal,
  Cpu,
  Users,
  Network,
  BarChart3,
  Clock,
  Sparkles,
  Check,
  ShieldAlert,
} from 'lucide-react';

export default function OverviewPage() {
  const activeRepairsList = [
    {
      id: 'FIX-1092',
      device: 'Dell Latitude 5420',
      board: 'LA-K491P',
      customer: 'Vertex Corp',
      technician: 'Dhanushka M.',
      status: 'DIAGNOSIS',
      statusColor: 'cyan',
      symptom: '5V VBUS 0.00A / No Power',
      timeInBench: '24m',
    },
    {
      id: 'FIX-1091',
      device: 'ThinkPad T14 Gen 2',
      board: 'NM-D351',
      customer: 'Apex Logistics',
      technician: 'Kamal P.',
      status: 'REPAIRING',
      statusColor: 'amber',
      symptom: 'Stuck at 20V / 0.02A (U112 Short)',
      timeInBench: '1h 12m',
    },
    {
      id: 'FIX-1090',
      device: 'MacBook Pro 16" (A2141)',
      board: '820-01700',
      customer: 'Dr. Silva',
      technician: 'Dhanushka M.',
      status: 'TESTING',
      statusColor: 'emerald',
      symptom: 'CD3217 Replaced (Verifying 20V Load)',
      timeInBench: '45m',
    },
    {
      id: 'FIX-1089',
      device: 'HP EliteBook 840 G7',
      board: '6050A3136201',
      customer: 'TechCare Ltd',
      technician: 'Nimal S.',
      status: 'AWAITING_PARTS',
      statusColor: 'purple',
      symptom: 'ISL9538H Charger IC Sourcing',
      timeInBench: '3h',
    },
  ];

  const recentGroundTruthList = [
    {
      chip: 'TPS65988',
      designator: 'UT2',
      model: 'Dell Latitude 5420',
      board: 'LA-K491P',
      probability: '76.5%',
      verifiedCases: '36 of 47',
      outcome: 'SUCCESSFUL',
    },
    {
      chip: 'CD3217B12',
      designator: 'U3100',
      model: 'MacBook Pro 16" A2141',
      board: '820-01700',
      probability: '88.2%',
      verifiedCases: '45 of 51',
      outcome: 'SUCCESSFUL',
    },
    {
      chip: 'BQ24780S',
      designator: 'PU301',
      model: 'ThinkPad T14 Gen 2',
      board: 'NM-D351',
      probability: '68.8%',
      verifiedCases: '22 of 32',
      outcome: 'SUCCESSFUL',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Overview
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Repair intelligence dashboard — operational bench tracking &amp; empirical hardware knowledge graph.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex items-center space-x-2.5">
          <Link
            href="/workbench"
            className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-xl shadow-sm hover:shadow-cyan-500/20 transition-all flex items-center space-x-2 active:scale-95"
          >
            <Terminal className="h-4 w-4" />
            <span>Launch Bench</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Primary 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Repairs */}
        <Link
          href="/repairs"
          className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-400/50 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Repairs</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">24</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              4 Testing
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">On bench across 3 technicians</p>
        </Link>

        {/* Devices Tracked */}
        <Link
          href="/devices"
          className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-400/50 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Devices Tracked</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Laptop className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">1,284</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
              Indexed
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Dell, Lenovo, Apple, HP motherboards</p>
        </Link>

        {/* Failure Patterns */}
        <Link
          href="/patterns"
          className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-400/50 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Failure Patterns</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">38</span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/40">
              Topologies
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Empirically confirmed IC root causes</p>
        </Link>

        {/* First-Time Fix Rate */}
        <Link
          href="/analytics"
          className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-400/50 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>First-Time Fix Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">94.2%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              +19.8%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">3.8% low warranty comeback rate</p>
        </Link>
      </div>

      {/* The Two Distinct Architectural Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pillar 1: Repair Operations */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Operational Foundation
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Repair Operations
              </h2>
            </div>
            <Link
              href="/repairs"
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View All 24 Jobs</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intake devices, manage customers, schedule repairs, and track technician bench throughput.
          </p>

          {/* Quick Sub-Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <Link
              href="/devices"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 transition-all text-center group"
            >
              <Laptop className="h-4 w-4 mx-auto text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Devices</span>
              <span className="text-[10px] text-slate-400">1,284 Catalog</span>
            </Link>

            <Link
              href="/repairs"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 transition-all text-center group"
            >
              <Wrench className="h-4 w-4 mx-auto text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Repair Jobs</span>
              <span className="text-[10px] text-slate-400">24 Active</span>
            </Link>

            <Link
              href="/customers"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 transition-all text-center group"
            >
              <Users className="h-4 w-4 mx-auto text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Customers</span>
              <span className="text-[10px] text-slate-400">Profiles &amp; CRM</span>
            </Link>

            <Link
              href="/components"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 transition-all text-center group"
            >
              <Cpu className="h-4 w-4 mx-auto text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Components</span>
              <span className="text-[10px] text-slate-400">IC Inventory</span>
            </Link>
          </div>

          {/* Active Queue Snapshot */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Active Bench Queue:
            </span>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950/40">
              {activeRepairsList.map((job) => (
                <div key={job.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{job.id}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{job.device}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {job.board}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{job.symptom}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.status === 'DIAGNOSIS'
                          ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                          : job.status === 'REPAIRING'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : job.status === 'TESTING'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {job.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{job.timeInBench}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 2: Failure Intelligence */}
        <div className="glass-panel-elevated p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Ground-Truth Core
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Failure Intelligence
              </h2>
            </div>
            <Link
              href="/patterns"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>Explore 38 Patterns</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explainable Bayesian probabilities derived strictly from confirmed IC replacements and verified load tests.
          </p>

          {/* Quick Sub-Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <Link
              href="/workbench"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all text-center group"
            >
              <Terminal className="h-4 w-4 mx-auto text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Bench Tool</span>
              <span className="text-[10px] text-slate-400">Live Telemetry</span>
            </Link>

            <Link
              href="/patterns"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all text-center group"
            >
              <Layers className="h-4 w-4 mx-auto text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Patterns</span>
              <span className="text-[10px] text-slate-400">38 Topologies</span>
            </Link>

            <Link
              href="/relations"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all text-center group"
            >
              <Network className="h-4 w-4 mx-auto text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Relations</span>
              <span className="text-[10px] text-slate-400">Pin Graph</span>
            </Link>

            <Link
              href="/analytics"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all text-center group"
            >
              <BarChart3 className="h-4 w-4 mx-auto text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Analytics</span>
              <span className="text-[10px] text-slate-400">Comeback Metrics</span>
            </Link>
          </div>

          {/* Ground-Truth Feed Snapshot */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Recent Verified Root Causes:
            </span>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950/40">
              {recentGroundTruthList.map((item) => (
                <div key={item.chip} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.chip}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {item.designator}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.model}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Confirmed in {item.verifiedCases} similar cases
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                      {item.probability}
                    </span>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center space-x-0.5 justify-end">
                      <Check className="h-3 w-3" />
                      <span>{item.outcome}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
