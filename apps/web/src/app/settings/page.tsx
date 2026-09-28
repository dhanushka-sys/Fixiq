'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Key,
  Database,
  Users,
  Check,
  Server,
  Lock,
} from 'lucide-react';
import { ThemeToggle } from '../../components/theme-toggle';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

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
              Platform Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organization profile, multi-tenant isolation, RBAC security, and API endpoints.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1.5">
            <Check className="h-3.5 w-3.5" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      {/* Organization Card */}
      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Building className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Organization Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Organization Name</label>
            <input
              type="text"
              defaultValue="Apex Microsoldering Lab"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Tenant Identifier (Slug)</label>
            <input
              type="text"
              readOnly
              value="apex-microsoldering-lab"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Primary Contact Email</label>
            <input
              type="email"
              defaultValue="ops@apexmicrolab.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Currency &amp; Bench Rate</label>
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

      {/* Multi-Tenancy & Zero Trust Security */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Multi-Tenant Isolation (Zero Trust)
          </h2>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
          <div className="flex items-center space-x-2 font-bold text-emerald-800 dark:text-emerald-300">
            <Lock className="h-4 w-4" />
            <span>Invariant 1 Active: Row-Level Database Security</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
            All database queries are automatically filtered by your tenant <code className="font-mono text-emerald-700 dark:text-emerald-300">organizationId</code> in the Prisma data layer. Cross-tenant leakage is mathematically impossible.
          </p>
        </div>
      </div>

      {/* API Endpoint Configuration */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Server className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Backend API Connection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">REST API Base URL</label>
            <input
              type="text"
              readOnly
              value="http://localhost:4000/api"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-300 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Health Endpoint</label>
            <input
              type="text"
              readOnly
              value="http://localhost:4000/api/health"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-300 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
