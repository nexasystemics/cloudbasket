// services/price-engine/intelligence.ts
// Price intelligence engine — detects drops, deals, trends.
// All Supabase calls stub-safe.

import { hasSupabase } from '@/lib/env'

export type PriceDropEvent = {
  productId: string
  currentPrice: number
  previousPrice: number
  dropPercent: number
  dropType: 'daily' | 'weekly' | 'alltime'
  triggeredAlerts: number
}

export type DealOpportunity = {
  productId: string
  name: string
  currentPrice: number
  averagePrice: number
  allTimeLow: number
  dealScore: number
  dealType: 'flash' | 'seasonal' | 'clearance' | 'everyday'
}

export class PriceIntelligenceEngine {
  async detectPriceDrop(productId: string, currentPrice: number): Promise<PriceDropEvent | null> {
    if (!hasSupabase()) return null
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const { env } = await import('@/lib/env')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const { data } = await supabase.from('price_history').select('price').eq('product_id', productId).order('recorded_at', { ascending: false }).limit(7)
      if (!data || data.length < 2) return null
      const avgPrice = data.reduce((s: number, r: any) => s + r.price, 0) / data.length
      if (currentPrice < avgPrice * 0.95) {
        return { productId, currentPrice, previousPrice: data[0].price, dropPercent: Math.round(((data[0].price - currentPrice) / data[0].price) * 100), dropType: 'weekly', triggeredAlerts: 0 }
      }
      return null
    } catch { return null }
  }

  generateDealScore(currentPrice: number, originalPrice: number, rating = 4.0): number {
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100
    return Math.min(100, Math.round((discount * 0.4) + (rating * 10 * 0.3) + 30))
  }

  async predictPriceTrend(productId: string): Promise<'rising' | 'falling' | 'stable'> {
    if (!hasSupabase()) return 'stable'
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const { env } = await import('@/lib/env')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const { data } = await supabase.from('price_history').select('price').eq('product_id', productId).order('recorded_at', { ascending: false }).limit(14)
      if (!data || data.length < 5) return 'stable'
      const prices = data.map((r: any) => r.price)
      const firstHalf = prices.slice(prices.length / 2).reduce((s: number, p: number) => s + p, 0) / (prices.length / 2)
      const secondHalf = prices.slice(0, prices.length / 2).reduce((s: number, p: number) => s + p, 0) / (prices.length / 2)
      if (secondHalf > firstHalf * 1.03) return 'rising'
      if (secondHalf < firstHalf * 0.97) return 'falling'
      return 'stable'
    } catch { return 'stable' }
  }
}

export const priceIntelligence = new PriceIntelligenceEngine()