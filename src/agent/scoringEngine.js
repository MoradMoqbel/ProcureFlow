import { convertCurrency, parsePaymentTermsRiskScore } from './normalizer.js';

export function evaluateAndScoreSuppliers(parsedSuppliers, constraints = {}) {
  const { maxBudgetUSD = 50000, maxLeadTimeDays = 20 } = constraints;

  // 1. Calculate normalized totals in USD
  const normalizedList = parsedSuppliers.map(item => {
    const ext = item.extracted;
    
    // Total original price = (unitPrice * quantity) + shippingCost
    const subtotalOrig = (ext.unitPrice * ext.quantity);
    const totalOrig = subtotalOrig + ext.shippingCost;

    // Convert everything to USD
    const unitPriceUSD = convertCurrency(ext.unitPrice, ext.currency, 'USD');
    const shippingUSD = convertCurrency(ext.shippingCost, ext.currency, 'USD');
    const totalUSD = convertCurrency(totalOrig, ext.currency, 'USD');

    // Risk assessment
    const paymentRisk = parsePaymentTermsRiskScore(ext.paymentTerms);

    return {
      ...item,
      normalized: {
        currency: 'USD',
        unitPriceUSD,
        shippingUSD,
        totalUSD,
        leadTimeDays: ext.leadTimeDays,
        paymentRisk
      }
    };
  });

  // Find minimum price and lead time to normalize relative scores
  const minPrice = Math.min(...normalizedList.map(s => s.normalized.totalUSD));
  const minLeadTime = Math.min(...normalizedList.map(s => s.normalized.leadTimeDays));

  // 2. Compute Scores
  const scored = normalizedList.map(supplier => {
    const n = supplier.normalized;

    // Price Score (45% weight): lower is better
    const priceRatio = minPrice / (n.totalUSD || 1);
    const priceScore = Math.min(100, Math.max(0, priceRatio * 100));

    // Speed / Lead Time Score (35% weight): lower lead time is better
    const speedRatio = minLeadTime / (n.leadTimeDays || 1);
    const speedScore = Math.min(100, Math.max(0, speedRatio * 100));

    // Terms Score (20% weight)
    const termsScore = n.paymentRisk.score;

    // Overall Weighted Score
    const overallScore = Math.round((priceScore * 0.45) + (speedScore * 0.35) + (termsScore * 0.20));

    // Flags & Compliance
    const exceedsBudget = n.totalUSD > maxBudgetUSD;
    const exceedsLeadTime = n.leadTimeDays > maxLeadTimeDays;

    return {
      ...supplier,
      scores: {
        priceScore: Math.round(priceScore),
        speedScore: Math.round(speedScore),
        termsScore: Math.round(termsScore),
        overallScore
      },
      compliance: {
        exceedsBudget,
        exceedsLeadTime,
        isCompliant: !exceedsBudget && !exceedsLeadTime
      }
    };
  });

  // Sort by overall score descending
  scored.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

  const winner = scored[0];

  return {
    suppliers: scored,
    winner,
    summaryReasoning: generateWinnerReasoning(winner, scored)
  };
}

function generateWinnerReasoning(winner, allSuppliers) {
  if (!winner) return 'No valid supplier quotes evaluated.';

  const n = winner.normalized;
  const runnerUp = allSuppliers[1];

  let reasoning = `Selected **${winner.supplierName}** as the optimal vendor with an overall score of **${winner.scores.overallScore}/100**. `;
  reasoning += `It offers a total normalized cost of **$${n.totalUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD** with a lead time of **${n.leadTimeDays} days**. `;

  if (runnerUp) {
    const savings = runnerUp.normalized.totalUSD - n.totalUSD;
    if (savings > 0) {
      reasoning += `Compared to ${runnerUp.supplierName}, this provides a net savings of **$${savings.toLocaleString(undefined, {maximumFractionDigits: 0})} USD**.`;
    } else {
      reasoning += `Although ${runnerUp.supplierName} is slightly cheaper, ${winner.supplierName} won due to superior delivery lead time (${n.leadTimeDays}d vs ${runnerUp.normalized.leadTimeDays}d) and safer payment terms.`;
    }
  }

  return reasoning;
}
