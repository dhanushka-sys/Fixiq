'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Sliders,
  Bell,
  Check,
  Lock,
  Thermometer,
  Coins,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [autoRecalc, setAutoRecalc] = useState(true);
  const [comebackAlert, setComebackAlert] = useState(true);
  const [customerUpdates, setCustomerUpdates] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Settings className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Settings &amp; Preferences
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your repair shop profile, diagnostic bench defaults, and notification preferences.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1.5 animate-fadeIn">
            <Check className="h-3.5 w-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      {/* Organization Card */}
      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Building className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Repair Shop Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Shop / Laboratory Name</label>
            <input
              type="text"
              defaultValue="Apex Microsoldering Lab"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Account ID</label>
            <input
              type="text"
              readOnly
              value="FXQ-APEX-9281"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Email</label>
            <input
              type="email"
              defaultValue="ops@apexmicrolab.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Default Currency &amp; Labor Rate</label>
            <input
              type="text"
              defaultValue="USD ($) • $120.00 / hr"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all shadow-xs"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Diagnostic Bench Preferences */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Diagnostic Bench Preferences
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          {/* Temperature unit selection */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Thermal Camera Units</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Display temperature values across FLIR and thermocouple telemetry.</p>
            </div>
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  tempUnit === 'C'
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  tempUnit === 'F'
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Auto recalculate toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Auto-Recalculate Bayesian Failure Probabilities</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Dynamically re-rank confirmed IC candidates whenever symptoms are toggled.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRecalc(!autoRecalc)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                autoRecalc ? 'bg-cyan-600 dark:bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                  autoRecalc ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quality & Notifications */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Quality &amp; Alert Notifications
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          {/* Comeback alert toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Warranty Comeback Warning Alert</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Notify technicians when a serial number returning within 90 days is checked in.</p>
            </div>
            <button
              type="button"
              onClick={() => setComebackAlert(!comebackAlert)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                comebackAlert ? 'bg-cyan-600 dark:bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                  comebackAlert ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Customer SMS/Email updates */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Customer Status Updates</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Send automated notifications when a repair transitions to Testing or Ready for Pickup.</p>
            </div>
            <button
              type="button"
              onClick={() => setCustomerUpdates(!customerUpdates)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                customerUpdates ? 'bg-cyan-600 dark:bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                  customerUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Security & Tenant Privacy */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Data Privacy &amp; Security
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="flex items-center space-x-2 font-bold text-emerald-800 dark:text-emerald-300">
            <Lock className="h-4 w-4" />
            <span>Dedicated Tenant Isolation Active</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
            Your customer profiles, device records, and board telemetry are strictly isolated to your laboratory account with automated row-level encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
