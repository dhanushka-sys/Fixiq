'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Plus,
  Menu,
  Command,
  CheckCircle,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { CommandPalette } from './command-palette';

interface TopbarProps {
  onOpenMobile: () => void;
}

export function Topbar({ onOpenMobile }: TopbarProps) {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    const interval = setInterval(checkApi, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#070b14]/85 backdrop-blur-md sticky top-0 z-40 transition-colors flex items-center justify-between px-3 sm:px-6">
        {/* Left: Mobile hamburger & Global Search Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 max-w-xs sm:max-w-sm md:max-w-md">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Quick Search Button / Input (triggers Command Palette) */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all text-left group"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
              <span className="truncate hidden sm:inline">Search repairs, devices, ICs...</span>
              <span className="truncate sm:hidden">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0 ml-2">
              <Command className="h-2.5 w-2.5 mr-0.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right Tools: Status, Notifications, Theme, New Intake, Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Operational Status Pill */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              apiStatus === 'online'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                : apiStatus === 'checking'
                ? 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
            }`}
            title="Real-time system operational status"
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
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications (3 unread quality alerts)"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* New Intake Action Button */}
          <Link
            href="/repairs"
            className="px-3 sm:px-3.5 py-1.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-xl shadow-sm hover:shadow-cyan-500/20 transition-all flex items-center space-x-1.5 active:scale-95"
            title="Create new repair intake ticket"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Intake</span>
          </Link>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-slate-100 dark:ring-slate-800 shrink-0">
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

      {/* Global Interactive Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
