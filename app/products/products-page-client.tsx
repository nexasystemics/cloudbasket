'use client'

import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, ExternalLink, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'
import { PRODUCTS as BASE_CATALOG, type Product as BaseProduct } from '@/lib/products-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'

const INDIA_CATEGORY_MAP: Record<string, BaseProduct['category']> = {
  'personal-care': 'Beauty',
  'home-appliances': 'Home',
  'electronics': 'Electronics',
  'fashion': 'Fashion',
  'food-grocery': 'Home',
}

const INDIA_AS_PRODUCTS: BaseProduct[] = INDIA_CATALOG.map(p => {
  const priceValue = p.price
  const originalPriceValue = p.originalPrice ?? Math.round(p.price * 1.2)
  const discountPercent = p.discount ?? Math.max(1, Math.round(((originalPriceValue - priceValue) / originalPriceValue) * 100))
  const platform = p.affiliatePlatform === 'flipkart' || p.affiliatePlatform === 'myntra' ? 'Flipkart' as const : 'Amazon' as const
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    platform,
    originalPrice: `₹${originalPriceValue.toLocaleString('en-IN')}`,
    discountedPrice: `₹${priceValue.toLocaleString('en-IN')}`,
    priceValue,
    rating: p.rating ?? 4.0,
    reviews: (p.reviewCount ?? 0).toLocaleString(),
    discountPercent,
    category: INDIA_CATEGORY_MAP[p.category] ?? 'Electronics',
    imageUrl: p.image,
    description: p.description,
    tags: [...p.tags],
    inStock: p.inStock,
    affiliateUrl: p.affiliateUrl,
    stores: [{
      name: platform,
      price: `₹${priceValue.toLocaleString('en-IN')}`,
      url: p.affiliateUrl,
    }],
  }
})

const CATALOG = (() => {
  const sponsoredFirst = INDIA_AS_PRODUCTS.filter(p => INDIA_CATALOG.find(ip => ip.id === p.id)?.isSponsored)
  const rest = [...BASE_CATALOG, ...INDIA_AS_PRODUCTS.filter(p => !sponsoredFirst.includes(p))]
  return [...sponsoredFirst, ...rest]
})()
import PriceAlertBanner from '@/components/PriceAlertBanner'
import ErrorBoundary from '@/components/ErrorBoundary'

type Product = (typeof CATALOG)[number]
type CategoryFilter = 'All' | Product['category']

const PAGE_SIZE = 20

const CATEGORIES_FILTER = ['All','Mobiles','Laptops','Fashion','Home','Beauty','Sports','Books','Toys'] as const

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
] as const

type SortValue = typeof SORT_OPTIONS[number]['value']

const CATEGORY_LOOKUP: Readonly<Record<string, CategoryFilter>> = CATALOG.reduce<Record<string, CategoryFilter>>(
  (lookup, product) => {
    lookup[product.category.toLowerCase()] = product.category
    return lookup
  },
  { all: 'All' },
)

function normalizeCategory(categoryParam: string | null): CategoryFilter {
  if (categoryParam === null) {
    return 'All'
  }

  const normalized = categoryParam.trim().toLowerCase()
  return CATEGORY_LOOKUP[normalized] ?? 'All'
}

function getPlatformBadgeClass(platform: Product['platform']): string {
  // Use higher contrast badges: solid background with white text for major platforms
  if (platform === 'Amazon') return 'bg-[#FF9900] text-white border border-[#FF9900]/90'
  if (platform === 'Flipkart') return 'bg-[#2874F0] text-white border border-[#2874F0]/90'
  return 'bg-green-500/10 text-green-400 border border-green-500/20'
}

