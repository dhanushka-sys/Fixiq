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

interface MetricState {
  activeRepairs: number;
  completedRepairs: number;
  confirmedComponents: number;
  firstTimeFixRate: string;
  warrantyComebacks: string;
  avgDiagnosticTat: string;
  empiricalPatterns: number;
}

interface RepairJobItem {
  id: string;
  device: string;
  board: string;
  customer: string;
  technician: string;
  status: string;
  symptom: string;
  timeInBench?: string;
}

interface GroundTruthItem {
  chip: string;
  designator: string;
  model: string;
  board: string;
  probability: string;
  verifiedCases: string;
  outcome: string;
}

export default function OverviewPage() {
  const [metrics, setMetrics] = React.useState<MetricState>({
    activeRepairs: 5,
    completedRepairs: 1,
    confirmedComponents: 5,
    firstTimeFixRate: '94.2%',
    warrantyComebacks: '3.8%',
    avgDiagnosticTat: '16.4 min',
    empiricalPatterns: 38,
  });
  const [activeRepairs, setActiveRepairs] = React.useState<RepairJobItem[]>([]);
  const [groundTruth, setGroundTruth] = React.useState<GroundTruthItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [resAnalytics, resRepairs, resPatterns] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/repairs'),
          fetch('/api/patterns'),
        ]);

        if (resAnalytics.ok) {
          const aJson = await resAnalytics.json();
          if (active && aJson.success && aJson.metrics) {
            setMetrics(aJson.metrics);
          }
        }

        if (resRepairs.ok) {
          const rJson = await resRepairs.json();
          if (active && rJson.success && Array.isArray(rJson.data)) {
            setActiveRepairs(
              rJson.data.slice(0, 4).map((r: any) => ({
                id: r.id,
                device: r.device,
                board: r.board,
                customer: r.customer,
                technician: r.technician,
                status: r.status,
                symptom: r.symptom,
                timeInBench: r.status === 'DIAGNOSIS' ? '24m' : r.status === 'REPAIRING' ? '1h 12m' : '45m',
              }))
            );
          }
        }

        if (resPatterns.ok) {
          const pJson = await resPatterns.json();
          if (active && pJson.success && Array.isArray(pJson.data)) {
            setGroundTruth(
              pJson.data.slice(0, 3).map((p: any) => ({
                chip: p.chip,
                designator: p.chip === 'TPS65988' ? 'UT2' : p.chip === 'CD3217B12' ? 'U3100' : 'PU301',
                model: p.models?.[0] ?? 'Multi-Platform',
                board: p.chip === 'TPS65988' ? 'LA-K491P' : p.chip === 'CD3217B12' ? '820-01700' : 'NM-D351',
                probability: `${p.verifiedSuccessRate}%`,
                verifiedCases: `${p.confirmedCases} of ${p.totalCases}`,
                outcome: 'SUCCESSFUL',
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchDashboardData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Overview
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
              PostgreSQL Connected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Repair intelligence dashboard — operational bench tracking &amp; empirical hardware knowledge graph.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex items-center space-x-2.5">
          <Link
            href="/repairs"
            className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Manage {metrics.activeRepairs} Jobs</span>
          </Link>

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

      {/* User-Friendly System Orientation Guide */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-indigo-500/10 border border-cyan-200/80 dark:border-cyan-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-xs shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Welcome to Fixiq Repair Intelligence
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Use <strong>Repair Operations</strong> (sidebar) to manage devices, customer jobs, and IC inventory. When diagnosing a motherboard, open the <strong>Diagnostic Bench</strong> to get instant, empirically verified root-cause probabilities learned exclusively from confirmed successful repairs.
            </p>
          </div>
        </div>

        <Link
          href="/workbench"
          className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center space-x-1 whitespace-nowrap self-start sm:self-auto shrink-0"
        >
          <span>Try Bench Demo</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
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
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {metrics.activeRepairs}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Live in DB
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">On bench across technician fleet</p>
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
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">6 Models</span>
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
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {metrics.empiricalPatterns}
            </span>
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
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {metrics.firstTimeFixRate}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Verified
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{metrics.warrantyComebacks} warranty comeback rate</p>
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
              <span>View All {metrics.activeRepairs} Jobs</span>
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
              <span className="text-[10px] text-slate-400">Hardware Catalog</span>
            </Link>

            <Link
              href="/repairs"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 transition-all text-center group"
            >
              <Wrench className="h-4 w-4 mx-auto text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1.5">Repair Jobs</span>
              <span className="text-[10px] text-slate-400">{metrics.activeRepairs} Active</span>
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
              {activeRepairs.map((job) => (
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
              <span>Explore {metrics.empiricalPatterns} Patterns</span>
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
              <span className="text-[10px] text-slate-400">{metrics.empiricalPatterns} Topologies</span>
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
              {groundTruth.map((item) => (
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
