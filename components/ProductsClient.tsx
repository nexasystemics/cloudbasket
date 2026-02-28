'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { TenantTheme } from '@/lib/themes'
import { PRODUCTS, CATEGORIES, type Category } from '@/lib/products-data'

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

function PlatformBadge({ platform }: { platform: 'Amazon' | 'Flipkart' }) {
  if (platform === 'Amazon') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: '#FF9900' }}>
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white" aria-hidden><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39.01.41.24.02.23-.097.408-.31.507-2.968 1.29-6.13 1.936-9.48 1.936-4.286 0-8.307-1.054-12.06-3.162-.218-.13-.293-.363-.163-.57l.33-.23zm-.547-2.184c-.13-.128-.113-.266.048-.414 3.997-3.624 7.924-7.247 11.78-10.87l.06-.053c.14-.128.26-.16.374-.094.113.067.144.19.093.37l-.03.09-2.19 6.43c-.084.247-.23.357-.44.33-.21-.027-.295-.172-.256-.437l.038-.09 1.67-4.905-9.27 8.54c-.148.137-.28.14-.4.05-.12-.09-.16-.25-.1-.44l.02-.07 1.12-3.29-1.52-2.26c-.08-.12-.1-.235-.063-.35.04-.113.13-.17.27-.17h.12l.16.04 1.44 2.14 1.12-3.29-.19.06c-.12.04-.22.02-.3-.06zm16.37-3.61c-.13-.133-.113-.27.048-.414 1.12-1.022 2.22-2.044 3.33-3.065l.11-.1c.2-.183.4-.18.56.01.16.19.12.4-.11.62l-3.39 3.12c-.21.19-.41.19-.55-.01l-.02-.16zm-5.68.69c-.55 0-1.02-.18-1.42-.55-.4-.37-.6-.83-.6-1.38 0-.54.2-1 .6-1.37.4-.37.87-.55 1.42-.55.55 0 1.02.18 1.42.55.4.37.6.83.6 1.37 0 .55-.2 1.01-.6 1.38-.4.37-.87.55-1.42.55z"/></svg>
        Amazon
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: '#2874F0' }}>
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white" aria-hidden><path d="M11.5.5C5.25.5.25 5.5.25 11.75S5.25 23 11.5 23 22.75 18 22.75 11.75 17.75.5 11.5.5zm5.1 16.4l-.54.54a.42.42 0 01-.6 0l-4.96-4.96-4.96 4.96a.42.42 0 01-.6 0l-.54-.54a.42.42 0 010-.6l4.96-4.96-4.96-4.96a.42.42 0 010-.6l.54-.54a.42.42 0 01.6 0l4.96 4.96 4.96-4.96a.42.42 0 01.6 0l.54.54a.42.42 0 010 .6l-4.96 4.96 4.96 4.96a.42.42 0 010 .6z"/></svg>
      Flipkart
    </span>
  )
}

function ProductCard({ id, name, platform, originalPrice, discountedPrice, rating, discountPercent, imageUrl, category, theme }: {
  id: string; name: string; platform: 'Amazon' | 'Flipkart'
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

export default function ProductsClient({ theme }: { theme: TenantTheme }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [sortBy, setSortBy] = useState<SortOption>('Relevance')
  const [search, setSearch] = useState('')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

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
            onChange={(e) => { setSearch(e.target.value); setDisplayCount(PAGE_SIZE) }}
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
              onClick={() => { setActiveCategory('All'); setSearch(''); setDisplayCount(PAGE_SIZE) }}
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
        <p className="mt-6 text-center text-xs text-gray-400">
          Affiliate links — we may earn a commission at no extra cost to you.
        </p>
      </section>
    </>
  )
}
