'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Laptop,
  Search,
  Plus,
  ArrowRight,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';

const DEVICES_DATA = [
  {
    model: 'Dell Latitude 5420',
    brand: 'Dell',
    boardNumber: 'LA-K491P',
    cpuArch: 'Intel Tiger Lake 11th Gen',
    formFactor: '14" Laptop',
    repairCount: 84,
    topFailureIC: 'TPS65988 (USB-PD)',
  },
  {
    model: 'ThinkPad T14 Gen 2',
    brand: 'Lenovo',
    boardNumber: 'NM-D351',
    cpuArch: 'AMD Ryzen Pro 5000 Series',
    formFactor: '14" Laptop',
    repairCount: 62,
    topFailureIC: 'TPS65988DJ (Thunderbolt)',
  },
  {
    model: 'MacBook Pro 16" (A2141)',
    brand: 'Apple',
    boardNumber: '820-01700-A',
    cpuArch: 'Intel Core i9 + T2 Security',
    formFactor: '16" Laptop',
    repairCount: 91,
    topFailureIC: 'CD3217B12 (Type-C PD)',
  },
  {
    model: 'HP EliteBook 840 G7',
    brand: 'HP',
    boardNumber: '6050A3136201',
    cpuArch: 'Intel Comet Lake 10th Gen',
    formFactor: '14" Ultrabook',
    repairCount: 45,
    topFailureIC: 'ISL9538H (Charger)',
  },
  {
    model: 'MacBook Air M1 (A2337)',
    brand: 'Apple',
    boardNumber: '820-02016',
    cpuArch: 'Apple Silicon M1',
    formFactor: '13.3" Laptop',
    repairCount: 78,
    topFailureIC: '3V3_G3H Rail Short',
  },
  {
    model: 'ThinkPad X1 Carbon Gen 9',
    brand: 'Lenovo',
    boardNumber: 'NM-D141',
    cpuArch: 'Intel Tiger Lake vPro',
    formFactor: '14" Laptop',
    repairCount: 39,
    topFailureIC: 'TPS65994AD (Type-C)',
  },
];

export default function DevicesPage() {
  const [search, setSearch] = useState('');

  const filtered = DEVICES_DATA.filter(
    (d) =>
      search === '' ||
      d.model.toLowerCase().includes(search.toLowerCase()) ||
      d.boardNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              <Laptop className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Hardware Registry
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              1,284 Devices Tracked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Motherboard schematic database, architecture profiles, and historical failure linkage.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search make, model, board #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((device) => (
          <div
            key={device.model}
            className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {device.brand}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {device.model}
                  </h3>
                  <span className="text-xs text-slate-500">{device.formFactor}</span>
                </div>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-700">
                  {device.boardNumber}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Architecture: </span>
                  {device.cpuArch}
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Top Failure IC: </span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">{device.topFailureIC}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-white font-bold">{device.repairCount}</strong> Historical Repairs
              </span>
              <Link
                href="/workbench"
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Diagnose</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
