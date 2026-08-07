import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Clock, Truck } from 'lucide-react';

export default function ComparisonMatrix({ evaluationResult }) {
  if (!evaluationResult || !evaluationResult.suppliers) return null;

  const { suppliers, winner, summaryReasoning } = evaluationResult;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Winner Highlight Banner */}
      {winner && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-indigo-950/40 glow-emerald flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                  RECOMMENDED SUPPLIER
                </span>
                <h3 className="text-lg font-extrabold text-white">{winner.supplierName}</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{summaryReasoning}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Overall Match</div>
              <div className="text-xl font-mono font-extrabold text-emerald-400">{winner.scores.overallScore}%</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800"></div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Total (USD)</div>
              <div className="text-sm font-mono font-bold text-white">
                ${winner.normalized.totalUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Normalized Supplier Comparison Matrix
          </h3>
          <span className="text-xs font-mono text-slate-400">All prices normalized to USD Base Rate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Vendor Name</th>
                <th className="p-3.5">Original Quote</th>
                <th className="p-3.5">Normalized Cost (USD)</th>
                <th className="p-3.5">Lead Time</th>
                <th className="p-3.5">Payment Terms & Risk</th>
                <th className="p-3.5 text-center">Price Score</th>
                <th className="p-3.5 text-center">Speed Score</th>
                <th className="p-3.5 text-center">Overall Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {suppliers.map((sup) => {
                const isWinner = winner && winner.id === sup.id;
                const ext = sup.extracted;
                const norm = sup.normalized;

                return (
                  <tr
                    key={sup.id}
                    className={`transition ${
                      isWinner ? 'bg-indigo-950/40 font-medium text-white' : 'hover:bg-slate-900/50 text-slate-300'
                    }`}
                  >
                    {/* Vendor Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        {isWinner && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        <div>
                          <div className="font-bold text-slate-100">{sup.supplierName}</div>
                          {isWinner && <span className="text-[10px] text-emerald-400 font-mono">Rank #1 Winner</span>}
                        </div>
                      </div>
                    </td>

                    {/* Original Quote */}
                    <td className="p-3.5 font-mono text-slate-400">
                      <div>
                        {ext.currency} {ext.unitPrice} / unit
                      </div>
                      <div className="text-[10px] text-slate-500">
                        + {ext.currency} {ext.shippingCost} freight
                      </div>
                    </td>

                    {/* Normalized USD Total */}
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${norm.totalUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        (${(norm.unitPriceUSD).toFixed(2)} / unit)
                      </div>
                    </td>

                    {/* Lead Time */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-mono text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{norm.leadTimeDays} Days</span>
                      </div>
                      {sup.compliance.exceedsLeadTime && (
                        <span className="text-[10px] text-rose-400 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Exceeds Target
                        </span>
                      )}
                    </td>

                    {/* Payment Risk */}
                    <td className="p-3.5">
                      <div className="text-xs text-slate-200">{ext.paymentTerms}</div>
                      <div className="text-[10px] text-slate-400">{norm.paymentRisk.label}</div>
                    </td>

                    {/* Scores */}
                    <td className="p-3.5 text-center font-mono font-bold text-slate-300">
                      {sup.scores.priceScore}%
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-slate-300">
                      {sup.scores.speedScore}%
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-mono text-xs font-bold ${
                        isWinner
                          ? 'bg-emerald-500 text-slate-950 glow-emerald'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sup.scores.overallScore}%
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
