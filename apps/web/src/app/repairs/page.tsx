'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Laptop,
  User,
  X,
} from 'lucide-react';

interface RepairItem {
  id: string;
  rawId?: string;
  device: string;
  board: string;
  serial: string;
  customer: string;
  technician: string;
  status: string;
  priority: string;
  symptom: string;
  intakeDate: string;
}

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<RepairItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let active = true;
    async function fetchRepairs() {
      try {
        setLoading(true);
        const res = await fetch('/api/repairs');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active && json.success && Array.isArray(json.data)) {
          setRepairs(json.data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch repairs from database:', err);
        if (active) setError('Database connection unavailable');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchRepairs();
    return () => {
      active = false;
    };
  }, []);

  const filterOptions = [
    { id: 'ALL', label: 'All Jobs', count: repairs.length },
    { id: 'DIAGNOSIS', label: 'Diagnosis', count: repairs.filter((r) => r.status === 'DIAGNOSIS').length },
    { id: 'REPAIRING', label: 'Repairing', count: repairs.filter((r) => r.status === 'REPAIRING').length },
    { id: 'TESTING', label: 'Testing', count: repairs.filter((r) => r.status === 'TESTING').length },
    { id: 'AWAITING_PARTS', label: 'Parts', count: repairs.filter((r) => r.status === 'AWAITING_PARTS').length },
    { id: 'COMPLETED', label: 'Completed', count: repairs.filter((r) => r.status === 'COMPLETED').length },
  ];

  const filtered = repairs.filter((r) => {
    const matchSearch =
      search === '' ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.device.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.board.toLowerCase().includes(search.toLowerCase()) ||
      r.serial.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DIAGNOSIS':
        return 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'REPAIRING':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'TESTING':
        return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'AWAITING_PARTS':
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'COMPLETED':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <span>Repair Operations</span>
            <span>•</span>
            <span>Intake Queue</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Repair Jobs
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PostgreSQL Live ({repairs.length})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Active workbench tickets, technician assignments, and verification state transitions.
              </p>
            </div>
          </div>
        </div>

        {/* New Ticket CTA */}
        <Link
          href="/workbench"
          className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-xl shadow-sm hover:shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Repair Intake</span>
        </Link>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Scrollable status filter pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                statusFilter === opt.id
                  ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === opt.id
                  ? 'bg-white/20 text-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket, device, board, S/N..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 space-y-3">
          <Wrench className="h-8 w-8 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No matching repair jobs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No tickets match your filter criteria. Try adjusting your search term or clearing the status filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Mobile Card List View (< sm screens) */}
      <div className="sm:hidden space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
          >
            {/* Top row: Ticket ID and Status */}
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400">
                {r.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(r.status)}`}>
                {r.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Device Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.device}</h3>
              <p className="font-mono text-xs text-slate-500 mt-0.5">{r.board} • S/N: {r.serial}</p>
            </div>

            {/* Symptom */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-500 text-[10px] uppercase block mb-0.5">Symptom</span>
              {r.symptom}
            </div>

            {/* Customer & Technician details */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <span>{r.customer}</span>
              <span>Tech: <strong className="text-slate-700 dark:text-slate-300">{r.technician}</strong></span>
            </div>

            {/* Action button */}
            <Link
              href="/workbench"
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Open Diagnostic Bench</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Structured Table View (>= sm screens) */}
      <div className="hidden sm:block glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Device &amp; Board</th>
                <th className="py-3 px-4">Symptom</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                    {r.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 dark:text-white block">{r.device}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{r.board} • S/N: {r.serial}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                    {r.symptom}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {r.customer}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {r.technician}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(r.status)}`}>
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href="/workbench"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 font-semibold transition-all inline-flex items-center space-x-1"
                    >
                      <Terminal className="h-3 w-3" />
                      <span>Bench</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
