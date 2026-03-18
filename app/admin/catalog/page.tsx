import type { Metadata } from 'next'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import type { IndiaProduct, IndiaCategory, APISource } from '@/lib/india-catalog/types'

export const metadata: Metadata = {
  title: 'Admin — Catalog Overview | CloudBasket',
  robots: { index: false, follow: false },
}

function countBy<K extends string>(items: IndiaProduct[], key: (p: IndiaProduct) => K): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of items) {
    const k = key(item)
    counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

export default function AdminCatalogPage() {
  const total = INDIA_CATALOG.length
  const byCategory = countBy(INDIA_CATALOG, p => p.category)
  const byBrand = countBy(INDIA_CATALOG, p => p.brand)
  const bySource = countBy(INDIA_CATALOG, p => p.apiSource)

  const sortedBrands = Object.entries(byBrand).sort((a, b) => b[1] - a[1])
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const sortedSources = Object.entries(bySource).sort((a, b) => b[1] - a[1])

  return (
    <main className="bg-[var(--cb-bg)] min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl font-black tracking-tighter mb-2">Catalog Admin</h1>
        <p className="text-sm text-[var(--cb-text-muted)] mb-8">
          India Catalog — {total} products across {sortedCategories.length} categories, {sortedBrands.length} brands
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="cb-card p-6 text-center">
            <p className="text-4xl font-black text-[#039BE5]">{total}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--cb-text-muted)] mt-1">Total Products</p>
          </div>
          <div className="cb-card p-6 text-center">
            <p className="text-4xl font-black text-[#E65100]">{sortedBrands.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--cb-text-muted)] mt-1">Brands</p>
          </div>
          <div className="cb-card p-6 text-center">
            <p className="text-4xl font-black text-[#1B5E20]">{sortedCategories.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--cb-text-muted)] mt-1">Categories</p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-black uppercase tracking-tight mb-4">By Category</h2>
          <div className="cb-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--cb-border)] bg-[var(--cb-surface-2)]">
                  <th className="text-left px-4 py-3 font-black uppercase tracking-widest text-[10px]">Category</th>
                  <th className="text-right px-4 py-3 font-black uppercase tracking-widest text-[10px]">Products</th>
                  <th className="text-right px-4 py-3 font-black uppercase tracking-widest text-[10px]">% Share</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map(([cat, count]) => (
                  <tr key={cat} className="border-b border-[var(--cb-border)] last:border-0">
                    <td className="px-4 py-3 font-bold">{cat}</td>
                    <td className="px-4 py-3 text-right font-mono">{count}</td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--cb-text-muted)]">{((count / total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-black uppercase tracking-tight mb-4">By Brand</h2>
          <div className="cb-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--cb-border)] bg-[var(--cb-surface-2)]">
                  <th className="text-left px-4 py-3 font-black uppercase tracking-widest text-[10px]">Brand</th>
                  <th className="text-right px-4 py-3 font-black uppercase tracking-widest text-[10px]">Products</th>
                  <th className="text-right px-4 py-3 font-black uppercase tracking-widest text-[10px]">% Share</th>
                </tr>
              </thead>
              <tbody>
                {sortedBrands.map(([brand, count]) => (
                  <tr key={brand} className="border-b border-[var(--cb-border)] last:border-0">
                    <td className="px-4 py-3 font-bold">{brand}</td>
                    <td className="px-4 py-3 text-right font-mono">{count}</td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--cb-text-muted)]">{((count / total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-black uppercase tracking-tight mb-4">By API Source</h2>
          <div className="cb-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--cb-border)] bg-[var(--cb-surface-2)]">
                  <th className="text-left px-4 py-3 font-black uppercase tracking-widest text-[10px]">Source</th>
                  <th className="text-right px-4 py-3 font-black uppercase tracking-widest text-[10px]">Products</th>
                  <th className="text-right px-4 py-3 font-black uppercase tracking-widest text-[10px]">% Share</th>
                </tr>
              </thead>
              <tbody>
                {sortedSources.map(([source, count]) => (
                  <tr key={source} className="border-b border-[var(--cb-border)] last:border-0">
                    <td className="px-4 py-3 font-bold font-mono">{source}</td>
                    <td className="px-4 py-3 text-right font-mono">{count}</td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--cb-text-muted)]">{((count / total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
