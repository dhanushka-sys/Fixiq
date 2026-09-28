'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Laptop,
  Wrench,
  Users,
  Cpu,
  Terminal,
  Layers,
  Network,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      group: null,
      items: [
        { href: '/', label: 'Overview', icon: LayoutDashboard, badge: null },
      ],
    },
    {
      group: 'REPAIR OPERATIONS',
      items: [
        { href: '/devices', label: 'Devices', icon: Laptop, badge: '1,284' },
        { href: '/repairs', label: 'Repair Jobs', icon: Wrench, badge: '24' },
        { href: '/customers', label: 'Customers', icon: Users, badge: null },
        { href: '/components', label: 'Components', icon: Cpu, badge: '480' },
      ],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { href: '/workbench', label: 'Diagnostic Bench', icon: Terminal, badge: 'Live' },
        { href: '/patterns', label: 'Failure Patterns', icon: Layers, badge: '38' },
        { href: '/relations', label: 'Component Relations', icon: Network, badge: null },
        { href: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
      ],
    },
    {
      group: null,
      items: [
        { href: '/settings', label: 'Settings', icon: Settings, badge: null },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#070b14] border-r border-slate-200 dark:border-slate-800/80 select-none transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center space-x-3 overflow-hidden group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                FIXIQ
              </span>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                REPAIR INTEL
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar (240px)' : 'Collapse sidebar (68px)'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav items scrollable list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.group && !collapsed && (
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                {section.group}
              </div>
            )}
            {section.group && collapsed && (
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center rounded-xl transition-all font-medium text-xs sm:text-sm group ${
                      collapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-3'
                    } ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-semibold shadow-xs ring-1 ring-cyan-200 dark:ring-cyan-800/60'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon
                      className={`shrink-0 transition-colors ${
                        collapsed ? 'h-5 w-5' : 'h-4 w-4'
                      } ${
                        isActive
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />

                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge === 'Live'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Organization / Status Footer in Sidebar */}
      {!collapsed ? (
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#060913]/60">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              FX
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                Apex Micro Lab
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono block">
                ORG-9281 • PRO
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <div className="h-7 w-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px]">
            FX
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-[260px] max-w-[80vw] h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
