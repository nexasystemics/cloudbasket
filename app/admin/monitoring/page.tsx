// © 2026 NEXQON HOLDINGS — CloudBasket page.tsx
// F35: Complete Monitoring Dashboard
import type { Metadata } from 'next'
import { runHealthChecks } from '@/lib/monitoring/health'
export const metadata: Metadata = { title: 'System Monitoring — CloudBasket Admin' }
export default async function MonitoringPage() {
  const checks = await runHealthChecks()
  const icons: Record<string, string> = { ok: '✅', warning: '⚠️', error: '❌' }
  const colors: Record<string, string> = { ok: 'text-green-500', warning: 'text-orange-500', error: 'text-red-500' }
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">System Monitoring</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[['Healthy', checks.filter(c=>c.status==='ok').length, 'text-green-500'],['Warnings', checks.filter(c=>c.status==='warning').length, 'text-orange-500'],['Errors', checks.filter(c=>c.status==='error').length, 'text-red-500']].map(([l,v,cls]) => (
          <div key={String(l)} className="cb-card p-5 text-center"><p className={`text-3xl font-black ${cls}`}>{v}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{l}</p></div>
        ))}
      </div>
      <div className="space-y-2">
        {checks.map(c => (
          <div key={c.service} className="cb-card p-4 flex items-center gap-4">
            <span className="text-xl">{icons[c.status]}</span>
            <span className="font-black w-48">{c.service}</span>
            <span className={`text-sm ${colors[c.status]} flex-1`}>{c.message}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
