// lib/web-vitals.ts
// Web Vitals collection and reporting for CloudBasket performance monitoring

export type VitalMetric = {
  name: string
  value: number
  id: string
  page: string
  recordedAt: string
}

export function reportWebVitals(metric: { name: string; value: number; id: string }): void {
  const payload: VitalMetric = {
    name: metric.name,
    value: Math.round(metric.value),
    id: metric.id,
    page: typeof window !== 'undefined' ? window.location.pathname : '/',
    recordedAt: new Date().toISOString(),
  }

  if (process.env.NODE_ENV === 'development') {
    console.info(`[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms`)
  }

  if (process.env.NODE_ENV === 'production') {
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => { /* fire and forget */ })
  }

  try {
    const stored = localStorage.getItem('cb_web_vitals')
    const existing: VitalMetric[] = stored ? JSON.parse(stored) : []
    existing.unshift(payload)
    localStorage.setItem('cb_web_vitals', JSON.stringify(existing.slice(0, 10)))
  } catch { /* no-op */ }
}

export const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

export function getVitalStatus(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS]
  if (!threshold) return 'good'
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}
