// services/tax/gst-engine.ts
const GST_RATES: Record<string, number> = { tshirt: 0.05, mug: 0.12, 'phone-case': 0.18, poster: 0.12, hoodie: 0.12, 'tote-bag': 0.05 }
const HSN_CODES: Record<string, string> = { tshirt: '6109', mug: '6912', 'phone-case': '3926', poster: '4911', hoodie: '6110', 'tote-bag': '6305' }
export type GSTCalculation = { basePrice: number; gstRate: number; gstAmount: number; totalPrice: number; hsn: string; cgst?: number; sgst?: number; igst?: number }
export class GSTEngine {
  calculateGST(basePrice: number, productType: string, isInterState = true): GSTCalculation {
    const gstRate = GST_RATES[productType] || 0.12; const gstAmount = basePrice * gstRate; const hsn = HSN_CODES[productType] || '6109'
    if (isInterState) return { basePrice, gstRate, gstAmount, totalPrice: basePrice + gstAmount, hsn, igst: gstAmount }
    return { basePrice, gstRate, gstAmount, totalPrice: basePrice + gstAmount, hsn, cgst: gstAmount / 2, sgst: gstAmount / 2 }
  }
}
export const gstEngine = new GSTEngine()