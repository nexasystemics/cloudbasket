// services/monitoring/freshness-monitor.ts
import { hasSupabase, env } from '@/lib/env'
export type FreshnessIssue = { type: string; lastUpdated: Date; maxAgeDays: number; daysSinceUpdate: number; severity: string }
export class ContentFreshnessMonitor {
  async checkProductFreshness(productId: string): Promise<{ productId: string; overallScore: number; issues: FreshnessIssue[] }> {
    const issues: FreshnessIssue[] = []
    if (hasSupabase()) {
      try {
        const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const { data } = await sb.from('product_prices').select('last_synced_at').eq('product_id', productId).single()
        if (data) { const d = (Date.now() - new Date(data.last_synced_at).getTime()) / 86400000; if (d > 1) issues.push({ type: 'productPrice', lastUpdated: new Date(data.last_synced_at), maxAgeDays: 1, daysSinceUpdate: Math.round(d), severity: 'critical' }) }
      } catch { /* no-op */ }
    }
    return { productId, overallScore: Math.max(0, 100 - issues.reduce((s, i) => s + (i.severity === 'critical' ? 30 : 10), 0)), issues }
  }
}
export const freshnessMonitor = new ContentFreshnessMonitor()