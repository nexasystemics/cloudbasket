// lib/ab-testing.ts
// Lightweight A/B testing framework — deterministic variant assignment.

function getUserId(): string {
  try {
    const key = 'cb_user_id'
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = 'usr_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem(key, id)
    return id
  } catch { return 'anonymous' }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0 }
  return Math.abs(hash)
}

export function getVariant(testId: string, variants: string[]): string {
  if (typeof window === 'undefined') return variants[0]
  try {
    const userId = getUserId()
    const index = hashString(`${testId}_${userId}`) % variants.length
    return variants[index]
  } catch { return variants[0] }
}

export function trackConversion(testId: string, variantId: string, eventType: 'click' | 'view' | 'affiliate-click'): void {
  try {
    const key = 'cb_ab_events'
    const stored = localStorage.getItem(key)
    const events = stored ? JSON.parse(stored) : []
    events.unshift({ testId, variantId, eventType, timestamp: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(events.slice(0, 200)))
  } catch { /* no-op */ }
}

export function getTestResults(testId: string): Record<string, { views: number; clicks: number; ctr: number }> {
  try {
    const stored = localStorage.getItem('cb_ab_events')
    if (!stored) return {}
    const events = JSON.parse(stored) as { testId: string; variantId: string; eventType: string }[]
    const testEvents = events.filter(e => e.testId === testId)
    const results: Record<string, { views: number; clicks: number; ctr: number }> = {}
    testEvents.forEach(e => {
      if (!results[e.variantId]) results[e.variantId] = { views: 0, clicks: 0, ctr: 0 }
      if (e.eventType === 'view') results[e.variantId].views++
      if (e.eventType === 'click' || e.eventType === 'affiliate-click') results[e.variantId].clicks++
    })
    Object.values(results).forEach(r => { r.ctr = r.views > 0 ? Math.round((r.clicks / r.views) * 1000) / 10 : 0 })
    return results
  } catch { return {} }
}