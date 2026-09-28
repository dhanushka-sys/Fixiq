'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {/* Left Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace with Compact Topbar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
