'use client'
import { useEffect, useState } from 'react'
import { croTracker, FUNNEL_EVENTS } from '@/lib/cro/tracker'

export default function CRODashboardPage() {
  const [rates, setRates] = useState<Record<string, number>>({})

  useEffect(() => {
    setRates({
      viewToClick: croTracker.getConversionRate(FUNNEL_EVENTS.PRODUCT_VIEW, FUNNEL_EVENTS.CTA_CLICK),
      clickToRedirect: croTracker.getConversionRate(FUNNEL_EVENTS.CTA_CLICK, FUNNEL_EVENTS.AFFILIATE_REDIRECT),
      viewToAlert: croTracker.getConversionRate(FUNNEL_EVENTS.PRODUCT_VIEW, FUNNEL_EVENTS.PRICE_ALERT_SET),
    })
  }, [])

  const FUNNEL = [
    { label: 'Product Views', key: 'product_view', color: 'bg-blue-500' },
    { label: 'CTA Clicks', key: 'cta_click', color: 'bg-skyline-primary' },
    { label: 'Affiliate Redirects', key: 'affiliate_redirect', color: 'bg-green-500' },
  ]

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">CRO Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">{rates.viewToClick?.toFixed(1) || 0}%</p><p className="text-xs text-[var(--cb-text-muted)]">View → Click Rate</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-green-500">{rates.clickToRedirect?.toFixed(1) || 0}%</p><p className="text-xs text-[var(--cb-text-muted)]">Click → Redirect Rate</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-orange-500">{rates.viewToAlert?.toFixed(1) || 0}%</p><p className="text-xs text-[var(--cb-text-muted)]">View → Alert Set Rate</p></div>
      </div>
      <div className="cb-card p-6">
        <h2 className="font-black mb-4">Conversion Funnel</h2>
        {FUNNEL.map((stage, i) => (
          <div key={stage.key} className="flex items-center gap-4 mb-3">
            <span className="text-sm w-36 text-[var(--cb-text-muted)]">{stage.label}</span>
            <div className="flex-1 h-8 bg-[var(--cb-surface-2)] rounded-lg overflow-hidden">
              <div className={`h-full ${stage.color} rounded-lg transition-all`} style={{ width: `${Math.max(5, 100 - i * 25)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}