// E26: POD Corporate and B2B Bulk Order System
import { hasSupabase, env } from '@/lib/env'

export type B2BQuoteRequest = { companyName: string; contactEmail: string; contactPhone: string; gstNumber?: string; productType: string; quantity: number; designDescription: string; deliveryDeadline: string; budget?: number }
export type B2BQuote = B2BQuoteRequest & { id: string; unitPrice: number; totalPrice: number; gstAmount: number; grandTotal: number; validUntil: string; status: 'pending' | 'sent' | 'accepted' | 'rejected'; createdAt: string }

const B2B_PRICING: Record<string, { base: number; bulk50: number; bulk100: number; bulk500: number }> = {
  tshirt: { base: 650, bulk50: 580, bulk100: 520, bulk500: 450 },
  mug: { base: 350, bulk50: 300, bulk100: 270, bulk500: 240 },
  hoodie: { base: 1200, bulk50: 1050, bulk100: 950, bulk500: 850 },
  'tote-bag': { base: 380, bulk50: 320, bulk100: 280, bulk500: 250 },
  'phone-case': { base: 280, bulk50: 240, bulk100: 210, bulk500: 180 },
}

export function calculateB2BPrice(productType: string, quantity: number): number {
  const pricing = B2B_PRICING[productType] || { base: 500, bulk50: 450, bulk100: 400, bulk500: 350 }
  if (quantity >= 500) return pricing.bulk500
  if (quantity >= 100) return pricing.bulk100
  if (quantity >= 50) return pricing.bulk50
  return pricing.base
}

export async function createB2BQuote(request: B2BQuoteRequest): Promise<B2BQuote | null> {
  const unitPrice = calculateB2BPrice(request.productType, request.quantity)
  const totalPrice = unitPrice * request.quantity
  const gstAmount = Math.round(totalPrice * 0.18)
  const grandTotal = totalPrice + gstAmount
  const quote: B2BQuote = {
    ...request, id: `B2B-${Date.now()}`, unitPrice, totalPrice, gstAmount, grandTotal,
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'pending', createdAt: new Date().toISOString()
  }
  if (hasSupabase()) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      await sb.from('b2b_quotes').insert(quote)
    } catch { /* no-op */ }
  }
  return quote
}