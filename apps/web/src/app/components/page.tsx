'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Search,
  Filter,
  Plus,
  ArrowRight,
  PackageCheck,
  AlertTriangle,
} from 'lucide-react';

const COMPONENTS_DATA = [
  {
    partNumber: 'TPS65988',
    category: 'USB_PD_CONTROLLER',
    manufacturer: 'Texas Instruments',
    packageType: 'QFN-56 (7x7mm)',
    inStock: 18,
    typicalDesignators: ['UT2', 'U112', 'UT1'],
    compatibleBoards: ['Dell LA-K491P', 'Lenovo NM-D351'],
    unitCost: '$12.50',
  },
  {
    partNumber: 'CD3217B12',
    category: 'USB_PD_CONTROLLER',
    manufacturer: 'Texas Instruments / Apple',
    packageType: 'BGA-49',
    inStock: 12,
    typicalDesignators: ['U3100', 'U3200', 'UB300', 'UB400'],
    compatibleBoards: ['Apple 820-01700', 'Apple 820-02016'],
    unitCost: '$18.00',
  },
  {
    partNumber: 'BQ24780S',
    category: 'CHARGING_IC',
    manufacturer: 'Texas Instruments',
    packageType: 'QFN-28 (4x4mm)',
    inStock: 25,
    typicalDesignators: ['PU301', 'U7100'],
    compatibleBoards: ['Lenovo NM-D351', 'HP 6050A3136201'],
    unitCost: '$7.80',
  },
  {
    partNumber: 'ISL95855',
    category: 'PWM_VRM_CONTROLLER',
    manufacturer: 'Renesas / Intersil',
    packageType: 'QFN-48',
    inStock: 7,
    typicalDesignators: ['PU401', 'U7200'],
    compatibleBoards: ['Dell LA-F611P', 'HP EliteBook 840 G5'],
    unitCost: '$14.20',
  },
  {
    partNumber: 'IT8227E-128',
    category: 'EMBEDDED_CONTROLLER',
    manufacturer: 'ITE Tech',
    packageType: 'LQFP-128',
    inStock: 4,
    typicalDesignators: ['UE1', 'U14'],
    compatibleBoards: ['Lenovo NM-D351', 'IdeaPad 5'],
    unitCost: '$9.50',
  },
];

export default function ComponentsPage() {
  const [search, setSearch] = useState('');

  const filtered = COMPONENTS_DATA.filter(
    (c) =>
      search === '' ||
      c.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <Cpu className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Component Inventory
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              480 Solderable ICs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Micro-soldering IC inventory, package footprints, circuit designators, and sourcing.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search part #, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.partNumber}
            className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {item.partNumber}
                  </h3>
                  <span className="text-xs text-slate-500">{item.manufacturer}</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                    item.inStock > 5
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {item.inStock} In Stock
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Package: </span>
                  <span className="font-mono">{item.packageType}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Typical Designators: </span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">
                    {item.typicalDesignators.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {item.unitCost} <span className="font-normal text-slate-500 text-[10px]">/ unit</span>
              </span>
              <Link
                href="/workbench"
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Check Bench Match</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
