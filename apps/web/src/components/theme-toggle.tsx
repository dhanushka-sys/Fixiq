'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={cycleTheme}
      className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-all flex items-center space-x-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      title={`Theme: ${theme ?? 'system'} (click to cycle)`}
      aria-label="Toggle color theme"
    >
      {theme === 'light' ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : theme === 'dark' ? (
        <>
          <Moon className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Monitor className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">System</span>
        </>
      )}
    </button>
  );
}
