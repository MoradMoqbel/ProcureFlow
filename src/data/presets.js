export const PRESET_SCENARIOS = [
  {
    id: 'electronics-sourcing',
    title: '📱 Microcontroller Sourcing (Global Hardware)',
    description: '3 international suppliers submitting quotes in EUR, USD, and GBP with different incoterms & lead times.',
    targetQuantity: 10000,
    targetUnit: 'units',
    weightConstraintKg: 50,
    maxBudgetUSD: 50000,
    maxLeadTimeDays: 15,
    suppliers: [
      {
        id: 'sup-1',
        name: 'Silicon Express Tech (Shenzhen)',
        country: 'China',
        rawText: `QUOTATION #SE-88392
Date: August 4, 2026
Item: STM32F4 Cortex-M4 Microcontroller
Quantity: 10,000 units
Unit Price: $3.85 USD per unit
Tooling Fee: $450 USD (one-time)
Express Air Freight: $620 USD
Delivery Lead Time: 8 business days
Payment Terms: 30% Deposit, 70% before shipment
Warranty: 24 months standard`
      },
      {
        id: 'sup-2',
        name: 'EuroChip Microelectronics GmbH',
        country: 'Germany',
        rawText: `ANGEBOT / QUOTATION REF: DE-9912
Date: 05 August 2026
Product: Industrial Grade Microcontroller MC-F400
Order Volume: 10,000 pcs
Price: €3.40 EUR / pc
Packaging & Handling: €180 EUR
DHL Express Shipping to US/EU: €410 EUR
Lead Time: 14 calendar days
Payment Terms: Net 30 days invoice
Quality Certifications: ISO 9001, RoHS Compliant`
      },
      {
        id: 'sup-3',
        name: 'Britannia Semiconductor Ltd',
        country: 'United Kingdom',
        rawText: `OFFICIAL QUOTE - BSL/2026/0801
Client Reference: RFQ-10K-MCU
Part Name: Cortex M4 Embedded Chip
Order Qty: 10,000 units
Unit Cost: £2.95 GBP
Shipping & Tariffs: £350 GBP
Lead Time: 22 days (Sea Freight)
Payment Terms: Net 60 days
Early Payment Discount: 2.5% if settled within 10 days`
      }
    ]
  },
  {
    id: 'industrial-steel',
    title: '🏗️ Structural Steel Beams (Construction & Logistics)',
    description: 'Heavy industrial supply requiring unit conversions (Metric Tons vs Lbs vs Kg) and freight risk analysis.',
    targetQuantity: 25,
    targetUnit: 'tons',
    weightConstraintKg: 25000,
    maxBudgetUSD: 45000,
    maxLeadTimeDays: 20,
    suppliers: [
      {
        id: 'sup-steel-1',
        name: 'Apex Steel Industries LLC',
        country: 'United States',
        rawText: `SALES QUOTE #APX-4401
Item: Grade A36 Structural H-Beams
Quantity: 55,115 lbs (~25 Metric Tons)
Price: $0.72 USD per lb
Flatbed Logistics Delivery: $1,800 USD
Delivery Timeframe: 5 days
Payment Terms: Wire transfer upon delivery`
      },
      {
        id: 'sup-steel-2',
        name: 'Siderurgica Global SA',
        country: 'Spain',
        rawText: `COTIZACIÓN INTERNACIONAL ES-5510
Producto: Vigas de Acero Estructural H-Beam
Cantidad: 25 Toneladas Métricas
Precio por Tonelada: €1,250 EUR / Tonelada
Flete Marítimo y Aduana: €2,100 EUR
Tiempo de Entrega: 18 días hábiles
Términos de Pago: 50% anticipado, 50% contra conocimiento de embarque`
      }
    ]
  }
];
