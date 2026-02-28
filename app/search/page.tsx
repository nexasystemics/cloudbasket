'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products-data'
import type { Product } from '@/lib/products-data'

const BRAND_COLOR = '#039BE5'
const CTA_COLOR   = '#E65100'

function SearchResults() {
  const params  = useSearchParams()
  const query   = (params.get('q') ?? '').toLowerCase().trim()
  const cat     = params.get('category') ?? ''

  const results: Product[] = PRODUCTS.filter((p) => {
    const matchQ   = query === '' || p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.tags.some((t) => t.toLowerCase().includes(query))
    const matchCat = cat === '' || p.category === cat
    return matchQ && matchCat
  })

  if (query === '' && cat === '') {
    return (
      <p className="text-center text-gray-500 py-12 text-sm">
        Start typing to search products.
      </p>
    )
  }

  if (results.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12 text-sm">
        No products found for &ldquo;{query}&rdquo;. Try a different keyword.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((p) => (
        <article
          key={p.id}
          className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-square rounded-t-xl overflow-hidden bg-gray-50">
            <img
              src={p.imageUrl}
              alt={p.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-xs font-semibold text-gray-800">{p.name}</p>
            <p className="mt-1 text-xs text-gray-400">{p.brand}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs text-gray-400 line-through">{p.originalPrice}</span>
              <span className="text-sm font-bold" style={{ color: BRAND_COLOR }}>{p.discountedPrice}</span>
            </div>
            <Link
              href={`/products/${p.id}`}
              className="mt-2 block w-full rounded-lg py-2 text-center text-xs font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: CTA_COLOR }}
            >
              View Deal
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search across {PRODUCTS.length} products from Amazon &amp; Flipkart.
        </p>
      </div>

      {/* Search form */}
      <form method="GET" action="/search" className="flex gap-2 mb-8">
        <input
          type="search"
          name="q"
          placeholder="Search phones, laptops, books..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2"
          style={{ focusRingColor: BRAND_COLOR } as React.CSSProperties}
          autoFocus
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: BRAND_COLOR }}
        >
          Search
        </button>
      </form>

      {/* Results */}
      <Suspense fallback={<p className="text-sm text-gray-400">Loading...</p>}>
        <SearchResults />
      </Suspense>
    </main>
  )
}
