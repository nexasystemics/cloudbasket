'use client'
import { useEffect, useState } from 'react'
import { revenueAttribution } from '@/lib/analytics/revenue-attribution'
import { TrendingUp, Target } from 'lucide-react'
export default function RevenueDashboardPage() {
  const [daily, setDaily] = useState(0); const [breakdown, setBreakdown] = useState<any[]>([]); const [target, setTarget] = useState(50000)
  useEffect(() => { setDaily(revenueAttribution.getDailyEstimate()); setBreakdown(revenueAttribution.getStreamBreakdown()); try { const t = localStorage.getItem('cb_revenue_target'); if (t) setTarget(Number(t)) } catch { /* no-op */ } }, [])
  const total = breakdown.reduce((s, b) => s + b.estimate, 0)
  const COLORS = ['bg-blue-500','bg-orange-500','bg-green-500','bg-purple-500','bg-yellow-500']
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Revenue Command Centre</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-green-500">₹{daily.toFixed(0)}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Today's Estimate</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">₹{total.toFixed(0)}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Session Total</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-orange-500">{breakdown.reduce((s,b)=>s+b.clicks,0)}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Total Clicks</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-purple-500">{breakdown.length}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Active Streams</p></div>
      </div>
      <div className="cb-card p-6 mb-6">
        <h2 className="font-black mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-skyline-primary"/>Revenue by Platform</h2>
        {breakdown.length === 0 ? <p className="text-sm text-[var(--cb-text-muted)]">No clicks yet. Revenue attribution starts when users click affiliate links.</p> : breakdown.map((item, i) => (
          <div key={item.stream} className="flex items-center gap-3 mb-3">
            <span className="text-sm w-28 truncate">{item.stream}</span>
            <div className="flex-1 h-6 bg-[var(--cb-surface-2)] rounded-lg overflow-hidden"><div className={`h-full ${COLORS[i % COLORS.length]} rounded-lg`} style={{ width: `${total > 0 ? (item.estimate / total) * 100 : 0}%` }} /></div>
            <span className="text-sm font-black w-20 text-right">₹{item.estimate.toFixed(0)}</span>
          </div>
        ))}
      </div>
      <div className="cb-card p-6">
        <h2 className="font-black mb-3 flex items-center gap-2"><Target size={18}/>Monthly Target</h2>
        <div className="flex-1 h-4 bg-[var(--cb-surface-2)] rounded-full overflow-hidden mb-2"><div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, Math.round((total / target) * 100))}%` }} /></div>
        <p className="text-sm text-[var(--cb-text-muted)]">₹{total.toFixed(0)} of ₹{target.toLocaleString('en-IN')}</p>
      </div>
    </main>
  )
}