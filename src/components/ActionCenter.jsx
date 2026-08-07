import React, { useState } from 'react';
import { FileCheck, Mail, Download, Copy, Check, Send, ShoppingCart } from 'lucide-react';

export default function ActionCenter({ evaluationResult }) {
  const [activeTab, setActiveTab] = useState('po');
  const [copied, setCopied] = useState(false);

  if (!evaluationResult || !evaluationResult.winner) return null;

  const { winner, suppliers } = evaluationResult;
  const runnerUp = suppliers[1];

  // Generate Purchase Order Schema
  const poNumber = `PO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const poData = {
    poNumber,
    date: new Date().toISOString().split('T')[0],
    vendorName: winner.supplierName,
    paymentTerms: winner.extracted.paymentTerms,
    expectedDeliveryDays: winner.normalized.leadTimeDays,
    currency: 'USD',
    subtotalUSD: winner.normalized.totalUSD - winner.normalized.shippingUSD,
    shippingUSD: winner.normalized.shippingUSD,
    totalUSD: winner.normalized.totalUSD,
    generatedBy: 'ProcureFlow AI Enterprise Agent v1.0'
  };

  // Generate Emails
  const awardEmail = `Subject: OFFICIAL AWARD NOTICE: Purchase Order ${poNumber} - Sourcing Department

Dear ${winner.supplierName} Sales Team,

We are pleased to inform you that your quotation has been evaluated and selected by our ProcureFlow AI Engine for award under PO ${poNumber}.

Order Summary:
- Total Value: $${winner.normalized.totalUSD.toLocaleString(undefined, {minimumFractionDigits: 2})} USD
- Delivery Timeframe: ${winner.normalized.leadTimeDays} days
- Agreed Terms: ${winner.extracted.paymentTerms}

Please confirm receipt of this notice and provide the official invoice and bank settlement details to initiate processing.

Best regards,
Automated Sourcing Desk | ProcureFlow AI Agent Platform`;

  const regretEmail = runnerUp ? `Subject: Quotation Status Update: RFQ Sourcing Review

Dear ${runnerUp.supplierName} Team,

Thank you for submitting your proposal. Following our automated multi-criteria vendor evaluation, another vendor was selected for this specific order due to a lead time advantage.

We appreciate your participation and look forward to reviewing your future quotations.

Best regards,
ProcureFlow Sourcing Desk` : '';

  const activeEmailText = activeTab === 'award-email' ? awardEmail : regretEmail;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(evaluationResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `spaceflow_agent_eval_${poNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-400" />
            Agent Action & Dispatch Center
          </h3>
          <p className="text-xs text-slate-400">Generate Purchase Orders, automated supplier emails, and ERP JSON records.</p>
        </div>

        <button
          onClick={handleDownloadJSON}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" /> Export Evaluation JSON
        </button>
      </div>

      {/* Action Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('po')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-t border-x ${
            activeTab === 'po'
              ? 'bg-slate-900 text-indigo-400 border-indigo-500/50 text-white'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Draft Purchase Order ({poNumber})
        </button>

        <button
          onClick={() => setActiveTab('award-email')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-t border-x ${
            activeTab === 'award-email'
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/50 text-white'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" /> Winner Award Email
        </button>

        {runnerUp && (
          <button
            onClick={() => setActiveTab('regret-email')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-t border-x ${
              activeTab === 'regret-email'
                ? 'bg-slate-900 text-slate-300 border-slate-700 text-white'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" /> Vendor Rejection Notice
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 relative">
        
        {/* Copy Button */}
        <button
          onClick={() => handleCopy(activeTab === 'po' ? JSON.stringify(poData, null, 2) : activeEmailText)}
          className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>

        {activeTab === 'po' ? (
          <pre className="overflow-x-auto text-emerald-400 leading-relaxed font-mono">
            {JSON.stringify(poData, null, 2)}
          </pre>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
            {activeEmailText}
          </pre>
        )}
      </div>

    </div>
  );
}
