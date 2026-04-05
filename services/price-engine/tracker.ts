// services/price-engine/tracker.ts
// Real-time price tracking engine — records price history in Supabase.
// Falls back gracefully when Supabase not configured.

import { hasSupabase } from '@/lib/env'

export type PriceHistoryPoint = {
  id?: string; productId: string; price: number
  platform: string; recordedAt: Date
}

export type PriceDrop = {
  dropped: boolean; dropPercent: number
  currentPrice: number; previousPrice: number
}

const priceCache = new Map<string, PriceHistoryPoint[]>()

export class PriceTracker {
  async trackProduct(productId: string, currentPrice: number, platform = 'manual'): Promise<void> {
    const entry: PriceHistoryPoint = { productId, price: currentPrice, platform, recordedAt: new Date() }
    const cached = priceCache.get(productId) || []
    cached.unshift(entry)
    priceCache.set(productId, cached.slice(0, 90))

    if (!hasSupabase()) return
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const { env } = await import('@/lib/env')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      await supabase.from('price_history').insert({ product_id: productId, price: currentPrice, platform, recorded_at: new Date().toISOString() })
    } catch (err) { console.warn('[PriceTracker] DB error:', err) }
  }

  async getPriceHistory(productId: string, days = 30): Promise<PriceHistoryPoint[]> {
    if (!hasSupabase()) return priceCache.get(productId) || []
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const { env } = await import('@/lib/env')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const since = new Date(Date.now() - days * 86400000).toISOString()
      const { data } = await supabase.from('price_history').select('*').eq('product_id', productId).gte('recorded_at', since).order('recorded_at', { ascending: false })
      return (data || []).map((r: any) => ({ id: r.id, productId: r.product_id, price: r.price, platform: r.platform, recordedAt: new Date(r.recorded_at) }))
    } catch { return priceCache.get(productId) || [] }
  }

  async getLowestPrice(productId: string): Promise<{ price: number; platform: string; date: Date } | null> {
    const history = await this.getPriceHistory(productId, 90)
    if (!history.length) return null
    const lowest = history.reduce((min, p) => p.price < min.price ? p : min, history[0])
    return { price: lowest.price, platform: lowest.platform, date: lowest.recordedAt }
  }

  async getHighestPrice(productId: string): Promise<{ price: number; platform: string; date: Date } | null> {
    const history = await this.getPriceHistory(productId, 90)
    if (!history.length) return null
    const highest = history.reduce((max, p) => p.price > max.price ? p : max, history[0])
    return { price: highest.price, platform: highest.platform, date: highest.recordedAt }
  }

  async getPriceDrop(productId: string): Promise<PriceDrop | null> {
    const history = await this.getPriceHistory(productId, 30)
    if (history.length < 2) return null
    const current = history[0].price
    const previous = history[1].price
    const dropped = current < previous
    const dropPercent = dropped ? Math.round(((previous - current) / previous) * 100) : 0
    return { dropped, dropPercent, currentPrice: current, previousPrice: previous }
  }
}

export const priceTracker = new PriceTracker()

