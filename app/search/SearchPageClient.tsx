'use client'

import { Suspense, startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ExternalLink, SlidersHorizontal, X, TrendingUp } from 'lucide-react'
import TrackBehavior from '@/components/TrackBehavior'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'

type Product = (typeof MOCK_PRODUCTS)[number]

type IndexedProduct = {
  product: Product
  searchText: string
  originalPrice: number
  discount: number
}

const TRENDING_SEARCHES: readonly string[] = [
  'iPhone 16',
  'Samsung S25',
  'MacBook Air M3',
  'Nike Air Max',
  'Sony Headphones',
  'iPad Pro',
  'OnePlus 13',
]

const SEARCH_INDEX: readonly IndexedProduct[] = MOCK_PRODUCTS.map((product) => {
  const originalPrice = product.originalPrice ?? Math.round(product.price * 1.2)
  const discount =
    product.discount ?? Math.max(1, Math.round(((originalPrice - product.price) / originalPrice) * 100))

  return {
    product,
    searchText: `${product.name} ${product.brand} ${product.mainCategory}`.toLowerCase(),
    originalPrice,
    discount,
  }
})

function getPlatformBadgeClass(source: Product['source']): string {
  if (source === 'Amazon') {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (source === 'Flipkart') {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState<string>(initialQuery)
  const [sortBy, setSortBy] = useState<string>('relevance')
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    const nextQuery = searchParams.get('q') ?? ''
    startTransition(() => {
      setQuery(nextQuery)
    })
  }, [searchParams])

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()

    const filtered = !normalized
      ? SEARCH_INDEX.slice(0, 20)
      : SEARCH_INDEX.filter(({ searchText }) => searchText.includes(normalized))

    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => a.product.price - b.product.price)
    }
    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => b.product.price - a.product.price)
    }
    if (sortBy === 'rating') {
      return [...filtered].sort((a, b) => b.product.rating - a.product.rating)
    }

    return filtered
  }, [deferredQuery, sortBy])

  return (
    <main className="bg-[var(--cb-bg)]">
      <TrackBehavior searchTerm={deferredQuery.trim() || undefined} />
      <section className="bg-[var(--cb-surface-2)] py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="mb-6 text-center text-3xl font-black tracking-tighter">
            {query ? `Results for "${query}"` : 'Search CloudBasket'}
          </h1>

          <div className="relative">
            <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
            <input
              className="cb-input w-full py-4 pl-12 pr-12 text-base"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value
                startTransition(() => {
                  setQuery(nextQuery)
                })
              }}
              placeholder="Search products, brands, categories..."
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setQuery('')
                  })
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>

          {!query ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <p className="mr-2 inline-flex items-center gap-1 text-xs text-[var(--cb-text-muted)]">
                <TrendingUp size={12} /> Trending:
              </p>
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="cb-badge cb-badge-blue cursor-pointer"
                  onClick={() => {
                    startTransition(() => {
                      setQuery(term)
                    })
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--cb-text-muted)]">
            {query ? `${results.length} results for '${query}'` : 'Showing popular products'}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[var(--cb-text-muted)]" />
            <select
              className="cb-input w-auto py-1.5 text-xs"
              value={sortBy}
              onChange={(event) => {
                const nextSort = event.target.value
                startTransition(() => {
                  setSortBy(nextSort)
                })
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="cb-card mx-auto max-w-md p-16 text-center">
            <Search size={48} className="mx-auto mb-4 text-[var(--cb-text-muted)]" />
            <h2 className="text-xl font-black">No results found</h2>
            <p className="mt-2 text-[var(--cb-text-muted)]">Try different keywords or browse categories</p>
            <Link href="/products" className="cb-btn cb-btn-primary mt-4">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.map(({ product, originalPrice, discount }) => {
              return (
                <article key={product.id} className="cb-card group flex flex-col overflow-hidden">
                  <div className="relative h-44">
                    <Image
                      fill
                      className="object-cover"
                      src={resolveImageSource(product.image, IMAGE_ASSETS.noImage)}
                      alt={product.name}
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {discount ? <span className="cb-badge cb-badge-green">-{discount}%</span> : null}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <span className={`cb-badge w-fit text-[10px] ${getPlatformBadgeClass(product.source)}`}>
                      {product.source === 'CJ' ? 'CJ Global' : product.source}
                    </span>
                    <p className="text-[10px] font-black uppercase text-[var(--cb-text-muted)]">{product.brand}</p>
                    <h3 className="line-clamp-2 text-xs font-bold">{product.name}</h3>
                    <p className="text-xs text-[#F5C842]">★★★★☆</p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <p className="price-current">₹{product.price.toLocaleString('en-IN')}</p>
                      <p className="price-original text-xs">₹{originalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="price-savings text-xs">Save {discount}%</p>

                    <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-primary mt-auto w-full py-2 text-xs">
                      View Deal <ExternalLink size={12} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default function SearchPageClient() {
  return (
    <Suspense
      fallback={
        <main className="bg-[var(--cb-bg)] px-6 py-16 text-center text-sm text-[var(--cb-text-muted)]">Loading search...</main>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
