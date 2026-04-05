// services/deals/auto-discovery.ts
// Automated deal discovery from affiliate APIs.

import { flipkartAPI } from '@/services/apis/flipkart-affiliate'
import { hasSupabase, env } from '@/lib/env'

export type DiscoveredDeal = { source: 'amazon' | 'flipkart' | 'cj'; externalId: string; title: string; imageUrl: string; originalPrice: number; dealPrice: number; discountPercent: number; affiliateUrl: string; category: string; brand?: string }
export type CuratedDeal = DiscoveredDeal & { dealScore: number; expiresAt: Date; approved: boolean }

export class DealDiscoveryEngine {
  async discoverFromFlipkart(): Promise<DiscoveredDeal[]> {
    try {
      const products = await flipkartAPI.getDeals()
      return products.filter(p => p.discount >= 20).map(p => ({ source: 'flipkart' as const, externalId: p.productId, title: p.title, imageUrl: p.imageUrl, originalPrice: p.mrp, dealPrice: p.price, discountPercent: p.discount, affiliateUrl: p.affiliateUrl, category: p.category || 'general', brand: p.brand }))
    } catch { return [] }
  }
  async curateDeals(discovered: DiscoveredDeal[]): Promise<CuratedDeal[]> {
    return discovered.filter(d => d.discountPercent >= 15 && d.originalPrice > 0).slice(0, 50).map(deal => ({ ...deal, dealScore: Math.min(100, Math.round(deal.discountPercent * 0.5 + 30)), expiresAt: new Date(Date.now() + 86400000), approved: deal.discountPercent > 25 })).sort((a, b) => b.dealScore - a.dealScore)
  }
  async publishDeals(deals: CuratedDeal[]): Promise<void> {
    if (!hasSupabase()) { console.info('[DealDiscovery] Supabase not configured'); return }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      for (const d of deals.filter(x => x.approved)) {
        await sb.from('auto_deals').upsert({ id: `${d.source}-${d.externalId}`, source: d.source, title: d.title, deal_price: d.dealPrice, original_price: d.originalPrice, discount_percent: d.discountPercent, affiliate_url: d.affiliateUrl, deal_score: d.dealScore, published_at: new Date().toISOString() })
      }
    } catch (e) { console.warn('[DealDiscovery]', e) }
  }
}
export const dealDiscovery = new DealDiscoveryEngine()

