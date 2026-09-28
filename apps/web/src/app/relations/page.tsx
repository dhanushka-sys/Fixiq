'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Network,
  Cpu,
  ArrowRight,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const POWER_CASCADE = [
  {
    step: 1,
    stage: 'VBUS Intake & PD Negotiation',
    ic: 'TPS65988 (UT2)',
    role: 'USB Type-C & Power Delivery Controller',
    inRail: 'VBUS (5V)',
    outRail: '20V Negotiated Rail',
    symptomIfFailed: 'Stuck at 5V / 0.00A VBUS',
    downstream: 'BQ24780S Battery Charger',
  },
  {
    step: 2,
    stage: 'System Power & Battery Charging',
    ic: 'BQ24780S (PU301)',
    role: 'Main System Buck-Boost Charger',
    inRail: '20V DC-IN',
    outRail: 'PPBUS_G3H (12.6V Main Rail)',
    symptomIfFailed: 'ACDRV 0V / Short to Ground on PPBUS',
    downstream: 'Embedded Controller & 3.3V ALW',
  },
  {
    step: 3,
    stage: 'Always-On Logic & Power Sequencing',
    ic: 'IT8227E-128 (UE1)',
    role: 'Embedded Controller (EC / SuperIO)',
    inRail: '3.3V ALW Rail',
    outRail: 'PM_SLP_S4# / S3# Enable Signals',
    symptomIfFailed: 'No Amber/White LED / No Power Sequence',
    downstream: 'ISL95855 CPU Core VRM',
  },
  {
    step: 4,
    stage: 'CPU VCC_CORE Power Delivery',
    ic: 'ISL95855 (PU401)',
    role: 'Multi-Phase CPU VCC_CORE PWM Controller',
    inRail: 'PPBUS (12.6V) + VRM_EN',
    outRail: 'VCC_CORE (0.85V - 1.2V High Current)',
    symptomIfFailed: 'Fans Spin 1 Second then Instant Shutdown',
    downstream: 'System Full S0 Boot',
  },
];

export default function RelationsPage() {
  const [selectedStage, setSelectedStage] = useState(POWER_CASCADE[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Network className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Component Relations &amp; Power Cascade
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Power Sequencing Graph
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Topological component dependencies, signal enable cascade, and failure propagation maps.
          </p>
        </div>
      </div>

      {/* Explanatory Invariant Tag */}
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white font-semibold">Cascade Diagnostic Rule:</strong>{' '}
          In micro-soldering, an IC defect at Step 1 prevents downstream ICs at Step 2 and 3 from ever receiving power. Fixiq tracks component relations to prevent falsely replacing healthy downstream chips.
        </div>
      </div>

      {/* Power Sequencing Cascade Flow */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Standard Laptop Power Sequence Dependency Chain:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POWER_CASCADE.map((step) => {
            const isSelected = selectedStage.step === step.step;
            return (
              <div
                key={step.step}
                onClick={() => setSelectedStage(step)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-500/80 shadow-md ring-1 ring-indigo-400/30'
                    : 'glass-card hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Step {step.step}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {step.stage}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{step.ic}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{step.role}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-4 text-[11px] text-slate-500 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Out: </span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">{step.outRail}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Selected Stage Inspection: Step {selectedStage.step} of 4
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {selectedStage.stage} — {selectedStage.ic}
            </h3>
          </div>
          <Link
            href="/workbench"
            className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold text-xs hover:bg-cyan-500 flex items-center space-x-1"
          >
            <span>Test on Bench</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Input Rail Dependency:</span>
            <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{selectedStage.inRail}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Generated Output Rail:</span>
            <p className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">{selectedStage.outRail}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-slate-500 uppercase text-[10px]">Primary Symptom If Failed:</span>
            <p className="font-semibold text-rose-600 dark:text-rose-400 text-xs">{selectedStage.symptomIfFailed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
