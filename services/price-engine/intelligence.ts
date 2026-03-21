// services/price-engine/intelligence.ts
// Price intelligence engine — detects drops, trends, deal opportunities.

import { hasSupabase, env } from '@/lib/env'

export type PriceDropEvent = { productId: string; currentPrice: number; previousPrice: number; dropPercent: number; dropType: 'daily' | 'weekly' | 'alltime'; triggeredAlerts: number }

export class PriceIntelligenceEngine {
  async detectPriceDrop(productId: string, currentPrice: number): Promise<PriceDropEvent | null> {
    if (!hasSupabase()) return null
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const { data } = await sb.from('price_history').select('price').eq('product_id', productId).order('recorded_at', { ascending: false }).limit(7)
      if (!data || data.length < 2) return null
      const avg = data.reduce((s: number, r: any) => s + r.price, 0) / data.length
      if (currentPrice < avg * 0.95) return { productId, currentPrice, previousPrice: data[0].price, dropPercent: Math.round(((data[0].price - currentPrice) / data[0].price) * 100), dropType: 'weekly', triggeredAlerts: 0 }
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
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const { data } = await sb.from('price_history').select('price').eq('product_id', productId).order('recorded_at', { ascending: false }).limit(14)
      if (!data || data.length < 5) return 'stable'
      const prices = data.map((r: any) => r.price)
      const half = Math.floor(prices.length / 2)
      const first = prices.slice(half).reduce((s: number, p: number) => s + p, 0) / half
      const second = prices.slice(0, half).reduce((s: number, p: number) => s + p, 0) / half
      if (second > first * 1.03) return 'rising'
      if (second < first * 0.97) return 'falling'
      return 'stable'
    } catch { return 'stable' }
  }
}

export const priceIntelligence = new PriceIntelligenceEngine()