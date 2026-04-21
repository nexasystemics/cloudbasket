// lib/analytics/revenue-attribution.ts
// Revenue attribution across all 7 revenue streams.
export const REVENUE_STREAMS = { AMAZON_AFFILIATE: { name: 'Amazon Associates', type: 'affiliate', commissionRate: 0.04 }, FLIPKART_AFFILIATE: { name: 'Flipkart Affiliate', type: 'affiliate', commissionRate: 0.03 }, CJ_NETWORK: { name: 'Commission Junction', type: 'affiliate', commissionRate: 0.05 }, GOOGLE_ADSENSE: { name: 'Google AdSense', type: 'advertising', commissionRate: null }, SPONSORED_LISTINGS: { name: 'Sponsored Listings', type: 'direct', commissionRate: null }, ASSOCIATES_PROGRAM: { name: 'Associates Program', type: 'referral', commissionRate: 0.03 }, POD_SALES: { name: 'Print on Demand', type: 'direct', commissionRate: null } } as const
type Click = { productId: string; platform: string; price: number; estimatedCommission: number; clickedAt: string; pageUrl: string; sessionId: string }
function getSessionId(): string { try { const k = 'cb_session_id'; return sessionStorage.getItem(k) || (() => { const id = Math.random().toString(36).substring(2); sessionStorage.setItem(k, id); return id })() } catch { return 'unknown' } }
export class RevenueAttributionEngine {
  estimateCommission(platform: string, price: number): number {
    const rates: Record<string, number> = { Amazon: 0.04, Flipkart: 0.03, 'CJ Global': 0.05, Croma: 0.03, Myntra: 0.04, BigBasket: 0.02 }
    return price * (rates[platform] || 0.03)
  }
  attributeClick(productId: string, platform: string, price: number): void {
    if (typeof window === 'undefined') return
    try {
      const click: Click = { productId, platform, price, estimatedCommission: this.estimateCommission(platform, price), clickedAt: new Date().toISOString(), pageUrl: window.location.pathname, sessionId: getSessionId() }
      const k = 'cb_revenue_clicks'; const s = localStorage.getItem(k); const clicks: Click[] = s ? JSON.parse(s) : []
      clicks.unshift(click); if (clicks.length > 1000) clicks.splice(1000)
      localStorage.setItem(k, JSON.stringify(clicks))
      navigator.sendBeacon?.('/api/revenue/click', JSON.stringify(click))
    } catch { /* no-op */ }
  }
  getDailyEstimate(): number {
    try { const s = localStorage.getItem('cb_revenue_clicks'); if (!s) return 0; const today = new Date().toISOString().split('T')[0]; return JSON.parse(s).filter((c: Click) => c.clickedAt.startsWith(today)).reduce((sum: number, c: Click) => sum + c.estimatedCommission, 0) } catch { return 0 }
  }
  getStreamBreakdown(): { stream: string; clicks: number; estimate: number }[] {
    try { const s = localStorage.getItem('cb_revenue_clicks'); if (!s) return []; const clicks: Click[] = JSON.parse(s); const bd: Record<string, { clicks: number; estimate: number }> = {}; clicks.forEach(c => { if (!bd[c.platform]) bd[c.platform] = { clicks: 0, estimate: 0 }; bd[c.platform].clicks++; bd[c.platform].estimate += c.estimatedCommission }); return Object.entries(bd).map(([stream, d]) => ({ stream, ...d })).sort((a, b) => b.estimate - a.estimate) } catch { return [] }
  }
}
export const revenueAttribution = new RevenueAttributionEngine()
