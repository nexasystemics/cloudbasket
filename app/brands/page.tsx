'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { BRAND_DESCRIPTIONS } from '@/lib/brand-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'

export default function BrandsPage() {
  const [query, setQuery] = useState('')

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    INDIA_CATALOG.forEach((p) => { counts[p.brand] = (counts[p.brand] ?? 0) + 1 })
    return counts
  }, [])

  const brands = useMemo(() => {
    const all = Object.entries(BRAND_DESCRIPTIONS).map(([key, info]) => ({
      key,
      ...info,
      count: brandCounts[key] ?? brandCounts[info.name] ?? 0,
    }))
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all.filter((b) => b.name.toLowerCase().includes(q) || b.primaryCategory.toLowerCase().includes(q) || b.key.toLowerCase().includes(q))
  }, [query, brandCounts])

  const grouped = useMemo(() => {
    const groups: Record<string, typeof brands> = {}
    brands.forEach((brand) => {
      const letter = brand.key.charAt(0).toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(brand)
    })
    return groups
  }, [brands])

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-black tracking-tighter mb-2">Brand Directory</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">{brands.length} brands available on CloudBasket</p>

      <div className="relative mb-8 max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
        <input className="cb-input w-full pl-11" placeholder="Search brands..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([letter, letterBrands]) => (
        <div key={letter} className="mb-8">
          <h2 className="text-2xl font-black text-skyline-primary mb-4">{letter}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {letterBrands.map((brand) => (
              <Link key={brand.key} href={`/brand/${encodeURIComponent(brand.key)}`} className="cb-card p-5 hover:border-skyline-primary transition-colors group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-skyline-primary/10 mb-3">
                  <span className="text-xl font-black text-skyline-primary">{brand.key.charAt(0)}</span>
                </div>
                <h3 className="font-black group-hover:text-skyline-primary transition-colors">{brand.key}</h3>
                <p className="text-xs text-[var(--cb-text-muted)] mt-0.5 line-clamp-1">{brand.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="cb-badge text-[10px]">{brand.primaryCategory.split(' ')[0]}</span>
                  {brand.count > 0 && <span className="text-xs text-[var(--cb-text-muted)]">{brand.count} products</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}