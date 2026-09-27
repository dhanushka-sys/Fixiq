import {
  Cpu,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Database,
  ArrowRight,
  TrendingDown,
  Terminal,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-bold tracking-tight text-white">Fixiq</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                INTELLIGENCE v0.1
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-400">
            <a href="#workbench" className="hover:text-cyan-400 transition-colors">Bench Diagnostic</a>
            <a href="#patterns" className="hover:text-cyan-400 transition-colors">Failure Patterns</a>
            <a href="#evidence" className="hover:text-cyan-400 transition-colors">Evidence Engine</a>
            <a href="#analytics" className="hover:text-cyan-400 transition-colors">Comeback Analytics</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 rounded-md transition-all">
              API Docs
            </button>
            <button className="px-4 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-md shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1.5">
              <span>Launch Bench</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Deterministic Failure Knowledge Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop Guessing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Transform Diagnostic History
            </span> into Ground-Truth Intel.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Fixiq turns routine bench repairs into structured failure patterns. 
            Capture symptoms, diode-mode readings, and confirmed components in &lt;60s to accelerate future repairs with mathematically explainable evidence.
          </p>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Avg Diagnostic TAT</span>
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white tracking-tight">16.4 min</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <TrendingDown className="h-3 w-3 mr-0.5" /> -72%
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Down from 65 min trial-and-error</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>First-Time Fix Rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white tracking-tight">92.8%</span>
              <span className="text-xs font-semibold text-emerald-400">+18.5%</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Verified across 384 board repairs</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Warranty Comebacks</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white tracking-tight">3.8%</span>
              <span className="text-xs font-semibold text-emerald-400">-64%</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Industry baseline averages 11.4%</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Indexed Failure Maps</span>
              <Database className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white tracking-tight">1,248</span>
              <span className="text-xs font-semibold text-indigo-400">Deterministic</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Empirically confirmed IC failures</p>
          </div>
        </div>

        {/* Technician At-Bench Intelligence UI Simulation */}
        <section id="workbench" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Live Bench Intelligence Feed
              </h2>
            </div>
            <span className="text-xs text-slate-400">Simulating active repair #FIX-1092</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Device & Intake Profile */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Device Profile</span>
                <h3 className="text-xl font-bold text-white mt-1">Dell Latitude 5420</h3>
                <p className="text-xs text-slate-400">Board: LA-K491P | S/N: 4F92KL3</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reported Symptoms</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/60 text-xs font-medium text-rose-300">
                    Won&apos;t Turn On
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800/60 text-xs font-medium text-amber-300">
                    0.00A on 5V VBUS
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                    No LED Status
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bench Measurements</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">VBUS Voltage</span>
                    <span className="font-mono font-bold text-white text-sm">5.08 V</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">VBUS Current</span>
                    <span className="font-mono font-bold text-rose-400 text-sm">0.000 A</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">PPBUS Diode Mode</span>
                    <span className="font-mono font-bold text-rose-400 text-sm">0.002 Ω (SHORT)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-slate-500 block">Thermal ΔT</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">+48.2 °C (PU301)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Deterministic Historical Evidence */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-cyan-900/40 relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Explainable Diagnostic Recommendations</span>
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Historical Failure Evidence for Dell Latitude 5420
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Sample Size</span>
                  <span className="text-sm font-bold text-cyan-300">47 Similar Cases</span>
                </div>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        TOP PROBABILITY (74.5%)
                      </span>
                      <h4 className="font-bold text-white text-base">TPS65988 USB-PD Controller</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Circuit Designator: <span className="text-slate-200 font-mono">UT2</span> | Category: <span className="text-slate-200">USB_PD_CONTROLLER</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Observed failure mode: <span className="text-rose-300">Internal gate short between VBUS and CC1</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Confirmed Fixes</span>
                      <span className="text-base font-bold text-emerald-400">35 of 47 Cases</span>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-800">
                      <span className="text-xs text-slate-400 block">Confidence</span>
                      <span className="text-base font-bold text-cyan-400">HIGH (94%)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-80">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        SECONDARY (17.0%)
                      </span>
                      <h4 className="font-semibold text-slate-200 text-sm">BQ24780S Battery Charger IC</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Circuit Designator: <span className="text-slate-300 font-mono">PU301</span> | High-side input MOSFET cascade
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Confirmed Fixes</span>
                      <span className="text-sm font-semibold text-slate-300">8 of 47 Cases</span>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-800">
                      <span className="text-xs text-slate-400 block">Confidence</span>
                      <span className="text-sm font-semibold text-slate-400">MODERATE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bench Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  Step 3 of 5: Replace confirmed component &amp; execute 20V load test
                </span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                    Rule Out Part
                  </button>
                  <button className="px-4 py-1.5 rounded-md text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm">
                    Confirm &amp; Log Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modular Monolith Architecture Blueprint */}
        <section id="patterns" className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-slate-800/80 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Architecture Blueprint</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Structured Monolith Domain Engine</h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Strict multi-tenancy at the database level, explicit separation of suspected vs. confirmed findings, and deterministic algorithms for failure pattern mining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-bold text-xs">
                01
              </div>
              <h4 className="font-bold text-white text-base">Multi-Tenant Isolation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Row-level organization scoping enforced at the Prisma repository layer. No cross-tenant data leakage or unauthenticated parameter inference.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 font-bold text-xs">
                02
              </div>
              <h4 className="font-bold text-white text-base">Purity of Ground Truth</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diagnostic records strictly isolate suspected guesses from empirically confirmed IC replacements. Guesswork never pollutes the failure pattern engine.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-bold text-xs">
                03
              </div>
              <h4 className="font-bold text-white text-base">Closed-Loop Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Repairs are only factored into intelligence models after verified post-repair functional testing (thermal, power sequencing, full load verification).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#05080f] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Fixiq</span>
            <span>— The Open Repair Intelligence Platform</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="https://github.com/dhanushka-sys/Fixiq" className="hover:text-slate-300">GitHub</a>
            <span>MIT License</span>
            <span>Sprint 01 Baseline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
