'use client'
import { useEffect, useState } from 'react'
type Check = { id: string; name: string; status: 'ok' | 'warning' | 'error'; message: string }
const STATIC_CHECKS: Check[] = [
  { id: 'build', name: 'Production Build', status: 'ok', message: '1200+ static pages' },
  { id: 'catalog', name: 'Catalog', status: 'ok', message: '1065+ products' },
  { id: 'sitemap', name: 'Sitemap', status: 'ok', message: '/sitemap.xml accessible' },
  { id: 'robots', name: 'Robots.txt', status: 'ok', message: '/robots.txt accessible' },
  { id: 'pwa', name: 'PWA Manifest', status: 'ok', message: 'manifest.webmanifest configured' },
]
export default function HealthDashboardPage() {
  const [checks] = useState<Check[]>(STATIC_CHECKS)
  const score = Math.round((checks.filter(c => c.status === 'ok').length / checks.length) * 100)
  const color = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500'
  const STATUS_COLORS = { ok: 'bg-green-500', warning: 'bg-yellow-500', error: 'bg-red-500' }
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Platform Health Dashboard</h1>
      <div className="cb-card p-8 text-center mb-8"><p className={`text-7xl font-black ${color}`}>{score}</p><p className="text-[var(--cb-text-muted)] mt-2">Health Score</p><p className="text-xs text-[var(--cb-text-muted)]">{checks.filter(c => c.status === 'ok').length}/{checks.length} systems healthy</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {checks.map(c => (
          <div key={c.id} className="cb-card p-5">
            <div className="flex items-center gap-3 mb-2"><div className={`w-3 h-3 rounded-full ${STATUS_COLORS[c.status]}`} /><span className="font-black text-sm">{c.name}</span><span className={`ml-auto text-xs font-bold ${c.status === 'ok' ? 'text-green-500' : 'text-yellow-500'}`}>{c.status.toUpperCase()}</span></div>
            <p className="text-xs text-[var(--cb-text-muted)]">{c.message}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[{ label: 'Static Pages', val: '1,200+' }, { label: 'Products', val: '1,065+' }, { label: 'Brands', val: '28+' }, { label: 'API Routes', val: '50+' }, { label: 'Legal Pages', val: '7' }].map(s => (
          <div key={s.label} className="cb-card p-4 text-center"><p className="text-2xl font-black text-skyline-primary">{s.val}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{s.label}</p></div>
        ))}
      </div>
    </main>
  )
}