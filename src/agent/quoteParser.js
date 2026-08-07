/**
 * Deterministic NLP Regex Parser for Supplier Quotations
 * Extracts structured quotes from unformatted supplier emails/PDF text
 */

export function parseRawSupplierQuote(supplierName, rawText) {
  const text = rawText || '';

  // 1. Detect Currency
  let currency = 'USD';
  if (text.includes('€') || /EUR/i.test(text)) currency = 'EUR';
  else if (text.includes('£') || /GBP/i.test(text)) currency = 'GBP';
  else if (text.includes('TL') || /TRY/i.test(text)) currency = 'TRY';
  else if (text.includes('SAR') || /SR/i.test(text)) currency = 'SAR';

  // 2. Extract Unit Price
  let unitPrice = 0;
  const unitPriceMatch = text.match(/(?:unit price|price|cost|pc|per unit|per lb|per ton|per pc)[\s:]*([$€£]?[\d,]+(?:\.\d+)?)/i) ||
                         text.match(/([$€£][\d,]+(?:\.\d+)?)\s*(?:\/|\sper)/i);
  if (unitPriceMatch) {
    unitPrice = parseFloat(unitPriceMatch[1].replace(/[$€£,]/g, ''));
  }

  // 3. Extract Quantity
  let quantity = 0;
  const qtyMatch = text.match(/(?:quantity|order volume|qty|volume|toneladas|lbs)[\s:]*([\d,]+)/i);
  if (qtyMatch) {
    quantity = parseFloat(qtyMatch[1].replace(/,/g, ''));
  }

  // 4. Extract Shipping / Additional Fees
  let shippingCost = 0;
  const shippingMatch = text.match(/(?:freight|shipping|logistics|packaging|handling)[\s:]*([$€£]?[\d,]+(?:\.\d+)?)/i);
  if (shippingMatch) {
    shippingCost = parseFloat(shippingMatch[1].replace(/[$€£,]/g, ''));
  }

  // 5. Extract Delivery Lead Time (Days)
  let leadTimeDays = 14; // Default fallback
  const leadTimeMatch = text.match(/(?:lead time|delivery|delivery timeframe|tiempo de entrega)[\s:]*(\d+)\s*(?:business days|calendar days|days|días)?/i);
  if (leadTimeMatch) {
    leadTimeDays = parseInt(leadTimeMatch[1], 10);
  }

  // 6. Extract Payment Terms
  let paymentTerms = 'Net 30';
  const paymentMatch = text.match(/(?:payment terms|payment|términos de pago)[\s:]*([^\n\r]+)/i);
  if (paymentMatch) {
    paymentTerms = paymentMatch[1].trim();
  }

  return {
    id: 'parsed-' + Math.random().toString(36).substring(2, 9),
    supplierName,
    rawText,
    extracted: {
      currency,
      unitPrice,
      quantity,
      shippingCost,
      leadTimeDays,
      paymentTerms
    }
  };
}
