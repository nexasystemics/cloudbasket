// services/price-engine/tracker.ts
// Purpose: Core price tracking engine for recording and analyzing price history.
// A20: Supabase integration for price_history table.

import { supabaseAdmin } from '@/lib/supabase'

export interface PriceHistoryPoint {
  id: string
  product_id: string
  price: number
  platform: string
  recorded_at: string
}

const inMemoryPriceHistory = new Map<string, PriceHistoryPoint[]>()

export class PriceTracker {
  /**
   * Records a new price point for a product.
   */
  async trackProduct(productId: string, currentPrice: number, platform: string): Promise<void> {
    try {
      if (supabaseAdmin) {
        const { error } = await supabaseAdmin
          .from('price_history')
          .insert({
            product_id: productId,
            price: currentPrice,
            platform: platform,
          })

        if (error) throw error
        return
      }

      // Fallback to memory store for local dev with no Supabase keys.
      const history = inMemoryPriceHistory.get(productId) ?? []
      const point: PriceHistoryPoint = {
        id: `${Date.now()}-${productId}`,
        product_id: productId,
        price: currentPrice,
        platform,
        recorded_at: new Date().toISOString(),
      }
      history.push(point)
      inMemoryPriceHistory.set(productId, history)
    } catch (err) {
      console.error('Error tracking product price:', err)
      throw err
    }
  }

  /**
   * Retrieves price history for a product, optionally limited by days.
   */
  async getPriceHistory(productId: string, days: number = 30): Promise<PriceHistoryPoint[]> {
    try {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)

      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('price_history')
          .select('*')
          .eq('product_id', productId)
          .gte('recorded_at', cutoff.toISOString())
          .order('recorded_at', { ascending: true })

        if (error) throw error
        return (data || []) as PriceHistoryPoint[]
      }

      const localHistory = inMemoryPriceHistory.get(productId) ?? []
      return localHistory
        .filter((point) => new Date(point.recorded_at) >= cutoff)
        .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    } catch (err) {
      console.error('Error fetching price history:', err)
      return []
    }
  }

  /**
   * Gets the lowest recorded price for a product.
   */
  async getLowestPrice(productId: string): Promise<{ price: number; platform: string; date: Date } | null> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('price_history')
          .select('price, platform, recorded_at')
          .eq('product_id', productId)
          .order('price', { ascending: true })
          .limit(1)
          .single()

        if (error || !data) return null
        return {
          price: data.price,
          platform: data.platform,
          date: new Date(data.recorded_at),
        }
      }

      const localHistory = inMemoryPriceHistory.get(productId) ?? []
      if (localHistory.length === 0) return null
      const lowest = [...localHistory].sort((a, b) => a.price - b.price)[0]
      return {
        price: lowest.price,
        platform: lowest.platform,
        date: new Date(lowest.recorded_at),
      }
    } catch (err) {
      console.error('Error getting lowest price:', err)
      return null
    }
  }

  /**
   * Gets the highest recorded price for a product.
   */
  async getHighestPrice(productId: string): Promise<{ price: number; platform: string; date: Date } | null> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('price_history')
          .select('price, platform, recorded_at')
          .eq('product_id', productId)
          .order('price', { ascending: false })
          .limit(1)
          .single()

        if (error || !data) return null
        return {
          price: data.price,
          platform: data.platform,
          date: new Date(data.recorded_at),
        }
      }

      const localHistory = inMemoryPriceHistory.get(productId) ?? []
      if (localHistory.length === 0) return null
      const highest = [...localHistory].sort((a, b) => b.price - a.price)[0]
      return {
        price: highest.price,
        platform: highest.platform,
        date: new Date(highest.recorded_at),
      }
    } catch (err) {
      console.error('Error getting highest price:', err)
      return null
    }
  }

  /**
   * Calculates the price drop status for a product.
   */
  async getPriceDrop(productId: string): Promise<{ dropped: boolean; dropPercent: number; currentPrice: number; previousPrice: number } | null> {
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('price_history')
          .select('price')
          .eq('product_id', productId)
          .order('recorded_at', { ascending: false })
          .limit(2)

        if (error || !data || data.length < 2) return null

        const currentPrice = data[0].price
        const previousPrice = data[1].price
        const dropped = currentPrice < previousPrice
        const dropPercent = dropped ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100) : 0

        return {
          dropped,
          dropPercent,
          currentPrice,
          previousPrice,
        }
      }

      const localHistory = inMemoryPriceHistory.get(productId) ?? []
      if (localHistory.length < 2) return null
      const sorted = [...localHistory].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      const currentPrice = sorted[0].price
      const previousPrice = sorted[1].price
      const dropped = currentPrice < previousPrice
      const dropPercent = dropped ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100) : 0
      return { dropped, dropPercent, currentPrice, previousPrice }
    } catch (err) {
      console.error('Error calculating price drop:', err)
      return null
    }
  }
}

export const priceTracker = new PriceTracker()
