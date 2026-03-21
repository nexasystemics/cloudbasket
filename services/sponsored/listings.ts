// services/sponsored/listings.ts
import { hasSupabase, env } from '@/lib/env'
export type SponsoredPlacement = { campaignId: string; productIds: string[]; placementType: string; priority: number; label?: string }
export class SponsoredListingsService {
  async getActiveSponsorships(placement: string): Promise<SponsoredPlacement[]> {
    if (!hasSupabase()) return []
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const today = new Date().toISOString().split('T')[0]
      const { data } = await sb.from('sponsored_campaigns').select('*').eq('placement_type', placement).eq('status', 'active').lte('start_date', today).gte('end_date', today)
      return (data || []).map((c: any) => ({ campaignId: c.id, productIds: c.product_ids || [], placementType: c.placement_type, priority: 1, label: 'Sponsored' }))
    } catch { return [] }
  }
  recordImpression(campaignId: string, productId: string, placement: string): void { fetch('/api/sponsored/impression', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId, productId, placement }) }).catch(() => { /* no-op */ }) }
  recordClick(campaignId: string, productId: string): void { fetch('/api/sponsored/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId, productId }) }).catch(() => { /* no-op */ }) }
}
export const sponsoredListings = new SponsoredListingsService()