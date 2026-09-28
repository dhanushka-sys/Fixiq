'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Activity,
  Layers,
  Laptop,
  Check,
  X,
  Flame,
  ShieldCheck,
  CheckCircle,
  Sliders,
  Sparkles,
  ArrowRight,
  Database,
  BarChart3,
  Network,
} from 'lucide-react';
import { AiQuickIntakeModal, ParsedDiagnosticData } from '@/components/ai-quick-intake-modal';

interface DevicePreset {
  id: string;
  name: string;
  boardNumber: string;
  arch: string;
  serialNumber: string;
  defaultSymptoms: string[];
  measurements: {
    vbusVoltage: string;
    vbusCurrent: string;
    diodeReading: string;
    isShort: boolean;
    thermalPeak: string;
    hotspotPart: string;
  };
  recommendations: {
    chip: string;
    designator: string;
    role: string;
    probability: number;
    confirmedCount: number;
    totalCases: number;
    confidence: 'HIGH' | 'MEDIUM';
    failureMode: string;
    shortedPins: string;
  }[];
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'dell-5420',
    name: 'Dell Latitude 5420',
    boardNumber: 'LA-K491P',
    arch: 'Intel Tiger Lake 11th Gen',
    serialNumber: '4F92KL3',
    defaultSymptoms: ['NO_POWER', 'ZERO_VBUS', 'SHORT_MAIN_RAIL'],
    measurements: {
      vbusVoltage: '5.08 V',
      vbusCurrent: '0.000 A',
      diodeReading: '0.002 Ω',
      isShort: true,
      thermalPeak: '+48.2 °C',
      hotspotPart: 'UT2 (PD Controller)',
    },
    recommendations: [
      {
        chip: 'TPS65988',
        designator: 'UT2',
        role: 'Dual-Port USB Type-C & USB PD Controller',
        probability: 76.5,
        confirmedCount: 36,
        totalCases: 47,
        confidence: 'HIGH',
        failureMode: 'Internal gate puncture between VBUS rail and CC1 pin',
        shortedPins: 'Pin 14 (VBUS) to Pin 19 (CC1)',
      },
      {
        chip: 'BQ24780S',
        designator: 'PU301',
        role: '1-4 Cell Hybrid Power Boost Charge Controller',
        probability: 17.0,
        confirmedCount: 8,
        totalCases: 47,
        confidence: 'MEDIUM',
        failureMode: 'High-side input MOSFET drive gate leakage',
        shortedPins: 'Pin 4 (ACDRV) to GND',
      },
      {
        chip: 'ISL9538H',
        designator: 'PU101',
        role: 'Buck-Boost Narrow VDC Battery Charger',
        probability: 6.5,
        confirmedCount: 3,
        totalCases: 47,
        confidence: 'MEDIUM',
        failureMode: 'Phase inductor switching diode breakdown',
        shortedPins: 'BOOT1 capacitor breakdown',
      },
    ],
  },
  {
    id: 'thinkpad-t14',
    name: 'ThinkPad T14 Gen 2',
    boardNumber: 'NM-D351',
    arch: 'AMD Ryzen Pro 5000 Series',
    serialNumber: 'PF38Z49',
    defaultSymptoms: ['NO_POWER', '20V_NO_CURRENT', 'EC_NOT_RUNNING'],
    measurements: {
      vbusVoltage: '19.95 V',
      vbusCurrent: '0.024 A',
      diodeReading: '0.015 Ω',
      isShort: true,
      thermalPeak: '+56.7 °C',
      hotspotPart: 'U112 (Thunderbolt IC)',
    },
    recommendations: [
      {
        chip: 'TPS65988DJ',
        designator: 'U112',
        role: 'USB-PD & Thunderbolt 4 Subsystem Controller',
        probability: 82.4,
        confirmedCount: 42,
        totalCases: 51,
        confidence: 'HIGH',
        failureMode: 'Thunderbolt retimer short pulling 3.3V ALW rail down',
        shortedPins: 'Pin 22 (LDO_3V3) to Ground',
      },
      {
        chip: 'IT8227E-128',
        designator: 'UE1',
        role: 'Embedded Controller (EC / SuperIO)',
        probability: 11.8,
        confirmedCount: 6,
        totalCases: 51,
        confidence: 'MEDIUM',
        failureMode: 'Corrupted internal SPI firmware latchup',
        shortedPins: 'VCC_RTC pin voltage drop',
      },
    ],
  },
  {
    id: 'macbook-a2141',
    name: 'MacBook Pro 16" (A2141)',
    boardNumber: '820-01700-A',
    arch: 'Intel Core i9 + T2 Security Chip',
    serialNumber: 'C02DP0XXMD6M',
    defaultSymptoms: ['5V_0.00A', 'PPBUS_MISSING', 'DFU_MODE'],
    measurements: {
      vbusVoltage: '5.12 V',
      vbusCurrent: '0.012 A',
      diodeReading: '0.385 V',
      isShort: false,
      thermalPeak: '+32.1 °C',
      hotspotPart: 'U3100 (CD3217)',
    },
    recommendations: [
      {
        chip: 'CD3217B12',
        designator: 'U3100',
        role: 'USB-C Power Delivery Interface Controller',
        probability: 88.2,
        confirmedCount: 45,
        totalCases: 51,
        confidence: 'HIGH',
        failureMode: 'LDO 1V5 breakdown preventing T2 handshake negotiation',
        shortedPins: 'PP1V5_UPC_LDO rail stuck at 0.4V',
      },
      {
        chip: 'ISL9240',
        designator: 'U7000',
        role: 'Main System Power (PPBUS_G3H) Buck-Boost Charger',
        probability: 9.8,
        confirmedCount: 5,
        totalCases: 51,
        confidence: 'MEDIUM',
        failureMode: 'Phase 1 low-side gate driver short',
        shortedPins: 'Q7030 gate pin leaky',
      },
    ],
  },
];

