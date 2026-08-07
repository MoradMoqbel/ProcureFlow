// Real-time / Static Currency Rates Matrix (Base USD)
export const EXCHANGE_RATES_TO_USD = {
  USD: 1.0,
  EUR: 1.09, // 1 EUR = 1.09 USD
  GBP: 1.28, // 1 GBP = 1.28 USD
  TRY: 0.029, // 1 TRY = 0.029 USD
  SAR: 0.27, // 1 SAR = 0.27 USD
  CAD: 0.74, // 1 CAD = 0.74 USD
};

// Unit conversion ratios to standard metric (Kg or Units or Tons)
export function convertCurrency(amount, fromCurrency, toCurrency = 'USD') {
  const fromRate = EXCHANGE_RATES_TO_USD[fromCurrency.toUpperCase()] || 1.0;
  const toRate = EXCHANGE_RATES_TO_USD[toCurrency.toUpperCase()] || 1.0;
  
  // Convert from currency -> USD -> target currency
  const inUSD = amount * fromRate;
  return inUSD / toRate;
}

export function normalizeQuantityToTarget(qty, unit, targetUnit) {
  const u = (unit || '').toLowerCase().trim();
  const t = (targetUnit || '').toLowerCase().trim();

  if (u === t) return qty;

  // Weight conversions
  if ((u.includes('lb') || u.includes('pound')) && t === 'tons') {
    return qty / 2204.62; // lbs to metric tons
  }
  if ((u.includes('kg') || u.includes('kilo')) && t === 'tons') {
    return qty / 1000;
  }
  if (u === 'tons' && t === 'lbs') {
    return qty * 2204.62;
  }

  return qty; // Default fallback
}

export function parsePaymentTermsRiskScore(termsStr = '') {
  const t = termsStr.toLowerCase();
  if (t.includes('net 60') || t.includes('net 90')) {
    return { score: 95, label: 'Low Financial Risk (Long Credit Line)' };
  }
  if (t.includes('net 30')) {
    return { score: 85, label: 'Standard Enterprise Credit (Net 30)' };
  }
  if (t.includes('early payment discount') || t.includes('discount')) {
    return { score: 90, label: 'Favorable (Early Discount Available)' };
  }
  if (t.includes('100% advance') || t.includes('prepayment') || t.includes('wire transfer before shipment')) {
    return { score: 40, label: 'High Risk (100% Prepayment Required)' };
  }
  return { score: 70, label: 'Moderate Terms (Split Deposit)' };
}
