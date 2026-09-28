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
  X,
  Filter,
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
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  const brands = ['ALL', 'Dell', 'Lenovo', 'Apple', 'HP'];

  const filtered = DEVICES_DATA.filter((d) => {
    const matchesSearch =
      search === '' ||
      d.model.toLowerCase().includes(search.toLowerCase()) ||
      d.boardNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.brand.toLowerCase().includes(search.toLowerCase()) ||
      d.cpuArch.toLowerCase().includes(search.toLowerCase()) ||
      d.topFailureIC.toLowerCase().includes(search.toLowerCase());

    const matchesBrand = selectedBrand === 'ALL' || d.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <span>Repair Operations</span>
            <span>•</span>
            <span>Schematics Catalog</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hardware Registry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Motherboard schematic database, architecture profiles, and historical failure linkage.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/workbench"
          className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm hover:shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 self-start sm:self-auto active:scale-95"
        >
          <Terminal className="h-4 w-4" />
          <span>Launch Bench Diagnosis</span>
        </Link>
      </div>

      {/* Brand Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedBrand === b
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {b === 'ALL' ? 'All Brands' : b}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search model, board #, CPU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
          <Laptop className="h-8 w-8 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No devices found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No hardware profiles match &ldquo;{search}&rdquo;. Try another model or clear the brand filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedBrand('ALL');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((device) => (
          <div
            key={device.model}
            className="glass-card p-5 rounded-2xl space-y-4 hover:border-blue-400/50 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {device.brand}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {device.model}
                  </h3>
                  <span className="text-xs text-slate-500">{device.formFactor}</span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-700">
                  {device.boardNumber}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="text-slate-600 dark:text-slate-400">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Architecture</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{device.cpuArch}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Primary Failure IC</span>
                  <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">{device.topFailureIC}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                <strong className="text-slate-900 dark:text-white">{device.repairCount}</strong> repairs logged
              </span>

              <Link
                href="/workbench"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-bold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
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
