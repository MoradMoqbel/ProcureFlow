import { parseRawSupplierQuote } from './quoteParser.js';
import { evaluateAndScoreSuppliers } from './scoringEngine.js';

export async function runProcureFlowAgentProcess(suppliersData, constraints, onEventCallback) {
  const emit = (event) => {
    if (typeof onEventCallback === 'function') {
      onEventCallback(event);
    }
  };

  // Step 1: Initialize Agent Context
  emit({
    timestamp: new Date().toLocaleTimeString(),
    type: 'THINKING',
    title: 'Agent Context Initialized',
    message: `Initializing ProcureFlow Enterprise Agent Runtime... Received ${suppliersData.length} supplier quotation documents for evaluation.`
  });
  await sleep(600);

  // Step 2: Tool Call - Parsing Documents
  emit({
    timestamp: new Date().toLocaleTimeString(),
    type: 'TOOL_CALL',
    toolName: 'parse_supplier_quote',
    title: 'Executing NLP Quote Parser',
    message: 'Extracting structured JSON entities (Unit Prices, Currencies, Incoterms, Lead Times, Additional Fees)...'
  });

  const parsedSuppliers = [];
  for (const sup of suppliersData) {
    await sleep(400);
    const parsed = parseRawSupplierQuote(sup.name, sup.rawText);
    parsedSuppliers.push(parsed);

    emit({
      timestamp: new Date().toLocaleTimeString(),
      type: 'LOG',
      title: `Parsed: ${sup.name}`,
      message: `Extracted Currency: ${parsed.extracted.currency} | Unit Price: ${parsed.extracted.unitPrice} | Lead Time: ${parsed.extracted.leadTimeDays}d | Terms: ${parsed.extracted.paymentTerms}`
    });
  }

  await sleep(500);

  // Step 3: Tool Call - Currency & Unit Normalization
  emit({
    timestamp: new Date().toLocaleTimeString(),
    type: 'TOOL_CALL',
    toolName: 'normalize_currencies_and_units',
    title: 'Currency & Freight Matrix Normalization',
    message: 'Converting heterogeneous currencies (EUR, GBP, USD) to base USD currency & standardizing volume weight metrics...'
  });
  await sleep(700);

  // Step 4: Tool Call - Multi-criteria Vendor Scoring
  emit({
    timestamp: new Date().toLocaleTimeString(),
    type: 'TOOL_CALL',
    toolName: 'score_and_rank_vendors',
    title: 'Evaluating Enterprise Scoring Model',
    message: `Scoring vendors against constraints (Max Budget: $${constraints.maxBudgetUSD.toLocaleString()} USD | Max Lead Time: ${constraints.maxLeadTimeDays} days)...`
  });

  const evaluationResult = evaluateAndScoreSuppliers(parsedSuppliers, constraints);
  await sleep(600);

  // Step 5: Final Decision Event
  emit({
    timestamp: new Date().toLocaleTimeString(),
    type: 'DECISION',
    title: 'Agent Decision Reached',
    message: `Optimal Supplier Selected: ${evaluationResult.winner.supplierName} (Overall Score: ${evaluationResult.winner.scores.overallScore}/100)`,
    result: evaluationResult
  });

  return evaluationResult;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
