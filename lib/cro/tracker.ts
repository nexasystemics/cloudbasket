// lib/cro/tracker.ts
// Conversion Rate Optimisation event tracking.

export const FUNNEL_EVENTS = {
  PRODUCT_VIEW: 'product_view',
  PRICE_COMPARISON_VIEW: 'price_comparison_view',
  CTA_HOVER: 'cta_hover',
  CTA_CLICK: 'cta_click',
  AFFILIATE_REDIRECT: 'affiliate_redirect',
  PRICE_ALERT_SET: 'price_alert_set',
  WISHLIST_ADD: 'wishlist_add',
  COMPARE_ADD: 'compare_add',
  SEARCH_CLICK: 'search_result_click',
} as const

type CROEvent = { event: string; properties: Record<string, string | number | boolean>; timestamp: number; sessionId: string; pageUrl: string }

function getSessionId(): string {
  try {
    const key = 'cb_cro_session'
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const id = Math.random().toString(36).substring(2)
    sessionStorage.setItem(key, id)
    return id
  } catch { return 'unknown' }
}

export class CROTracker {
  trackEvent(event: string, properties: Record<string, string | number | boolean> = {}): void {
    if (typeof window === 'undefined') return
    try {
      const key = 'cb_cro_events'
      const stored = localStorage.getItem(key)
      const events: CROEvent[] = stored ? JSON.parse(stored) : []
      events.push({ event, properties, timestamp: Date.now(), sessionId: getSessionId(), pageUrl: window.location.pathname })
      if (events.length > 500) events.splice(0, events.length - 500)
      localStorage.setItem(key, JSON.stringify(events))
    } catch { /* no-op */ }
  }

  getConversionRate(startEvent: string, endEvent: string): number {
    try {
      const stored = localStorage.getItem('cb_cro_events')
      if (!stored) return 0
      const events: CROEvent[] = JSON.parse(stored)
      const sessions = new Set(events.filter(e => e.event === startEvent).map(e => e.sessionId))
      const converted = new Set(events.filter(e => e.event === endEvent && sessions.has(e.sessionId)).map(e => e.sessionId))
      return sessions.size > 0 ? (converted.size / sessions.size) * 100 : 0
    } catch { return 0 }
  }
}

export const croTracker = new CROTracker()