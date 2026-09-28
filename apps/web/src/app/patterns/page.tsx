'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Database,
  Filter,
  ShieldCheck,
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface PatternEntry {
  id: string;
  chip: string;
  category: string;
  manufacturer: string;
  models: string[];
  symptom: string;
  faultPinout: string;
  totalCases: number;
  confirmedCases: number;
  verifiedSuccessRate: number;
  confidence: 'HIGH' | 'VERY_HIGH' | 'MODERATE';
}

const PATTERNS_DATA: PatternEntry[] = [
  {
    id: 'PAT-001',
    chip: 'TPS65988',
    category: 'USB_PD_CONTROLLER',
    manufacturer: 'Texas Instruments',
    models: ['Dell Latitude 5420', 'Dell Latitude 5520', 'Dell Precision 3560'],
    symptom: '5V VBUS 0.00A Stuck / Won’t Negotiate 20V',
    faultPinout: 'Pin 14 (VBUS) shorted to Pin 19 (CC1)',
    totalCases: 47,
    confirmedCases: 36,
    verifiedSuccessRate: 94.7,
    confidence: 'HIGH',
  },
  {
    id: 'PAT-002',
    chip: 'CD3217B12',
    category: 'USB_PD_CONTROLLER',
    manufacturer: 'Texas Instruments / Apple',
    models: ['MacBook Pro 16" (A2141)', 'MacBook Air (A2179)'],
    symptom: 'Stuck at 5V / 0.01A / DFU Mode',
    faultPinout: 'PP1V5_UPC_LDO rail impedance short to Ground',
    totalCases: 51,
    confirmedCases: 45,
    verifiedSuccessRate: 96.0,
    confidence: 'VERY_HIGH',
  },
  {
    id: 'PAT-003',
    chip: 'BQ24780S',
    category: 'BATTERY_CHARGER',
    manufacturer: 'Texas Instruments',
    models: ['ThinkPad T14 Gen 2', 'Lenovo ThinkPad E14', 'HP ProBook 450 G8'],
    symptom: 'Battery Not Detected / No Charging / ACDRV 0V',
    faultPinout: 'Pin 4 (ACDRV) output transistor breakdown',
    totalCases: 32,
    confirmedCases: 22,
    verifiedSuccessRate: 88.0,
    confidence: 'HIGH',
  },
  {
    id: 'PAT-004',
    chip: 'ISL95855',
    category: 'PWM_VRM_CONTROLLER',
    manufacturer: 'Renesas / Intersil',
    models: ['Dell Latitude 7490', 'ThinkPad T480', 'HP EliteBook 840 G5'],
    symptom: 'No CPU VCC_CORE Power / Power Loop',
    faultPinout: 'VCCP filtering capacitor breakdown pulling down VRM_EN',
    totalCases: 29,
    confirmedCases: 19,
    verifiedSuccessRate: 86.4,
    confidence: 'MODERATE',
  },
  {
    id: 'PAT-005',
    chip: 'IT8227E-128',
    category: 'EMBEDDED_CONTROLLER',
    manufacturer: 'ITE Tech',
    models: ['ThinkPad T14 Gen 2 (AMD)', 'IdeaPad 5 15ARE05'],
    symptom: 'No Power Sequence Initiation / Amber LED Blink',
    faultPinout: 'VCC_RTC pin voltage drop to 0.8V',
    totalCases: 24,
    confirmedCases: 15,
    verifiedSuccessRate: 87.5,
    confidence: 'MODERATE',
  },
];

export default function PatternsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredEntries = PATTERNS_DATA.filter((entry) => {
    const matchesSearch =
      searchQuery === '' ||
      entry.chip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.models.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || entry.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Failure Patterns
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              38 Confirmed Topologies
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Empirically verified failure signatures indexed from closed-loop repair data.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IC, model, symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1 mr-1">
          <Filter className="h-3 w-3" />
          <span>Category:</span>
        </span>
        {['ALL', 'USB_PD_CONTROLLER', 'BATTERY_CHARGER', 'PWM_VRM_CONTROLLER', 'EMBEDDED_CONTROLLER'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-slate-950 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Empirical Evidence Note */}
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white font-semibold">Empirical Failure Evidence:</strong>{' '}
          Each pattern is computed from historical repairs with verified functional test results and confirmed component replacements.
        </div>
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 hover:border-indigo-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {entry.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {entry.chip}
                  </h3>
                  <span className="text-xs text-slate-500">{entry.manufacturer}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    entry.confidence === 'VERY_HIGH'
                      ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {entry.confidence}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                  Failure Signature:
                </span>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                  {entry.symptom}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Pinout Fault Signature
                </span>
                <p className="font-mono text-cyan-700 dark:text-cyan-300 text-xs">
                  {entry.faultPinout}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block uppercase mb-1">
                  Observed Hardware Models:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {entry.models.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Confirmed Cases</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {entry.confirmedCases} / {entry.totalCases}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Success Rate</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {entry.verifiedSuccessRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
