'use client';

import React, { useState, useEffect } from 'react';
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

interface ComponentItem {
  id: string;
  partNumber: string;
  category: string;
  manufacturer: string;
  packageType: string;
  inStock: number;
  typicalDesignators: string[];
  compatibleBoards: string[];
  unitCost: string;
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    let active = true;
    async function fetchComponents() {
      try {
        setLoading(true);
        const res = await fetch('/api/components');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active && json.success && Array.isArray(json.data)) {
          setComponents(json.data);
        }
      } catch (err) {
        console.error('Failed to load components from database:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchComponents();
    return () => {
      active = false;
    };
  }, []);

  const categories = [
    { id: 'ALL', label: 'All ICs' },
    { id: 'USB_PD_CONTROLLER', label: 'USB-PD' },
    { id: 'CHARGING_IC', label: 'Chargers' },
    { id: 'PWM_VRM_CONTROLLER', label: 'VRM / PWM' },
    { id: 'EMBEDDED_CONTROLLER', label: 'EC / SuperIO' },
  ];

  const filtered = components.filter((c) => {
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
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Component Inventory
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  PostgreSQL Live ({components.length})
                </span>
              </div>
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

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-16 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
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
