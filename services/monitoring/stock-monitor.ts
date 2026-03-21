// services/monitoring/stock-monitor.ts
// Real-time stock monitoring for affiliate products.

import { hasSupabase } from '@/lib/env'

export type StockCheckResult = {
  productId: string
  platform: string
  inStock: boolean
  quantity?: 'low' | 'medium' | 'high'
  checkedAt: Date
  confidence: 'high' | 'medium' | 'low'
}

export class StockMonitor {
  async checkStockStatus(productId: string, affiliateUrl: string, platform: string): Promise<StockCheckResult> {
    try {
      const res = await fetch(affiliateUrl, { method: 'HEAD', signal: AbortSignal.timeout(8000) })
      const inStock = res.status !== 404 && res.status !== 410
      return { productId, platform, inStock, quantity: inStock ? 'medium' : undefined, checkedAt: new Date(), confidence: 'medium' }
    } catch {
      return { productId, platform, inStock: true, checkedAt: new Date(), confidence: 'low' }
    }
  }

  async getStockStatus(productId: string): Promise<StockCheckResult | null> {
    if (!hasSupabase()) return null
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const { env } = await import('@/lib/env')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const { data } = await supabase.from('product_stock').select('*').eq('product_id', productId).single()
      return data ? { productId, platform: data.platform, inStock: data.in_stock, checkedAt: new Date(data.last_checked_at), confidence: 'high' } : null
    } catch { return null }
  }
}

export const stockMonitor = new StockMonitor()