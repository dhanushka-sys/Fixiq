'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Laptop,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  RefreshCw,
  Zap,
  Copy,
  Check,
} from 'lucide-react';

export interface ParsedDiagnosticData {
  device: {
    brand?: string;
    modelName?: string;
    boardNumber?: string;
    serialNumber?: string;
  };
  symptoms: string[];
  measurements: {
    vbusVoltage?: string;
    vbusCurrent?: string;
    diodeReading?: string;
    isShort?: boolean;
    thermalPeak?: string;
    hotspotPart?: string;
  };
  suspectedComponents: {
    chip?: string;
    designator?: string;
    rail?: string;
    shortedPins?: string;
  }[];
  confirmedComponents: {
    chip: string;
    designator?: string;
    failureMode?: string;
  }[];
  outcome?: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED' | 'UNREPAIRABLE';
  summary: string;
  confidenceScore: number;
  parserEngine: 'GEMINI_AI' | 'HYBRID_RULE_ENGINE';
}

interface AiQuickIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToWorkbench?: (data: ParsedDiagnosticData) => void;
  initialText?: string;
}

const SAMPLE_NOTES = [
  {
    title: 'Dell 5420 USB-C Short',
    text: "Dell Latitude 5420 board LA-K491P SN:4F92KL3 won't turn on. Drawing 0.000A at 5.08V. Diode reading 0.002 Ω short on main rail. Thermal cam spotted UT2 TPS65988 boiling. Pin 14 VBUS shorted to Pin 19 CC1. Replaced UT2, tested ok, successful power on.",
  },
  {
    title: 'ThinkPad T14 Thunderbolt Fail',
    text: 'ThinkPad T14 Gen 2 NM-D351 SN:PF38Z49 no power, stuck at 20V 0.024A. EC not responding. Thermal peak +56.7 °C around U112 TPS65988DJ. Pin 22 shorted to ground. Swapped U112, 20V negotiation restored and booted.',
  },
  {
    title: 'MacBook Pro A2141 5V Loop',
    text: 'MacBook Pro 16" A2141 board 820-01700-A SN:C02DP0XXMD6M stuck at 5V 0.012A loop, PPBUS missing, DFU mode. Diode reading 0.385 V on PP1V5_UPC_LDO. Thermal reading +32.1 °C on U3100 CD3217B12. Replaced U3100, verified successful repair.',
  },
];

export function AiQuickIntakeModal({
  isOpen,
  onClose,
  onApplyToWorkbench,
  initialText = '',
}: AiQuickIntakeModalProps) {
  const [notes, setNotes] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedDiagnosticData | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync initialText if provided
  useEffect(() => {
    if (initialText) setNotes(initialText);
  }, [initialText]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!notes.trim() || notes.trim().length < 5) {
      setError('Please enter at least 5 characters of technician notes.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/intelligence/parse-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes: notes.trim() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setParsedResult(json.data);
      } else {
        throw new Error(json.error || 'Failed to parse notes');
      }
    } catch (err: any) {
      console.error('AI intake parsing error:', err);
      setError('Failed to extract diagnostic entities. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (parsedResult && onApplyToWorkbench) {
      onApplyToWorkbench(parsedResult);
      onClose();
    }
  };

  const handleCopyJson = () => {
    if (!parsedResult) return;
    navigator.clipboard.writeText(JSON.stringify(parsedResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto animate-in fade-in-0 zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  AI Quick-Intake Diagnostic Parser
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  NLP / Hybrid
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paste technician shorthand, ammeter readings, or dictated notes to auto-populate the workbench.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Test Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNotes(sample.text);
                    setError(null);
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <Zap className="h-3 w-3 text-cyan-500" />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Area */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Raw Bench Notes / Spoken Shorthand
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., ThinkPad T14 NM-D351 no power, stuck at 20V 0.024A. EC not responding. Thermal peak +56.7C around U112 TPS65988DJ. Replaced U112, now boots..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parse Button */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Supports multimeter voltages, thermal hot spots, IC part numbers &amp; outcomes.
            </span>
            <button
              onClick={handleParse}
              disabled={loading || !notes.trim()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 shadow-sm disabled:opacity-50 transition-all flex items-center space-x-1.5 cursor-pointer disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Extracting Entities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Extract Diagnostics</span>
                </>
              )}
            </button>
          </div>

          {/* Extraction Preview Card */}
          {parsedResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-cyan-500/30 space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Extraction Completed
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {Math.round(parsedResult.confidenceScore * 100)}% Confidence
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {parsedResult.parserEngine === 'GEMINI_AI' ? 'Gemini 2.5 Flash' : 'Hybrid Rule Engine'}
                  </span>
                  <button
                    onClick={handleCopyJson}
                    title="Copy parsed JSON"
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {parsedResult.summary}
              </p>

              {/* Entity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Device & Board */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    <Laptop className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Hardware Identity</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {parsedResult.device.modelName || 'Model Unspecified'}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      Board: {parsedResult.device.boardNumber || 'N/A'} • SN: {parsedResult.device.serialNumber || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Telemetry & Measurements */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    <Activity className="h-3.5 w-3.5 text-blue-500" />
                    <span>Electrical Telemetry</span>
                  </div>
                  <div className="font-mono text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
                    <div>
                      VBUS: <span className="font-bold text-cyan-600 dark:text-cyan-400">{parsedResult.measurements.vbusVoltage || 'N/A'}</span> @{' '}
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{parsedResult.measurements.vbusCurrent || 'N/A'}</span>
                    </div>
                    <div>
                      Diode: {parsedResult.measurements.diodeReading || 'Normal'} • Short:{' '}
                      <span className={parsedResult.measurements.isShort ? 'text-red-500 font-bold' : 'text-emerald-500'}>
                        {parsedResult.measurements.isShort ? 'DETECTED' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Mapped Symptoms ({parsedResult.symptoms.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedResult.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hotspot & Components */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    <Flame className="h-3.5 w-3.5 text-red-500" />
                    <span>Hotspot &amp; Root Cause</span>
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    {parsedResult.measurements.thermalPeak && (
                      <div className="text-red-500 font-bold font-mono">
                        {parsedResult.measurements.thermalPeak} peak{' '}
                        {parsedResult.measurements.hotspotPart && `on ${parsedResult.measurements.hotspotPart}`}
                      </div>
                    )}
                    {parsedResult.confirmedComponents.length > 0 ? (
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Confirmed: {parsedResult.confirmedComponents.map((c) => `${c.chip} (${c.designator || 'IC'})`).join(', ')}
                      </div>
                    ) : parsedResult.suspectedComponents.length > 0 ? (
                      <div className="text-amber-600 dark:text-amber-400 font-semibold">
                        Suspected: {parsedResult.suspectedComponents.map((c) => `${c.chip} (${c.designator || 'IC'})`).join(', ')}
                      </div>
                    ) : (
                      <div className="text-slate-400">No specific IC detected yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          {parsedResult && onApplyToWorkbench && (
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <span>Apply to Workbench</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