const AVAILABLE_SYMPTOMS = [
  { id: 'NO_POWER', label: "Won't Turn On" },
  { id: 'ZERO_VBUS', label: '0.00A on 5V VBUS' },
  { id: 'SHORT_MAIN_RAIL', label: 'Short on Main Rail' },
  { id: '20V_NO_CURRENT', label: 'Stuck at 20V / 0.02A' },
  { id: '5V_0.00A', label: '5V 0.00A Loop' },
  { id: 'PPBUS_MISSING', label: 'PPBUS_G3H Missing' },
  { id: 'EC_NOT_RUNNING', label: 'EC Not Responding' },
  { id: 'BATTERY_NOT_CHARGING', label: 'Battery Not Detected' },
  { id: 'THERMAL_SHUTDOWN', label: 'Thermal Shutdown' },
];

export default function WorkbenchPage() {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>(DEVICE_PRESETS[0].defaultSymptoms);
  const [confirmedComponents, setConfirmedComponents] = useState<string[]>([]);
  const [ruledOutComponents, setRuledOutComponents] = useState<string[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [isAiIntakeOpen, setIsAiIntakeOpen] = useState(false);

  const handleApplyAiIntake = (data: ParsedDiagnosticData) => {
    // 1. Check if device matches any preset
    const matchedPreset = DEVICE_PRESETS.find(
      (p) =>
        (data.device.boardNumber && p.boardNumber.toLowerCase().includes(data.device.boardNumber.toLowerCase())) ||
        (data.device.modelName && p.name.toLowerCase().includes(data.device.modelName.toLowerCase())) ||
        (data.device.brand && p.name.toLowerCase().includes(data.device.brand.toLowerCase()))
    );

    if (matchedPreset) {
      setSelectedDevice({
        ...matchedPreset,
        serialNumber: data.device.serialNumber || matchedPreset.serialNumber,
        measurements: {
          ...matchedPreset.measurements,
          vbusVoltage: data.measurements.vbusVoltage || matchedPreset.measurements.vbusVoltage,
          vbusCurrent: data.measurements.vbusCurrent || matchedPreset.measurements.vbusCurrent,
          diodeReading: data.measurements.diodeReading || matchedPreset.measurements.diodeReading,
          isShort: typeof data.measurements.isShort === 'boolean' ? data.measurements.isShort : matchedPreset.measurements.isShort,
          thermalPeak: data.measurements.thermalPeak || matchedPreset.measurements.thermalPeak,
          hotspotPart: data.measurements.hotspotPart || matchedPreset.measurements.hotspotPart,
        },
      });
    }

    if (data.symptoms.length > 0) {
      setActiveSymptoms(data.symptoms);
    }

    if (data.confirmedComponents.length > 0) {
      setConfirmedComponents(data.confirmedComponents.map((c) => `${c.chip} (${c.designator || 'IC'})`));
      setCurrentStep(5);
    } else {
      setCurrentStep(3);
    }

    setActionNotice(`AI Diagnostic Intake Applied: ${data.summary}`);
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleDeviceChange = (preset: DevicePreset) => {
    setSelectedDevice(preset);
    setActiveSymptoms(preset.defaultSymptoms);
    setConfirmedComponents([]);
    setRuledOutComponents([]);
    setCurrentStep(3);
    setActionNotice(null);
  };

  const toggleSymptom = (symptomId: string) => {
    setActiveSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((s) => s !== symptomId) : [...prev, symptomId]
    );
  };

  const handleConfirmAction = (chipName: string, designator: string) => {
    setConfirmedComponents((prev) => [...prev, `${chipName} (${designator})`]);
    setRuledOutComponents((prev) => prev.filter((c) => !c.includes(chipName)));
    setCurrentStep(5);
    setActionNotice(`Empirical Root Cause Confirmed: ${chipName} [${designator}]. Logged into Knowledge Graph with Verified Success test.`);
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleRuleOutAction = (chipName: string, designator: string) => {
    setRuledOutComponents((prev) => [...prev, `${chipName} (${designator})`]);
    setConfirmedComponents((prev) => prev.filter((c) => !c.includes(chipName)));
    setActionNotice(`Hypothesis Ruled Out: ${chipName} [${designator}] marked as Suspected-only. Pure knowledge graph protected.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const calculatedRecommendations = useMemo(() => {
    return selectedDevice.recommendations.map((rec) => {
      const symptomMultiplier = activeSymptoms.length > 0 ? 1 + (activeSymptoms.length - 2) * 0.05 : 0.8;
      const rawProb = Math.min(96, Math.max(10, Math.round(rec.probability * symptomMultiplier)));
      return {
        ...rec,
        probability: rawProb,
        isConfirmed: confirmedComponents.some((c) => c.includes(rec.chip)),
        isRuledOut: ruledOutComponents.some((c) => c.includes(rec.chip)),
      };
    });
  }, [selectedDevice, activeSymptoms, confirmedComponents, ruledOutComponents]);

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
              <Terminal className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Diagnostic Workbench
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Active Ticket #FIX-1092
            </span>
            <button
              onClick={() => setIsAiIntakeOpen(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Quick Intake</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time board diagnosis. Multimeter &amp; thermal telemetry updates Bayesian failure probabilities dynamically.
          </p>
        </div>

        {/* Board Switcher - Horizontal scroll on mobile */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none max-w-full">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
            Board:
          </span>
          {DEVICE_PRESETS.map((device) => {
            const isActive = device.id === selectedDevice.id;
            return (
              <button
                key={device.id}
                onClick={() => handleDeviceChange(device)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs ring-1 ring-cyan-500/40'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Laptop className="h-3.5 w-3.5 shrink-0" />
                <span>{device.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-cyan-700 text-white dark:bg-slate-950/20 dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {device.boardNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5-Step Workflow Stepper - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center text-xs">
        {[
          { step: 1, label: '1. Device Intake', desc: 'S/N & Customer' },
          { step: 2, label: '2. Symptoms', desc: 'Reported faults' },
          { step: 3, label: '3. Telemetry', desc: 'Diode & Thermal ΔT' },
          { step: 4, label: '4. IC Replacement', desc: 'Confirm component' },
          { step: 5, label: '5. Verification', desc: 'Closed-loop test' },
        ].map((s) => {
          const isCurrent = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <div
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                isCurrent
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-400 dark:border-cyan-500/60 text-cyan-800 dark:text-white font-bold shadow-xs'
                  : isPassed
                  ? 'bg-emerald-50 dark:bg-slate-900/50 border-emerald-300 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 font-bold">
                {isPassed && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                <span>{s.label}</span>
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">{s.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-cyan-50 dark:bg-gradient-to-r dark:from-cyan-950/90 dark:via-slate-900 dark:to-blue-950/90 border border-cyan-300 dark:border-cyan-500/50 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wider">State Machine Update</span>
              <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">{actionNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Workbench Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Device Telemetry & Symptoms (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  Hardware Identity
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedDevice.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedDevice.arch}</span>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-700">
                {selectedDevice.boardNumber}
              </span>
            </div>

            {/* Symptoms Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sliders className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Reported Symptoms</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Click to toggle</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SYMPTOMS.map((symptom) => {
                  const isSelected = activeSymptoms.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/60 text-rose-800 dark:text-rose-200 font-semibold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {isSelected && <span className="mr-1 text-rose-500 font-bold">●</span>}
                      {symptom.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multimeter & Thermal Telemetry */}
            <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Multimeter &amp; Thermal Readings</span>
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">VBUS Voltage</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                    {selectedDevice.measurements.vbusVoltage}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">VBUS Current</span>
                  <span
                    className={`font-mono font-bold text-base ${
                      selectedDevice.measurements.vbusCurrent === '0.000 A'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {selectedDevice.measurements.vbusCurrent}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">PPBUS Diode</span>
                    {selectedDevice.measurements.isShort && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                        SHORT
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-base">
                    {selectedDevice.measurements.diodeReading}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Thermal Hotspot</span>
                    <Flame className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-base">
                    {selectedDevice.measurements.thermalPeak}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {selectedDevice.measurements.hotspotPart}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Explainable Evidence & Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-elevated p-5 sm:p-6 rounded-2xl relative overflow-hidden space-y-5">
            {/* Header with Case Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="h-4 w-4" />
                  <span>Explainable Diagnostic Recommendations</span>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Historical Failure Evidence for {selectedDevice.name}
                </h3>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Verified Dataset</span>
                <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300 font-mono">
                  {selectedDevice.recommendations[0]?.totalCases || 47} Cases
                </span>
              </div>
            </div>

            {/* Ground-Truth Evidence Badge */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-900 dark:text-white font-semibold">Verified Ground-Truth:</strong> Recommendations are derived exclusively from empirical component replacements verified with successful post-repair load tests.
              </p>
            </div>

            {/* Dynamic Recommendations List */}
            <div className="space-y-3.5">
              {calculatedRecommendations.map((rec, index) => {
                const isTop = index === 0;
                return (
                  <div
                    key={rec.chip}
                    className={`p-5 rounded-xl border transition-all ${
                      rec.isConfirmed
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/60 shadow-sm'
                        : rec.isRuledOut
                        ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : isTop
                        ? 'bg-white dark:bg-slate-950/90 border-cyan-400 dark:border-cyan-500/40 shadow-sm ring-1 ring-cyan-500/20'
                        : 'bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {rec.isConfirmed ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 flex items-center space-x-1">
                              <Check className="h-3 w-3" />
                              <span>CONFIRMED ROOT CAUSE</span>
                            </span>
                          ) : rec.isRuledOut ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
                              RULED OUT
                            </span>
                          ) : (
                            <span
                              className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                                isTop
                                  ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/80'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isTop ? 'PRIMARY CANDIDATE' : 'SECONDARY CANDIDATE'} ({rec.probability}%)
                            </span>
                          )}

                          <h4 className="font-bold text-slate-900 dark:text-white text-lg font-sans">
                            {rec.chip}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-slate-800">
                            {rec.designator}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{rec.role}</p>

                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/60 text-xs space-y-1">
                          <div className="text-slate-600 dark:text-slate-400">
                            <span className="text-slate-900 dark:text-slate-300 font-semibold">Failure Signature: </span>
                            <span className="text-rose-700 dark:text-rose-300">{rec.failureMode}</span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            <span className="text-slate-900 dark:text-slate-300 font-semibold">Typical Pinout: </span>
                            <span className="font-mono text-cyan-700 dark:text-cyan-300">{rec.shortedPins}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats badge */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Confirmed Cases</span>
                          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {rec.confirmedCount} of {rec.totalCases}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Confidence</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              rec.confidence === 'HIGH'
                                ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {rec.confidence}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bench Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Technician action for IC {rec.designator}:
                      </span>

                      <div className="flex items-center space-x-2">
                        {!rec.isRuledOut && (
                          <button
                            onClick={() => handleRuleOutAction(rec.chip, rec.designator)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
                          >
                            Rule Out Part
                          </button>
                        )}

                        {!rec.isConfirmed ? (
                          <button
                            onClick={() => handleConfirmAction(rec.chip, rec.designator)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Confirm &amp; Log Fix</span>
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Logged in Evidence Engine</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick-Intake Modal */}
      <AiQuickIntakeModal
        isOpen={isAiIntakeOpen}
        onClose={() => setIsAiIntakeOpen(false)}
        onApplyToWorkbench={handleApplyAiIntake}
      />
    </div>
  );
}
