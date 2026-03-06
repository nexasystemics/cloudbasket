'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { TenantTheme } from '@/lib/themes'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS, CATEGORIES, type Category, type Platform } from '@/lib/products-data'

const PAGE_SIZE = 8

const SORT_OPTIONS = [
  'Relevance',
  'Price: Low to High',
  'Price: High to Low',
  'Top Rated',
  'Biggest Discount',
] as const
type SortOption = (typeof SORT_OPTIONS)[number]

function ProductsContent({ theme }: { theme: TenantTheme }) {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [sortBy, setSortBy] = useState<SortOption>('Relevance')
  const [search, setSearch] = useState('')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const cat = searchParams.get('category')
    const query = searchParams.get('q')

    if (cat && CATEGORIES.includes(cat as Category)) {
      setActiveCategory(cat as Category)
    } else {
      setActiveCategory('All')
    }

    if (query) {
      setSearch(query)
    } else {
      setSearch('')
    }
    setDisplayCount(PAGE_SIZE)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    switch (sortBy) {
      case 'Price: Low to High': return [...list].sort((a, b) => a.priceValue - b.priceValue)
      case 'Price: High to Low': return [...list].sort((a, b) => b.priceValue - a.priceValue)
      case 'Top Rated':          return [...list].sort((a, b) => b.rating - a.rating)
      case 'Biggest Discount':   return [...list].sort((a, b) => b.discountPercent - a.discountPercent)
      default:                   return list
    }
  }, [activeCategory, search, sortBy])

  const visible = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat)
    setDisplayCount(PAGE_SIZE)
    // Update URL without full reload to sync with state
    const params = new URLSearchParams(window.location.search)
    if (cat === 'All') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  return (
    <>
      {/* ── Search ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <input
            type="search"
            placeholder="Search products, brands, categories…"
            value={search}
            onChange={(e) => { 
              const val = e.target.value
              setSearch(val)
              setDisplayCount(PAGE_SIZE)
              const params = new URLSearchParams(window.location.search)
              if (val) params.set('q', val)
              else params.delete('q')
              window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
            }}
            className="w-full md:max-w-md px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{ ['--tw-ring-color' as string]: '#039BE5' }}
          />
        </div>
      </div>

      {/* ── Filter Pill Bar ── */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap hover:scale-105"
                  style={
                    isActive
                      ? { backgroundColor: '#039BE5', borderColor: '#039BE5', color: '#fff', boxShadow: '0 2px 8px rgba(3,155,229,0.35)' }
                      : { color: '#374151', borderColor: '#e5e7eb', backgroundColor: '#fff' }
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Sort + Count ── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-gray-600 text-sm">
            {search ? `${filtered.length} results for "${search}"` : `Showing ${Math.min(visible.length, filtered.length)} of ${filtered.length} products`}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-gray-600 text-sm font-medium">Sort:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: '#039BE5' }}
            >
              {SORT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-medium">No products found.</p>
            <button
              type="button"
              onClick={() => { 
                setActiveCategory('All'); 
                setSearch(''); 
                setDisplayCount(PAGE_SIZE);
                window.history.pushState({}, '', window.location.pathname)
              }}
              className="mt-3 text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: '#039BE5' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {visible.map((p) => (
              <ProductCard key={p.id} {...p} theme={theme} />
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
              className="px-10 py-3 rounded-xl border-2 font-semibold text-sm hover:opacity-90 transition-all hover:scale-105"
              style={{ borderColor: '#039BE5', color: '#039BE5' }}
            >
              Load {Math.min(PAGE_SIZE, filtered.length - displayCount)} More Products
            </button>
            <p className="mt-2 text-xs text-gray-400">
              Showing {visible.length} of {filtered.length}
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default function ProductsClient({ theme }: { theme: TenantTheme }) {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-[#039BE5]">Loading Products...</div>}>
      <ProductsContent theme={theme} />
    </Suspense>
  )
}