function ProductCard({ product }: { product: Product }) {
  const originalPrice = typeof product.originalPrice === 'string'
    ? parseInt(product.originalPrice.replace(/[₹,]/g, ''), 10)
    : product.priceValue * 1.2
  const discount = Math.max(1, Math.round(((originalPrice - product.priceValue) / originalPrice) * 100))

  return (
    <Link href={`/product/${product.id}`} className="cb-card group flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-[var(--cb-surface-2)]">
        <Image
          src={resolveImageSource(product.imageUrl, IMAGE_ASSETS.noImage)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
        />
        <span className="absolute top-2 left-2 text-xs font-black bg-rose-600 text-white px-2 py-1 rounded-full">
          -{discount}%
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide">{product.brand}</p>
        <p className="font-bold text-sm leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="text-muted">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <p className="text-lg font-black">₹{product.priceValue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted line-through">{product.originalPrice}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getPlatformBadgeClass(product.platform)}`}>
            {product.platform}
          </span>
        </div>
        <button className="w-full cb-btn cb-btn-primary mt-2 flex items-center justify-center gap-2 text-sm">
          <ExternalLink size={14} /> View Deal
        </button>
      </div>
    </Link>
  )
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const requestedCategory = useMemo(
    () => normalizeCategory(categoryParam),
    [categoryParam],
  )
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(requestedCategory)
  const [sortBy, setSortBy] = useState<SortValue>('relevance')
  const [minRating, setMinRating] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const topRef = useRef<HTMLDivElement>(null)
  const deferredCategory = useDeferredValue(selectedCategory)
  const deferredSortBy = useDeferredValue(sortBy)
  const deferredMinRating = useDeferredValue(minRating)

  const filtered = useMemo(() => {
    let result = [...CATALOG]
    if (deferredCategory !== 'All') {
      result = result.filter((p) => p.category === deferredCategory)
    }
    if (deferredMinRating > 0) {
      result = result.filter((p) => p.rating >= deferredMinRating)
    }
    if (deferredSortBy === 'price-asc') result.sort((a, b) => a.priceValue - b.priceValue)
    else if (deferredSortBy === 'price-desc') result.sort((a, b) => b.priceValue - a.priceValue)
    else if (deferredSortBy === 'rating') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [deferredCategory, deferredMinRating, deferredSortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const visiblePageNumbers = useMemo(() => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      return Math.max(1, Math.min(page - 2, totalPages - 4)) + i
    })
  }, [page, totalPages])

  useEffect(() => {
    setSelectedCategory(requestedCategory)
  }, [requestedCategory])

  useEffect(() => { setPage(1) }, [selectedCategory, sortBy, minRating])

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className="bg-[var(--cb-bg)] min-h-screen" ref={topRef}>
      <section className="bg-[var(--cb-surface-2)] py-10">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-black tracking-tighter">All Products</h1>
          <p className="mt-1 text-muted">Compare prices across Amazon, Flipkart and more</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES_FILTER.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                startTransition(() => {
                  setSelectedCategory(cat)
                })
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-[var(--cb-border)] text-muted hover:text-white hover:border-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => {
                const nextSort = e.target.value as SortValue
                startTransition(() => {
                  setSortBy(nextSort)
                })
              }}
              className="cb-input text-sm py-1.5 px-3">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Min Rating:</span>
            {[0, 3, 4].map((r) => (
              <button
                key={r}
                onClick={() => {
                  startTransition(() => {
                    setMinRating(r)
                  })
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  minRating === r ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--cb-border)] text-muted hover:border-white'
                }`}>
                {r === 0 ? 'Any' : `${r}★+`}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-blue-400' : 'text-muted'}`}><Grid3X3 size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'text-blue-400' : 'text-muted'}`}><List size={18} /></button>
          </div>
        </div>

        <p className="text-sm text-muted mb-4">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
        </p>

        <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5' : 'flex flex-col gap-4'}>
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => { startTransition(() => { setPage((p) => Math.max(1, p - 1)) }); scrollTop() }} aria-label="Previous page"
              disabled={page === 1}
              className="p-2 rounded-lg border border-[var(--cb-border)] disabled:opacity-30 hover:border-white transition">
              <ChevronLeft size={18} />
            </button>
            {visiblePageNumbers.map((pageNum) => {
              return (
                <button key={pageNum} onClick={() => { startTransition(() => { setPage(pageNum) }); scrollTop() }}
                  className={`w-9 h-9 rounded-lg text-sm font-bold border transition ${
                    pageNum === page ? 'bg-blue-600 text-white border-blue-600' : 'border-[var(--cb-border)] text-muted hover:border-white'
                  }`}>
                  {pageNum}
                </button>
              )
            })}
            <button onClick={() => { startTransition(() => { setPage((p) => Math.min(totalPages, p + 1)) }); scrollTop() }} aria-label="Next page"
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-[var(--cb-border)] disabled:opacity-30 hover:border-white transition">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>
      <ErrorBoundary>
        <PriceAlertBanner />
      </ErrorBoundary>
    </main>
  )
}
