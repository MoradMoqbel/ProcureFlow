import { runProcureFlowAgentProcess } from '../src/agent/agentOrchestrator.js';
import { PRESET_SCENARIOS } from '../src/data/presets.js';

async function runCliTest() {
  console.log('===============================================================');
  console.log('🚀 PROCUREFLOW AI AGENT - TERMINAL END-TO-END TEST RUNNER');
  console.log('===============================================================\n');

  const scenario = PRESET_SCENARIOS[0]; // Electronics Sourcing Scenario
  console.log(`📋 SCENARIO: ${scenario.title}`);
  console.log(`🎯 Target Quantity: ${scenario.targetQuantity.toLocaleString()} ${scenario.targetUnit}`);
  console.log(`💰 Max Budget: $${scenario.maxBudgetUSD.toLocaleString()} USD`);
  console.log(`⏱️ Max Lead Time: ${scenario.maxLeadTimeDays} Days\n`);

  console.log('--- 1. RAW SUPPLIER QUOTATION INPUTS ---');
  scenario.suppliers.forEach((s, idx) => {
    console.log(`\n[Supplier #${idx + 1}: ${s.name}]`);
    console.log(s.rawText);
  });

  console.log('\n---------------------------------------------------------------');
  console.log('🤖 EXECUTING PROCUREFLOW AGENT STREAM...');
  console.log('---------------------------------------------------------------\n');

  const constraints = {
    maxBudgetUSD: scenario.maxBudgetUSD,
    maxLeadTimeDays: scenario.maxLeadTimeDays
  };

  const result = await runProcureFlowAgentProcess(
    scenario.suppliers,
    constraints,
    (evt) => {
      console.log(`[${evt.timestamp}] [${evt.type}] ${evt.title}`);
      if (evt.message) console.log(`   ↳ ${evt.message}`);
    }
  );

  console.log('\n===============================================================');
  console.log('📊 EVALUATION & NORMALIZATION MATRIX RESULTS');
  console.log('===============================================================\n');

  result.suppliers.forEach((sup, idx) => {
    const isWinner = result.winner.id === sup.id;
    const norm = sup.normalized;
    const ext = sup.extracted;
    const scores = sup.scores;

    console.log(`${isWinner ? '🏆 [WINNER] ' : '  '} # ${idx + 1}: ${sup.supplierName}`);
    console.log(`   • Original Quote : ${ext.currency} ${ext.unitPrice} / unit (+ ${ext.currency} ${ext.shippingCost} shipping)`);
    console.log(`   • Normalized USD : $${norm.totalUSD.toLocaleString(undefined, {minimumFractionDigits: 2})} USD ($${norm.unitPriceUSD.toFixed(2)}/unit)`);
    console.log(`   • Delivery Time  : ${norm.leadTimeDays} Days`);
    console.log(`   • Payment Terms  : ${ext.paymentTerms} (${norm.paymentRisk.label})`);
    console.log(`   • Scores         : Price: ${scores.priceScore}% | Speed: ${scores.speedScore}% | Overall: ${scores.overallScore}%\n`);
  });

  console.log('---------------------------------------------------------------');
  console.log('💡 FINAL AGENT DECISION REASONING:');
  console.log(`   ${result.summaryReasoning}`);
  console.log('---------------------------------------------------------------\n');

  console.log('📄 GENERATED PURCHASE ORDER (PO JSON):');
  const po = {
    poNumber: `PO-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    vendor: result.winner.supplierName,
    totalUSD: result.winner.normalized.totalUSD,
    leadTimeDays: result.winner.normalized.leadTimeDays,
    status: 'APPROVED_BY_AGENT'
  };
  console.log(JSON.stringify(po, null, 2));

  console.log('\n✅ END-TO-END AGENT WORKFLOW TEST COMPLETED SUCCESSFULLY!');
}

runCliTest().catch(console.error);
