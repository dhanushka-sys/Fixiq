'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  Terminal,
  Layers,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

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

  const navLinks = [
    { href: '/', label: 'Diagnostic Bench', icon: Terminal },
    { href: '/intel', label: 'Intelligence Catalog', icon: Layers },
    { href: '/analytics', label: 'Comeback Metrics', icon: BarChart3 },
    { href: '/architecture', label: 'Architecture', icon: ShieldCheck },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#060913]/90 backdrop-blur-xl sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Fixiq
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60">
              <Sparkles className="h-2.5 w-2.5 text-cyan-600 dark:text-cyan-400" />
              <span>INTELLIGENCE</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: API Status, Theme Toggle, Intake CTA */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Live API Health indicator */}
          <div
            className={`hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              apiStatus === 'online'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                : apiStatus === 'checking'
                ? 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
            }`}
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
            <span className="font-mono text-[11px]">
              {apiStatus === 'online' ? 'API :4000 Active' : apiStatus === 'checking' ? 'Connecting API...' : 'API Standalone'}
            </span>
          </div>

          {/* Theme Toggle (System / Light / Dark) */}
          <ThemeToggle />

          <Link
            href="/"
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 rounded-lg shadow-sm hover:shadow-cyan-500/20 transition-all items-center space-x-1.5 active:scale-95"
          >
            <span>New Intake</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
