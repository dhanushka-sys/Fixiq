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
  X,
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
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All ICs' },
    { id: 'USB_PD_CONTROLLER', label: 'USB-PD' },
    { id: 'CHARGING_IC', label: 'Chargers' },
    { id: 'PWM_VRM_CONTROLLER', label: 'VRM / PWM' },
    { id: 'EMBEDDED_CONTROLLER', label: 'EC / SuperIO' },
  ];

  const filtered = COMPONENTS_DATA.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      c.compatibleBoards.some((b) => b.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <span>Repair Operations</span>
            <span>•</span>
            <span>Micro-Soldering Stock</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Component Inventory
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Micro-soldering IC inventory, package footprints, circuit designators, and sourcing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/workbench"
            className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-xl shadow-sm hover:shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Match On Bench</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Category Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search part #, board, package..."
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

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 space-y-3">
          <Cpu className="h-8 w-8 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No components found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No micro-soldering ICs match &ldquo;{search}&rdquo;. Try searching for another part number or clear category filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid of Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((item) => (
          <div
            key={item.partNumber}
            className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {item.partNumber}
                  </h3>
                  <span className="text-xs text-slate-500">{item.manufacturer}</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    item.inStock > 5
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {item.inStock} In Stock
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Package:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{item.packageType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Designators:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{item.typicalDesignators.join(', ')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Found on Boards:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.compatibleBoards.map((b) => (
                      <span key={b} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Est. Cost: <strong className="text-slate-900 dark:text-white font-bold">{item.unitCost}</strong>
              </span>

              <Link
                href="/workbench"
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-bold flex items-center space-x-1"
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
