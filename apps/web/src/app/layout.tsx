import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fixiq — Repair Intelligence Platform',
  description: 'Transforming hardware diagnostics into structured, reusable, and explainable failure intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
