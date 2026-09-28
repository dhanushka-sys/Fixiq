'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Wrench,
  Laptop,
  Terminal,
  Layers,
  Network,
  BarChart3,
  Settings,
  Users,
  Cpu,
  ArrowRight,
  X,
  Sparkles,
  Command,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Navigation Items
  const navItems = [
    { title: 'Overview Dashboard', href: '/', category: 'Navigation', icon: BarChart3, desc: 'Live repair operations & intelligence summary' },
    { title: 'Diagnostic Bench', href: '/workbench', category: 'Intelligence', icon: Terminal, desc: 'Live electrical telemetry & Bayesian root-cause calculator' },
    { title: 'Repair Jobs', href: '/repairs', category: 'Operations', icon: Wrench, desc: 'Intake tickets, technician assignments, bench tracking' },
    { title: 'Hardware Registry', href: '/devices', category: 'Operations', icon: Laptop, desc: '1,284 motherboards, schematics & architectures' },
    { title: 'Failure Patterns', href: '/patterns', category: 'Intelligence', icon: Layers, desc: '38 verified IC failure topologies & symptoms' },
    { title: 'Component Relations', href: '/relations', category: 'Intelligence', icon: Network, desc: 'Signal cascade graph & dependency chains' },
    { title: 'Customer Accounts', href: '/customers', category: 'Operations', icon: Users, desc: 'Enterprise accounts, warranty claims & contact profiles' },
    { title: 'Component Inventory', href: '/components', category: 'Operations', icon: Cpu, desc: '480 micro-soldering ICs, footprints & stock' },
    { title: 'Quality Analytics', href: '/analytics', category: 'Intelligence', icon: BarChart3, desc: 'Turnaround time, first-time fix rate & comebacks' },
    { title: 'System Settings', href: '/settings', category: 'System', icon: Settings, desc: 'Shop profile, thermal units & alert notifications' },
  ];

  // Quick Action Shortcuts & Devices
  const quickItems = [
    { title: 'Dell Latitude 5420 (LA-K491P)', href: '/workbench', category: 'Device Bench', icon: Laptop, desc: '5V VBUS 0.00A / TPS65988' },
    { title: 'ThinkPad T14 Gen 2 (NM-D351)', href: '/workbench', category: 'Device Bench', icon: Laptop, desc: '20V 0.02A / BQ24780S' },
    { title: 'MacBook Pro 16" (820-01700)', href: '/workbench', category: 'Device Bench', icon: Laptop, desc: '5V 0.01A / CD3217B12' },
    { title: 'TPS65988 USB-PD Controller', href: '/components', category: 'IC Part', icon: Cpu, desc: 'QFN-56 in stock (18 units)' },
    { title: 'CD3217B12 Apple Type-C PD', href: '/components', category: 'IC Part', icon: Cpu, desc: 'BGA-49 in stock (12 units)' },
  ];

  const allItems = [...navItems, ...quickItems];

  const filtered = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

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

  // Prevent scroll when modal is open
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

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-24 px-3 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repairs, devices, ICs, or pages..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="h-8 w-8 mx-auto opacity-30" />
              <p className="text-xs">No matching results for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-slate-500">Try searching for &quot;Dell&quot;, &quot;TPS65988&quot;, or &quot;Repairs&quot;</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 dark:bg-[#060913]/80 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Fixiq Quick Find</span>
        </div>
      </div>
    </div>
  );
}
