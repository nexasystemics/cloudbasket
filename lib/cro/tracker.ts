// lib/cro/tracker.ts
// CRO event tracking.
export const FUNNEL_EVENTS = { PRODUCT_VIEW: 'product_view', CTA_CLICK: 'cta_click', AFFILIATE_REDIRECT: 'affiliate_redirect', PRICE_ALERT_SET: 'price_alert_set', WISHLIST_ADD: 'wishlist_add' } as const
type CROEvent = { event: string; properties: Record<string, string | number | boolean>; timestamp: number; sessionId: string; pageUrl: string }
function getSessionId(): string { try { const k = 'cb_cro_session'; return sessionStorage.getItem(k) || (() => { const id = Math.random().toString(36).substring(2); sessionStorage.setItem(k, id); return id })() } catch { return 'unknown' } }
export class CROTracker {
  trackEvent(event: string, properties: Record<string, string | number | boolean> = {}): void {
    if (typeof window === 'undefined') return
    try {
      const key = 'cb_cro_events'; const stored = localStorage.getItem(key); const events: CROEvent[] = stored ? JSON.parse(stored) : []
      events.unshift({ event, properties, timestamp: Date.now(), sessionId: getSessionId(), pageUrl: window.location.pathname })
      localStorage.setItem(key, JSON.stringify(events.slice(0, 500)))
    } catch { /* no-op */ }
  }
  getConversionRate(startEvent: string, endEvent: string): number {
    try {
      const events: CROEvent[] = JSON.parse(localStorage.getItem('cb_cro_events') || '[]')
      const starts = new Set(events.filter(e => e.event === startEvent).map(e => e.sessionId))
      const converted = new Set(events.filter(e => e.event === endEvent && starts.has(e.sessionId)).map(e => e.sessionId))
      return starts.size > 0 ? (converted.size / starts.size) * 100 : 0
    } catch { return 0 }
  }
}
export const croTracker = new CROTracker()