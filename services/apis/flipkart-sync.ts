// services/apis/flipkart-sync.ts
// Flipkart deal sync — fetches latest deals and upserts to Supabase cache.

import { flipkartAPI, FlipkartProduct } from './flipkart-affiliate'
import { hasSupabase } from '@/lib/env'

export type SyncResult = { synced: number; failed: number; syncedAt: Date }

export async function syncFlipkartDeals(): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, failed: 0, syncedAt: new Date() }
  try {
    const deals = await flipkartAPI.getDeals()
    if (deals.length === 0) return result

    if (!hasSupabase()) {
      console.info('[FlipkartSync] Supabase not configured — deals fetched but not stored:', deals.length)
      result.synced = deals.length
      return result
    }

    const { createClient } = await import('@supabase/supabase-js')
    const { env } = await import('@/lib/env')
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    for (const deal of deals) {
      try {
        await supabase.from('flipkart_deals_cache').upsert({
          id: deal.productId,
          source: 'flipkart',
          product_id: deal.productId,
          title: deal.title,
          price: deal.price,
          mrp: deal.mrp,
          discount: deal.discount,
          image_url: deal.imageUrl,
          affiliate_url: deal.affiliateUrl,
          synced_at: new Date().toISOString(),
        })
        result.synced++
      } catch { result.failed++ }
    }
  } catch (err) {
    console.warn('[FlipkartSync] Sync failed:', err)
  }
  return result
}