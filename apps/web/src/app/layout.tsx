import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { AppShell } from '../components/app-shell';

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
  title: 'Fixiq — Repair Operations & Failure Intelligence Platform',
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
        className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AppShell>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
