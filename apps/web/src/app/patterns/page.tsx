'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Database,
  Filter,
  ShieldCheck,
  ArrowRight,
  Terminal,
  X,
  CheckCircle2,
  Sparkles,
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

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<PatternEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('ALL');

  useEffect(() => {
    let active = true;
    async function fetchPatterns() {
      try {
        setLoading(true);
        const res = await fetch('/api/patterns');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active && json.success && Array.isArray(json.data)) {
          setPatterns(json.data);
        }
      } catch (err) {
        console.error('Failed to load patterns from database:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchPatterns();
    return () => {
      active = false;
    };
  }, []);

  const confidences = ['ALL', 'VERY_HIGH', 'HIGH', 'MODERATE'];

  const filteredEntries = patterns.filter((entry) => {
    const matchesSearch =
      searchQuery === '' ||
      entry.chip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.faultPinout.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.models.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesConfidence =
      selectedConfidence === 'ALL' || entry.confidence === selectedConfidence;

    return matchesSearch && matchesConfidence;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <span>Intelligence Catalog</span>
            <span>•</span>
            <span>Empirical Knowledge Graph</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Failure Patterns
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  PostgreSQL Live ({patterns.length})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Empirically verified failure signatures indexed from closed-loop repair data.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/workbench"
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 self-start sm:self-auto active:scale-95"
        >
          <Terminal className="h-4 w-4" />
          <span>Test Symptoms On Bench</span>
        </Link>
      </div>

      {/* Easy-to-Understand Educational Explainer */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3.5">
        <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 dark:text-white font-bold block text-sm">
            How Fixiq Failure Intelligence Works:
          </strong>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            Every time a technician successfully replaces a component and verifies it with a functional load test, Fixiq indexes the exact symptom, pinout failure mode, and motherboard model. When similar devices arrive, technicians immediately see the verified statistical root cause.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {confidences.map((conf) => (
            <button
              key={conf}
              onClick={() => setSelectedConfidence(conf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedConfidence === conf
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {conf === 'ALL' ? 'All Confidence' : conf.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IC, model, symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="h-4 w-60 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-10 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEntries.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 space-y-3">
          <Layers className="h-8 w-8 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No patterns found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No failure patterns match &ldquo;{searchQuery}&rdquo;. Try another IC or symptom.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedConfidence('ALL');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pattern Cards List */}
      <div className="space-y-4">
        {filteredEntries.map((pattern) => (
          <div
            key={pattern.id}
            className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4 hover:border-indigo-400/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">
                  {pattern.chip}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {pattern.manufacturer}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {pattern.category.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    pattern.confidence === 'VERY_HIGH'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : pattern.confidence === 'HIGH'
                      ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {pattern.confidence} CONFIDENCE
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {pattern.verifiedSuccessRate}% Fix Rate
                </span>
              </div>
            </div>

            {/* Core Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Observable Symptom:</span>
                  <span className="font-semibold text-slate-900 dark:text-white block">{pattern.symptom}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Pinout Breakdown &amp; Mode:</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400 font-medium block">{pattern.faultPinout}</span>
                </div>
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Confirmed Across Motherboard Models:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.models.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Empirical Evidence: <strong>{pattern.confirmedCases}</strong> confirmed cases out of <strong>{pattern.totalCases}</strong>
                  </div>
                  <Link
                    href="/workbench"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
