import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Monitoring — Admin | CloudBasket' }

export default function MonitoringPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Platform Monitoring</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Link Health', desc: 'Affiliate link status and broken link detection', href: '/admin/monitoring/links' },
          { title: 'Content Freshness', desc: 'Stale product data and content freshness scores', href: '/admin/monitoring/freshness' },
          { title: 'Performance', desc: 'Web Vitals and page load metrics', href: '/admin/performance' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="cb-card p-6 hover:border-skyline-primary transition-colors">
            <h2 className="font-black mb-1">{item.title}</h2>
            <p className="text-sm text-[var(--cb-text-muted)]">{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}