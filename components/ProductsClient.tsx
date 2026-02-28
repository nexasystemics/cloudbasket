'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { TenantTheme } from '@/lib/themes'
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

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < full ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-gray-500 text-xs">{rating} ({PRODUCTS.find(p => p.rating === rating)?.reviews ?? ''})</span>
    </span>
  )
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const colors: Record<Platform, string> = {
    Amazon: '#FF9900',
    Flipkart: '#2874F0',
    Myntra: '#FF3F6C',
    AJIO: '#2C333E'
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: colors[platform] }}>
      {platform}
    </span>
  )
}

function ProductCard({ id, name, platform, originalPrice, discountedPrice, rating, discountPercent, imageUrl, category, theme }: {
  id: string; name: string; platform: Platform
  originalPrice: string; discountedPrice: string; rating: number
  discountPercent: number; imageUrl: string; category: string
  theme: TenantTheme
}) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 group">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-2 left-2">
          <PlatformBadge platform={platform} />
        </div>
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">
          -{discountPercent}%
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-gray-400 mb-1">{category}</span>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] leading-snug">
          {name}
        </h3>
        <div className="mt-1.5">
          <StarRating rating={rating} />
        </div>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-base" style={{ color: theme.primaryColor }}>{discountedPrice}</span>
          <span className="text-gray-400 text-sm line-through">{originalPrice}</span>
        </div>
        <Link
          href={`/products/${id}`}
          className="mt-3 w-full py-2.5 rounded-lg font-semibold text-white text-center text-sm hover:opacity-90 transition-opacity block"
          style={{ backgroundColor: '#E65100' }}
        >
          View Deal
        </Link>
      </div>
    </article>
  )
}

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
