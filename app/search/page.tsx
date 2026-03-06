'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import ProductGrid from '@/components/products/ProductGrid'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'
import type { Product } from '@/lib/types'

const ALL_FILTER = 'All'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState<string>(searchParams.get('q') ?? '')
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER)

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const syncQueryToUrl = useCallback(
    (nextQuery: string): void => {
      const params = new URLSearchParams(searchParams.toString())
      const cleaned = nextQuery.trim()

      if (cleaned.length > 0) {
        params.set('q', cleaned)
      } else {
        params.delete('q')
      }

      const queryString = params.toString()
      router.replace(queryString.length > 0 ? `/search?${queryString}` : '/search')
    },
    [router, searchParams],
  )

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const nextQuery = event.target.value
      setQuery(nextQuery)
      syncQueryToUrl(nextQuery)
    },
    [syncQueryToUrl],
  )

  const handleReset = useCallback((): void => {
    setQuery('')
    setActiveFilter(ALL_FILTER)
    router.replace('/search')
  }, [router])

  const searchResults = useMemo<Product[]>(() => {
    const cleaned = query.trim().toLowerCase()
    if (cleaned.length < 2) {
      return []
    }

    return PRODUCTS.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(cleaned) ||
        product.description.toLowerCase().includes(cleaned) ||
        product.brand.toLowerCase().includes(cleaned)

      const matchesStatus = product.status === 'Approved'
      const matchesCategory = activeFilter === ALL_FILTER || product.mainCategory === activeFilter

      return matchesQuery && matchesStatus && matchesCategory
    }).slice(0, 60)
  }, [activeFilter, query])

  const hasSearchInput = query.trim().length >= 2

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-[var(--cb-text-primary)]">
          Search Results
        </h1>

        <div className="glass-panel relative mt-6 w-full max-w-2xl">
          <Search
            size={20}
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search products, brands, categories..."
            className="w-full rounded-card bg-transparent py-4 pe-4 ps-12 text-[15px] text-[var(--cb-text-primary)] outline-none"
            aria-label="Search products, brands, categories"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[ALL_FILTER, ...MAIN_CATEGORIES].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveFilter(category)}
              className={`rounded-pill px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition-colors ${
                activeFilter === category
                  ? 'bg-skyline-primary text-white'
                  : 'cb-btn-ghost text-[var(--cb-text-muted)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-[var(--cb-text-muted)]">
          {hasSearchInput
            ? `${searchResults.length} results for "${query.trim()}"`
            : 'Start typing to search...'}
        </p>

        {hasSearchInput && searchResults.length === 0 ? (
          <div className="mt-10 rounded-card border cb-border bg-[var(--cb-surface-2)] p-8 text-center">
            <h2 className="text-xl font-black text-[var(--cb-text-primary)]">
              No results for &quot;{query.trim()}&quot;
            </h2>
            <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
              Try: Mobiles, Laptops, Fashion...
            </p>
            <Link href={ROUTES.PRODUCTS} className="mt-4 inline-flex cb-btn-ghost">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={searchResults} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}

function SearchPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cb-surface)]">
      <p className="text-sm text-[var(--cb-text-muted)]">Loading search...</p>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  )
}
