// services/deals/auto-discovery.ts
// Automated deal discovery from affiliate APIs.
// Stubs return empty when credentials not configured.

import { flipkartAPI } from '@/services/apis/flipkart-affiliate'
import { hasSupabase } from '@/lib/env'

export type DiscoveredDeal = {
  source: 'amazon' | 'flipkart' | 'cj'
  externalId: string
  title: string
  imageUrl: string
  originalPrice: number
  dealPrice: number
  discountPercent: number
  affiliateUrl: string
  category: string
  brand?: string
}

export type CuratedDeal = DiscoveredDeal & {
  dealScore: number
  expiresAt: Date
  approved: boolean
  autoApproved: boolean
}

export class DealDiscoveryEngine {
  async discoverFromFlipkart(): Promise<DiscoveredDeal[]> {
    try {
      const products = await flipkartAPI.getDeals()
      return products.filter(p => p.discount >= 20).map(p => ({
        source: 'flipkart' as const,
        externalId: p.productId,
        title: p.title,
        imageUrl: p.imageUrl,
        originalPrice: p.mrp,
        dealPrice: p.price,
        discountPercent: p.discount,
        affiliateUrl: p.affiliateUrl,
        category: p.category || 'general',
        brand: p.brand,
      }))
    } catch { return [] }
  }

  scoreDeал(deal: DiscoveredDeal): number {
    return Math.min(100, Math.round((deal.discountPercent * 0.5) + 30))
  }

  async curateDeals(discovered: DiscoveredDeal[]): Promise<CuratedDeal[]> {
    const filtered = discovered.filter(d => d.discountPercent >= 15 && d.originalPrice > 0)
    const deduped = filtered.reduce((acc, deal) => {
      const existing = acc.find(d => d.title.toLowerCase().includes(deal.title.toLowerCase().slice(0, 20)))
      if (!existing || deal.dealPrice < existing.dealPrice) {
        acc = acc.filter(d => d !== existing)
        acc.push(deal)
      }
      return acc
    }, [] as DiscoveredDeal[])

    return deduped.slice(0, 50).map(deal => {
      const score = this.scoreDeал(deal)
      return {
        ...deal,
        dealScore: score,
        expiresAt: new Date(Date.now() + 86400000),
        approved: score > 70 && deal.source === 'flipkart' && deal.discountPercent > 25,
        autoApproved: score > 70,
      }
    }).sort((a, b) => b.dealScore - a.dealScore)
  }

  async publishDeals(deals: CuratedDeal[]): Promise<void> {
    if (!hasSupabase()) { console.info('[DealDiscovery] Supabase not configured — deals not stored'); return }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const { env } = await import('@/lib/env')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      for (const deal of deals.filter(d => d.approved)) {
        await supabase.from('auto_deals').upsert({ id: `${deal.source}-${deal.externalId}`, source: deal.source, title: deal.title, deal_price: deal.dealPrice, original_price: deal.originalPrice, discount_percent: deal.discountPercent, affiliate_url: deal.affiliateUrl, deal_score: deal.dealScore, approved: deal.approved, published_at: new Date().toISOString() })
      }
    } catch (err) { console.warn('[DealDiscovery] Publish failed:', err) }
  }
}

export const dealDiscovery = new DealDiscoveryEngine()