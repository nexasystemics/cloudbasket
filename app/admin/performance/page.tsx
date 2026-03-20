import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Performance Dashboard — Admin | CloudBasket', robots: { index: false, follow: false } }

const VITALS = [
  { name: 'LCP', label: 'Largest Contentful Paint', unit: 'ms', good: 2500, poor: 4000, desc: 'Time to render largest element' },
  { name: 'FID', label: 'First Input Delay', unit: 'ms', good: 100, poor: 300, desc: 'Time to first interaction' },
  { name: 'CLS', label: 'Cumulative Layout Shift', unit: '', good: 0.1, poor: 0.25, desc: 'Visual stability score' },
  { name: 'FCP', label: 'First Contentful Paint', unit: 'ms', good: 1800, poor: 3000, desc: 'Time to first content' },
  { name: 'TTFB', label: 'Time to First Byte', unit: 'ms', good: 800, poor: 1800, desc: 'Server response time' },
]

export default function PerformanceDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Performance Dashboard</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Core Web Vitals monitoring — connect Supabase to see production data.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {VITALS.map((vital) => (
          <div key={vital.name} className="cb-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-black">{vital.name}</span>
              <span className="cb-badge text-[10px]">No data yet</span>
            </div>
            <p className="text-xs text-[var(--cb-text-muted)]">{vital.label}</p>
            <p className="text-xs text-[var(--cb-text-muted)] mt-1">{vital.desc}</p>
            <div className="mt-3 flex gap-3 text-xs">
              <span className="text-green-500">Good: {vital.good}{vital.unit} or less</span>
              <span className="text-red-500">Poor: {vital.poor}{vital.unit} or more</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cb-card p-8 text-center">
        <p className="font-black text-lg mb-2">Start Collecting Data</p>
        <p className="text-[var(--cb-text-muted)] text-sm">Web Vitals will appear here after your first page loads in production with Supabase connected.</p>
        <p className="text-xs text-[var(--cb-text-muted)] mt-2">Add SUPABASE_SERVICE_ROLE_KEY to .env.local to enable storage.</p>
      </div>
    </main>
  )
}