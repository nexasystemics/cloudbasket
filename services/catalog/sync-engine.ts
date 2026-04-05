// services/catalog/sync-engine.ts
// Catalog sync — keeps product prices fresh from affiliate APIs.
import { flipkartAPI } from '@/services/apis/flipkart-affiliate'
import { hasSupabase, env } from '@/lib/env'
export type SyncResult = { source: string; productsChecked: number; pricesUpdated: number; errors: number; syncedAt: Date }
const priceCache = new Map<string, { price: number; platform: string; syncedAt: Date }>()
export class CatalogSyncEngine {
  async syncProductPrices(source: 'amazon' | 'flipkart' | 'cj'): Promise<SyncResult> {
    const result: SyncResult = { source, productsChecked: 0, pricesUpdated: 0, errors: 0, syncedAt: new Date() }
    if (source === 'flipkart') {
      try {
        const deals = await flipkartAPI.getDeals(); result.productsChecked = deals.length
        if (hasSupabase()) {
          const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
          for (const d of deals) { try { await sb.from('product_prices').upsert({ product_id: `fk-${d.productId}`, platform: 'flipkart', current_price: d.price, previous_price: d.mrp, last_synced_at: new Date().toISOString() }); priceCache.set(`fk-${d.productId}`, { price: d.price, platform: 'flipkart', syncedAt: new Date() }); result.pricesUpdated++ } catch { result.errors++ } }
        }
      } catch { result.errors++ }
    }
    return result
  }
  getLivePriceOverride(productId: string): { price: number; platform: string } | null {
    const c = priceCache.get(productId); if (!c) return null
    if (Date.now() - c.syncedAt.getTime() > 300000) { priceCache.delete(productId); return null }
    return { price: c.price, platform: c.platform }
  }
  async getLivePriceFromSupabase(productId: string): Promise<{ price: number; platform: string; lastSynced: string } | null> {
    if (!hasSupabase()) return null
    try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY); const { data } = await sb.from('product_prices').select('current_price,platform,last_synced_at').eq('product_id', productId).single(); if (!data) return null; if (Date.now() - new Date(data.last_synced_at).getTime() > 86400000) return null; return { price: data.current_price, platform: data.platform, lastSynced: data.last_synced_at } } catch { return null }
  }
}
export const catalogSync = new CatalogSyncEngine()

