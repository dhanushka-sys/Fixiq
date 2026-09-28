'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

const REPAIRS_LIST = [
  {
    id: 'FIX-1092',
    device: 'Dell Latitude 5420',
    board: 'LA-K491P',
    serial: '4F92KL3',
    customer: 'Vertex Corp',
    technician: 'Dhanushka M.',
    status: 'DIAGNOSIS',
    priority: 'HIGH',
    symptom: '5V VBUS 0.00A / Won’t Turn On',
    intakeDate: 'Today, 09:30 AM',
  },
  {
    id: 'FIX-1091',
    device: 'ThinkPad T14 Gen 2',
    board: 'NM-D351',
    serial: 'PF38Z49',
    customer: 'Apex Logistics',
    technician: 'Kamal P.',
    status: 'REPAIRING',
    priority: 'NORMAL',
    symptom: 'Stuck at 20V / 0.02A (U112 Short to GND)',
    intakeDate: 'Today, 08:15 AM',
  },
  {
    id: 'FIX-1090',
    device: 'MacBook Pro 16" (A2141)',
    board: '820-01700-A',
    serial: 'C02DP0XXMD6M',
    customer: 'Dr. Silva',
    technician: 'Dhanushka M.',
    status: 'TESTING',
    priority: 'RUSH',
    symptom: 'CD3217 Replaced — Running 20V Load Verification',
    intakeDate: 'Yesterday',
  },
  {
    id: 'FIX-1089',
    device: 'HP EliteBook 840 G7',
    board: '6050A3136201',
    serial: '5CG0391K8L',
    customer: 'TechCare Ltd',
    technician: 'Nimal S.',
    status: 'AWAITING_PARTS',
    priority: 'NORMAL',
    symptom: 'ISL9538H Charger IC shorted on phase inductor',
    intakeDate: 'Yesterday',
  },
  {
    id: 'FIX-1088',
    device: 'MacBook Air M1 (A2337)',
    board: '820-02016',
    serial: 'C02G90XXQ6L4',
    customer: 'Kasun Bandara',
    technician: 'Dhanushka M.',
    status: 'COMPLETED',
    priority: 'NORMAL',
    symptom: 'Liquid damage on 3V3_G3H rail / Capacitor replaced',
    intakeDate: 'Sep 26',
  },
];

export default function RepairsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = REPAIRS_LIST.filter((r) => {
    const matchSearch =
      search === '' ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.device.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.board.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <Wrench className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Repair Jobs
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              24 Active Jobs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Operational repair workflow — intake tickets, bench assignments, and closed-loop verification.
          </p>
        </div>

        <Link
          href="/workbench"
          className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-xl shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Repair Intake</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'DIAGNOSIS', 'REPAIRING', 'TESTING', 'AWAITING_PARTS', 'COMPLETED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket, device, board..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Repairs Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
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
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {r.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{r.device}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{r.board} • S/N: {r.serial}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                    {r.symptom}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {r.customer}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {r.technician}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'DIAGNOSIS'
                          ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                          : r.status === 'REPAIRING'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : r.status === 'TESTING'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : r.status === 'COMPLETED'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/workbench"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-600 hover:text-white dark:bg-slate-800 dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 font-semibold transition-all inline-flex items-center space-x-1"
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
