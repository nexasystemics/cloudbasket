import type { Metadata } from 'next'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { CATALOG_PRODUCTS } from '@/lib/cloudbasket-data'

export const metadata: Metadata = {
  title: 'Analytics — Admin | CloudBasket',
  robots: { index: false, follow: false },
}

function getCatalogCoverage() {
  const byCategory: Record<string, { count: number; brands: Set<string>; totalPrice: number }> = {}
  for (const p of INDIA_CATALOG) {
    if (!byCategory[p.category]) byCategory[p.category] = { count: 0, brands: new Set(), totalPrice: 0 }
    byCategory[p.category].count++
    byCategory[p.category].brands.add(p.brand)
    byCategory[p.category].totalPrice += p.price
  }
  return Object.entries(byCategory).map(([cat, data]) => ({
    category: cat,
    count: data.count,
    brands: data.brands.size,
    avgPrice: Math.round(data.totalPrice / data.count),
  }))
}

export default function AdminAnalyticsPage() {
  const coverage = getCatalogCoverage()
  const totalIndia = INDIA_CATALOG.length
  const totalCB = CATALOG_PRODUCTS.length
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Analytics Dashboard</h1>

      {/* Panel 1 — GA4 */}
      <section className="cb-card p-6 mb-6">
        <h2 className="text-lg font-black mb-4">Site Traffic</h2>
        {gaId ? (
          <p className="text-sm text-[var(--cb-text-muted)]">
            Analytics data available in{' '}
            <a href={`https://analytics.google.com/analytics/web/#/p${gaId}`} target="_blank" rel="noopener noreferrer" className="text-skyline-primary underline">
              GA4 Dashboard
            </a>
          </p>
        ) : (
          <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
            <p className="text-sm font-black text-orange-600">Connect Google Analytics</p>
            <p className="text-xs text-[var(--cb-text-muted)] mt-1">Add NEXT_PUBLIC_GA_ID to .env.local to enable tracking.</p>
          </div>
        )}
      </section>

      {/* Panel 2 — Catalog Coverage */}
      <section className="cb-card p-6 mb-6">
        <h2 className="text-lg font-black mb-4">India Catalog Coverage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="cb-card p-4 text-center">
            <p className="text-3xl font-black text-skyline-primary">{totalIndia}</p>
            <p className="text-xs text-[var(--cb-text-muted)] uppercase tracking-widest mt-1">India Products</p>
          </div>
          <div className="cb-card p-4 text-center">
            <p className="text-3xl font-black text-skyline-primary">{totalCB}</p>
            <p className="text-xs text-[var(--cb-text-muted)] uppercase tracking-widest mt-1">CB Products</p>
          </div>
          <div className="cb-card p-4 text-center">
            <p className="text-3xl font-black text-skyline-primary">{totalIndia + totalCB}</p>
            <p className="text-xs text-[var(--cb-text-muted)] uppercase tracking-widest mt-1">Total Products</p>
          </div>
          <div className="cb-card p-4 text-center">
            <p className="text-3xl font-black text-skyline-primary">{coverage.length}</p>
            <p className="text-xs text-[var(--cb-text-muted)] uppercase tracking-widest mt-1">Categories</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--cb-border)]">
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Category</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Products</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Brands</th>
                <th className="text-right py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((row) => (
                <tr key={row.category} className="border-b border-[var(--cb-border)]/50 hover:bg-[var(--cb-surface-2)]">
                  <td className="py-3 px-4 font-bold capitalize">{row.category}</td>
                  <td className="py-3 px-4 text-right">{row.count}</td>
                  <td className="py-3 px-4 text-right">{row.brands}</td>
                  <td className="py-3 px-4 text-right">₹{row.avgPrice.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Panel 3 — Category Bar Chart */}
      <section className="cb-card p-6 mb-6">
        <h2 className="text-lg font-black mb-4">Category Distribution</h2>
        <div className="space-y-3">
          {coverage.slice(0, 5).map((row) => (
            <div key={row.category} className="flex items-center gap-4">
              <p className="w-32 text-xs font-bold capitalize truncate">{row.category}</p>
              <div className="flex-1 h-6 bg-[var(--cb-surface-2)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-skyline-primary rounded-full"
                  style={{ width: `${Math.round((row.count / totalIndia) * 100)}%` }}
                />
              </div>
              <p className="w-12 text-xs font-black text-right">{row.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Panel 4 — Alert Pipeline */}
      <section className="cb-card p-6">
        <h2 className="text-lg font-black mb-4">Alert Pipeline</h2>
        <p className="text-sm text-[var(--cb-text-muted)]">Connect Supabase SUPABASE_SERVICE_ROLE_KEY to view live alert data.</p>
      </section>
    </main>
  )
}