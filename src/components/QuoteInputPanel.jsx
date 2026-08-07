import React, { useState } from 'react';
import { Play, Layers, DollarSign, Clock, FileText, Plus, Trash2 } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets.js';

export default function QuoteInputPanel({ onRunAgent, isProcessing }) {
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_SCENARIOS[0].id);
  const [activeScenario, setActiveScenario] = useState(PRESET_SCENARIOS[0]);
  const [activeSupplierTab, setActiveSupplierTab] = useState(0);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setActiveScenario(JSON.parse(JSON.stringify(preset)));
    setActiveSupplierTab(0);
  };

  const handleSupplierTextChange = (text) => {
    const updated = { ...activeScenario };
    updated.suppliers[activeSupplierTab].rawText = text;
    setActiveScenario(updated);
  };

  const handleSupplierNameChange = (name) => {
    const updated = { ...activeScenario };
    updated.suppliers[activeSupplierTab].name = name;
    setActiveScenario(updated);
  };

  const handleAddSupplier = () => {
    const updated = { ...activeScenario };
    const newId = `sup-custom-${updated.suppliers.length + 1}`;
    updated.suppliers.push({
      id: newId,
      name: `New Supplier #${updated.suppliers.length + 1}`,
      country: 'Global',
      rawText: `QUOTATION REF: NEW-${Math.floor(Math.random()*9000 + 1000)}\nItem: ${updated.title}\nQuantity: ${updated.targetQuantity} ${updated.targetUnit}\nUnit Price: $4.10 USD\nShipping: $300 USD\nLead Time: 10 days\nPayment Terms: Net 30`
    });
    setActiveScenario(updated);
    setActiveSupplierTab(updated.suppliers.length - 1);
  };

  const handleRemoveSupplier = (index) => {
    if (activeScenario.suppliers.length <= 2) {
      alert('Must compare at least 2 suppliers.');
      return;
    }
    const updated = { ...activeScenario };
    updated.suppliers.splice(index, 1);
    setActiveScenario(updated);
    setActiveSupplierTab(Math.max(0, index - 1));
  };

  const currentSupplier = activeScenario.suppliers[activeSupplierTab] || activeScenario.suppliers[0];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Top Presets Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> Benchmark Real-World Scenarios
          </label>
          <span className="text-xs text-slate-400">Click to load realistic supplier quotes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-xl text-left border transition flex flex-col justify-between ${
                selectedPresetId === preset.id
                  ? 'bg-indigo-950/60 border-indigo-500/80 text-white glow-indigo'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-sm text-indigo-200 mb-1">{preset.title}</div>
              <p className="text-xs text-slate-400 line-clamp-2">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Target Constraints Settings */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Target Quantity & Unit</label>
          <div className="font-mono text-sm font-semibold text-cyan-300">
            {activeScenario.targetQuantity.toLocaleString()} {activeScenario.targetUnit}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Max Budget Constraint
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">$</span>
            <input
              type="number"
              value={activeScenario.maxBudgetUSD}
              onChange={(e) => setActiveScenario({ ...activeScenario, maxBudgetUSD: parseFloat(e.target.value) || 0 })}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-emerald-400 font-mono focus:outline-none focus:border-indigo-500 w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Max Lead Time (Days)
          </label>
          <input
            type="number"
            value={activeScenario.maxLeadTimeDays}
            onChange={(e) => setActiveScenario({ ...activeScenario, maxLeadTimeDays: parseInt(e.target.value) || 0 })}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-amber-300 font-mono focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>
      </div>

      {/* Supplier Input Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activeScenario.suppliers.map((sup, idx) => (
              <button
                key={sup.id || idx}
                onClick={() => setActiveSupplierTab(idx)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 whitespace-nowrap border ${
                  activeSupplierTab === idx
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{sup.name || `Supplier ${idx + 1}`}</span>
              </button>
            ))}

            <button
              onClick={handleAddSupplier}
              className="px-2.5 py-2 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-500/30 flex items-center gap-1"
              title="Add Vendor Quote"
            >
              <Plus className="w-3.5 h-3.5" /> Add Supplier
            </button>
          </div>

          {activeScenario.suppliers.length > 2 && (
            <button
              onClick={() => handleRemoveSupplier(activeSupplierTab)}
              className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Tab
            </button>
          )}
        </div>

        {/* Text Area for Active Supplier Quote */}
        {currentSupplier && (
          <div className="space-y-2">
            <input
              type="text"
              value={currentSupplier.name}
              onChange={(e) => handleSupplierNameChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-indigo-300 font-medium w-full focus:outline-none focus:border-indigo-500"
              placeholder="Supplier Name / Company..."
            />

            <div className="relative">
              <textarea
                value={currentSupplier.rawText}
                onChange={(e) => handleSupplierTextChange(e.target.value)}
                rows={7}
                className="w-full bg-[#060911] border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-indigo-500/80 shadow-inner"
                placeholder="Paste raw unformatted supplier email, PDF text, or quotation here..."
              />
              <span className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">Raw Unstructured Text Input</span>
            </div>
          </div>
        )}
      </div>

      {/* Trigger Execution Button */}
      <button
        disabled={isProcessing}
        onClick={() => onRunAgent(activeScenario)}
        className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide text-white transition flex items-center justify-center gap-2 shadow-lg ${
          isProcessing
            ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 glow-indigo'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>ProcureFlow Agent Executing Workflow...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            <span>EXECUTE PROCUREFLOW AGENT WORKFLOW</span>
          </>
        )}
      </button>

    </div>
  );
}
