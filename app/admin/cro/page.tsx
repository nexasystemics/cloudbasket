'use client'
import { useEffect, useState } from 'react'
import { croTracker, FUNNEL_EVENTS } from '@/lib/cro/tracker'
export default function CRODashboardPage() {
  const [rates, setRates] = useState({ viewToClick: 0, clickToRedirect: 0, viewToAlert: 0 })
  useEffect(() => { setRates({ viewToClick: croTracker.getConversionRate(FUNNEL_EVENTS.PRODUCT_VIEW, FUNNEL_EVENTS.CTA_CLICK), clickToRedirect: croTracker.getConversionRate(FUNNEL_EVENTS.CTA_CLICK, FUNNEL_EVENTS.AFFILIATE_REDIRECT), viewToAlert: croTracker.getConversionRate(FUNNEL_EVENTS.PRODUCT_VIEW, FUNNEL_EVENTS.PRICE_ALERT_SET) }) }, [])
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">CRO Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">{rates.viewToClick.toFixed(1)}%</p><p className="text-xs text-[var(--cb-text-muted)]">View → Click Rate</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-green-500">{rates.clickToRedirect.toFixed(1)}%</p><p className="text-xs text-[var(--cb-text-muted)]">Click → Redirect Rate</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-orange-500">{rates.viewToAlert.toFixed(1)}%</p><p className="text-xs text-[var(--cb-text-muted)]">View → Alert Rate</p></div>
      </div>
    </main>
  )
}