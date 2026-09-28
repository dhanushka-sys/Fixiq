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
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const POWER_CASCADE = [
  {
    step: 1,
    stage: 'VBUS Intake & PD Negotiation',
    ic: 'TPS65988 (UT2)',
    role: 'USB Type-C & Power Delivery Controller',
    inRail: 'VBUS (5V standard)',
    outRail: '20V Negotiated Rail',
    symptomIfFailed: 'Stuck at 5V / 0.00A VBUS',
    downstream: 'BQ24780S Battery Charger',
    plainExplainer: 'Without 20V negotiation from this chip, the main system charger cannot power on or charge the battery.',
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
    plainExplainer: 'Converts 20V into the 12.6V backbone rail. If this fails, the entire board remains completely dark with zero power.',
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
    plainExplainer: 'The brain of motherboard startup. Reads the power button and sends wake-up signals to the CPU VRM controller.',
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
    plainExplainer: 'Delivers massive electrical current to the CPU silicon. If filtering caps fail here, the system trips over-current protection instantly.',
  },
];

export default function RelationsPage() {
  const [selectedStage, setSelectedStage] = useState(POWER_CASCADE[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <span>Intelligence Catalog</span>
            <span>•</span>
            <span>Dependency Cascade</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Component Relations &amp; Power Cascade
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Topological component dependencies, signal enable cascade, and failure propagation maps.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/workbench"
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 self-start sm:self-auto active:scale-95"
        >
          <span>Test Signals On Bench</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Explanatory Banner: Easy to Understand */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3.5">
        <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 dark:text-white font-bold block text-sm">
            Why Component Relations Prevent Costly Mistakes:
          </strong>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            Laptop motherboards power up in a strict sequential chain. If <strong>Step 1</strong> fails, downstream chips at <strong>Step 2, 3, and 4</strong> receive 0 volts. Untrained technicians often replace healthy downstream chips by mistake. Fixiq enforces root-cause isolation by tracing the upstream dependency tree.
          </p>
        </div>
      </div>

      {/* Power Sequencing Cascade Flow */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Standard Laptop Power Sequence Dependency Chain (Click to Inspect):
        </h2>

        {/* 4 Interactive Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {POWER_CASCADE.map((step) => {
            const isSelected = selectedStage.step === step.step;
            return (
              <div
                key={step.step}
                onClick={() => setSelectedStage(step)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                    : 'glass-card hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {step.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Phase {step.step}
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
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Outputs: </span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{step.outRail}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Panel for the Selected Stage */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5 border-l-4 border-l-indigo-600 dark:border-l-indigo-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Selected Phase {selectedStage.step} Deep-Dive
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedStage.stage} — {selectedStage.ic}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
            Feeds into: {selectedStage.downstream}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-xs block">Plain English Explanation:</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              {selectedStage.plainExplainer}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
            <span className="font-bold text-rose-800 dark:text-rose-300 text-xs block">Failure Symptom on Bench:</span>
            <p className="font-mono text-rose-700 dark:text-rose-400 text-xs font-semibold">
              {selectedStage.symptomIfFailed}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              When observing this symptom, check {selectedStage.inRail} before suspecting downstream components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
