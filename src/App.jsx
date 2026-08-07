import React, { useState } from 'react';
import Header from './components/Header';
import QuoteInputPanel from './components/QuoteInputPanel';
import ExecutionConsole from './components/ExecutionConsole';
import ComparisonMatrix from './components/ComparisonMatrix';
import ActionCenter from './components/ActionCenter';
import { runProcureFlowAgentProcess } from './agent/agentOrchestrator';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const handleRunAgent = async (scenarioData) => {
    setIsProcessing(true);
    setEvents([]);
    setEvaluationResult(null);

    const constraints = {
      maxBudgetUSD: scenarioData.maxBudgetUSD,
      maxLeadTimeDays: scenarioData.maxLeadTimeDays
    };

    try {
      const result = await runProcureFlowAgentProcess(
        scenarioData.suppliers,
        constraints,
        (evt) => {
          setEvents((prev) => [...prev, evt]);
        }
      );
      setEvaluationResult(result);
    } catch (err) {
      console.error('Agent execution error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setIsProcessing(false);
    setEvents([]);
    setEvaluationResult(null);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <Header
        isProcessing={isProcessing}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        
        {/* Hero Banner */}
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              Enterprise Agent Runtime
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Autonomous RFQ Normalization & Vendor Scoring Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              ProcureFlow AI automatically parses unstructured supplier quotes across currencies, normalizes volume units & delivery lead times, scores vendors using enterprise risk matrices, and generates purchase orders automatically.
            </p>
          </div>
        </div>

        {/* Top Grid: Input Panel & Live Console Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <QuoteInputPanel
              onRunAgent={handleRunAgent}
              isProcessing={isProcessing}
            />
          </div>

          <div className="lg:col-span-5">
            <ExecutionConsole
              events={events}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Output Section: Comparison Matrix & Action Center */}
        {evaluationResult && (
          <div className="space-y-8 animate-fadeIn">
            <ComparisonMatrix evaluationResult={evaluationResult} />
            <ActionCenter evaluationResult={evaluationResult} />
          </div>
        )}

      </main>

    </div>
  );
}
