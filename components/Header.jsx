import React from 'react';
import { Cpu, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Header({ isProcessing, onReset }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg glow-indigo">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight font-sans text-white">
                Procure<span className="text-indigo-400">Flow</span> <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">AI AGENT</span>
              </h1>
              <span className="text-[11px] font-semibold tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Enterprise Platform
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Procurement & Supply Chain Agent Engine</p>
          </div>
        </div>

        {/* Right Status & Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deterministic Parsing & Risk Engine</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Status: <strong className="text-emerald-400 font-mono">{isProcessing ? 'Agent Active...' : 'Runtime Ready'}</strong></span>
          </div>

          <button 
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition border border-slate-700/50"
          >
            Reset Workspace
          </button>
        </div>

      </div>
    </header>
  );
}
