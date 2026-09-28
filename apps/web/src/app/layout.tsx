import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { Navigation } from '../components/navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fixiq — Repair Intelligence Platform',
  description:
    'Turn hardware diagnostics into structured, reproducible, and explainable failure intelligence with deterministic Bayesian evidence.',
  keywords: [
    'hardware repair',
    'micro-soldering',
    'diagnostics',
    'failure intelligence',
    'schematics',
    'board repair',
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#060913' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden flex flex-col transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811] py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Fixiq Platform</span>
                <span>— Open Repair Intelligence</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
                <span>Fastify / Express API (Port 4000)</span>
                <span>Next.js Web (Port 3000)</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">v0.1.0-alpha</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
