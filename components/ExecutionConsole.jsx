import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, Wrench, Brain, RefreshCw } from 'lucide-react';

export default function ExecutionConsole({ events, isProcessing }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[400px]">
      
      {/* Console Header */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">ProcureFlow Runtime Stream</span>
        </div>

        <div className="flex items-center gap-2">
          {isProcessing ? (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              <RefreshCw className="w-3 h-3 animate-spin" /> Stream Active
            </span>
          ) : events.length > 0 ? (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" /> Process Complete
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">Idle</span>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-[#050811] scanline-effect">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
            <Brain className="w-8 h-8 opacity-40 animate-pulse text-indigo-400" />
            <p className="text-center font-sans text-xs">Click "Execute ProcureFlow Agent Workflow" to start the live agent stream.</p>
          </div>
        ) : (
          events.map((evt, idx) => (
            <div key={idx} className="space-y-1 animate-fadeIn">
              
              <div className="flex items-start gap-2">
                <span className="text-slate-600 text-[10px] select-none">[{evt.timestamp}]</span>
                
                {evt.type === 'THINKING' && (
                  <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1">
                    <Brain className="w-3 h-3 text-indigo-400" /> THINKING
                  </span>
                )}

                {evt.type === 'TOOL_CALL' && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-cyan-400" /> TOOL: {evt.toolName}
                  </span>
                )}

                {evt.type === 'LOG' && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                    LOG
                  </span>
                )}

                {evt.type === 'DECISION' && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> DECISION
                  </span>
                )}

                <span className="font-semibold text-slate-200">{evt.title}</span>
              </div>

              <div className="pl-14 text-slate-400 leading-relaxed font-sans text-xs">
                {evt.message}
              </div>

            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

    </div>
  );
}
