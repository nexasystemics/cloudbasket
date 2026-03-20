// lib/adsense/revenue-tracker.ts
// Tracks ad performance metrics client-side with sendBeacon on unload.

export type AdMetrics = {
  impressions: Record<string, number>
  sessionId: string
  pageUrl: string
  recordedAt: string
}

export function getSessionAdMetrics(): AdMetrics {
  try {
    const stored = localStorage.getItem('cb_ad_impressions')
    const impressions = stored ? JSON.parse(stored) : {}
    return {
      impressions,
      sessionId: getOrCreateSessionId(),
      pageUrl: typeof window !== 'undefined' ? window.location.pathname : '/',
      recordedAt: new Date().toISOString(),
    }
  } catch {
    return { impressions: {}, sessionId: '', pageUrl: '/', recordedAt: new Date().toISOString() }
  }
}

function getOrCreateSessionId(): string {
  try {
    const key = 'cb_session_id'
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const id = Math.random().toString(36).substring(2)
    sessionStorage.setItem(key, id)
    return id
  } catch { return '' }
}

export function registerBeaconOnUnload(): void {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeunload', () => {
    try {
      const metrics = getSessionAdMetrics()
      if (Object.keys(metrics.impressions).length === 0) return
      navigator.sendBeacon('/api/analytics/ads', JSON.stringify(metrics))
    } catch { /* no-op */ }
  })
}