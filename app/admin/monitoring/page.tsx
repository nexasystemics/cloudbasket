import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Monitoring — Admin | CloudBasket' }
export default function MonitoringPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Platform Monitoring</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ title: 'Link Health', href: '/admin/monitoring/links' }, { title: 'Content Freshness', href: '/admin/monitoring/freshness' }, { title: 'Performance', href: '/admin/performance' }].map(i => (
          <Link key={i.href} href={i.href} className="cb-card p-6 hover:border-skyline-primary transition-colors">
            <h2 className="font-black">{i.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  )
}