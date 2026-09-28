'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Plus,
  Menu,
  Sparkles,
  Command,
  CheckCircle,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface TopbarProps {
  onOpenMobile: () => void;
}

export function Topbar({ onOpenMobile }: TopbarProps) {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/health', {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(2500),
        });
        if (res.ok) {
          if (isMounted) setApiStatus('online');
        } else {
          if (isMounted) setApiStatus('offline');
        }
      } catch {
        if (isMounted) setApiStatus('offline');
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-40 transition-colors flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Quick Search */}
        <div
          className={`relative w-full transition-all ${
            searchFocused ? 'ring-2 ring-cyan-500/50 rounded-xl' : ''
          }`}
        >
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search repairs, devices, ICs... (Press ⌘K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 transition-colors"
          />
          <kbd className="hidden sm:inline-flex items-center space-x-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Command className="h-2.5 w-2.5 mr-0.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right Tools: API Status, Notifications, Theme, Profile, Intake */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Live API Health Status */}
        <div
          className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            apiStatus === 'online'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
              : apiStatus === 'checking'
              ? 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
          }`}
          title="Real-time operational status"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              apiStatus === 'online'
                ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse'
                : apiStatus === 'checking'
                ? 'bg-slate-400 animate-ping'
                : 'bg-amber-500'
            }`}
          />
          <span className="text-[11px] font-medium">
            {apiStatus === 'online' ? 'System Operational' : apiStatus === 'checking' ? 'Connecting...' : 'Offline Cache'}
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications (3 unread)"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
        </button>

        {/* Theme Toggle (System / Light / Dark) */}
        <ThemeToggle />

        {/* New Intake Quick CTA */}
        <Link
          href="/repairs"
          className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-lg shadow-sm hover:shadow-cyan-500/20 transition-all items-center space-x-1.5 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Intake</span>
        </Link>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-slate-100 dark:ring-slate-800">
            DM
          </div>
          <div className="hidden xl:flex flex-col leading-none text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Dhanushka M.
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
              OWNER
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
