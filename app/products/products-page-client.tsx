'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SlidersHorizontal, ExternalLink, Grid3X3, List, TrendingDown, Zap } from 'lucide-react'
import { PRODUCTS as CATALOG } from '@/lib/products-data'

type Product = (typeof CATALOG)[number]

const PAGE_SIZE = 48

const CATEGORIES_FILTER: readonly string[] = [
  'All',
  'Mobiles',
  'Laptops',
  'Fashion',
  'Home',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
]

function getPlatformBadgeClass(source: Product['platform']): string {
  if (platform === 'Amazon') {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (platform === 'Flipkart') {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

function getPlatformLabel(source: Product['platform']): string {
  return platform === 'Myntra' ? 'Myntra' : source
}

function getLowestPriceBadge(product: Product): { label: string; className: string } | null {
  if (product.originalPrice === null) {
    return null
  }
  if (product.price <= product.originalPrice * 0.75) {
    return { label: 'Lowest in 90 Days', className: 'cb-badge border-[#10B981] bg-[#10B981] text-white' }
  }
  if (product.price <= product.originalPrice * 0.85) {
    return { label: 'Near Lowest Price', className: 'cb-badge cb-badge-green' }
  }
  return null
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const originalPrice = product.originalPrice ?? Math.round(product.price * 1.2)
  const discount = product.discount ?? Math.max(1, Math.round(((originalPrice - product.price) / originalPrice) * 100))
  const lowestBadge = getLowestPriceBadge(product)

  return (
    <article id={`product-card-${index}`} className="cb-card group flex flex-col overflow-hidden">
      <div className="relative h-48">
        <Image
          fill
          className="object-cover"
          src={product.imageUrlUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
          alt={product.name}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount ? <span className="cb-badge cb-badge-green">-{discount}%</span> : null}
          {product.inStock ? <span className="cb-badge cb-badge-orange">Trending</span> : null}
        </div>
        {lowestBadge ? (
          <div className="absolute right-2 top-2">
            <span className={lowestBadge.className}>{lowestBadge.label}</span>
          </div>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={`/product/${product.id}`} className="cb-btn bg-white px-4 py-2 text-xs text-[#09090B]">
            Quick View
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className={`cb-badge w-fit text-[10px] ${getPlatformBadgeClass(product.platform)}`}>
          {getPlatformLabel(product.platform)}
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
}

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div
      key={`skeleton-${index}`}
      className="cb-card flex animate-pulse flex-col overflow-hidden"
      aria-hidden="true"
    >
      <div className="h-48 bg-white/5" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-4/5 rounded bg-white/10" />
        <div className="h-4 w-2/5 rounded bg-white/10" />
        <div className="mt-4 h-8 w-full rounded bg-white/10" />
      </div>
    </div>
  )
}

export default function ProductsPageClient() {
  const [count, setCount] = useState(PAGE_SIZE)
  const [isPaginating, setIsPaginating] = useState(false)
  const prevCountRef = useRef(PAGE_SIZE)

  const visibleCount = Math.min(count, CATALOG.length)
  const visibleProducts = useMemo(() => CATALOG.slice(0, visibleCount), [visibleCount])
  const hasMore = visibleCount < CATALOG.length

  useEffect(() => {
    if (visibleCount <= prevCountRef.current) {
      return
    }
    const firstNewCard = document.getElementById(`product-card-${prevCountRef.current}`)
    if (firstNewCard) {
      firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    prevCountRef.current = visibleCount
  }, [visibleCount])

  const onLoadMore = () => {
    if (!hasMore || isPaginating) {
      return
    }
    setIsPaginating(true)
    window.setTimeout(() => {
      setCount((prev) => Math.min(prev + PAGE_SIZE, CATALOG.length))
      setIsPaginating(false)
    }, 180)
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">All Products</h1>
            <p className="mt-2 text-[var(--cb-text-muted)]">2,000+ deals tracked across Amazon, Flipkart & Myntra</p>
          </div>
          <div className="flex gap-3">
            <Link href="/deals/flash" className="cb-btn cb-btn-primary gap-2">
              <Zap size={16} /> Flash Deals
            </Link>
            <button type="button" className="cb-btn cb-btn-ghost gap-2">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES_FILTER.map((category, index) => (
            <span
              key={category}
              className={`cb-badge cursor-pointer px-4 py-2 text-sm ${index === 0 ? 'cb-badge-blue' : 'hover:cb-badge-blue'}`}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="ad-slot-leaderboard">Advertisement · Google AdSense · 728×90</div>
      </section>

      <section className="mx-auto flex max-w-7xl gap-6 px-6 pb-16">
        <aside className="hidden w-56 flex-shrink-0 md:block">
          <div className="cb-card p-5">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#039BE5]" />
              <p className="text-sm font-black">Filters</p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Price Range</p>
              <div className="grid grid-cols-2 gap-2">
                <input className="cb-input py-2 text-xs" placeholder="Min ₹" />
                <input className="cb-input py-2 text-xs" placeholder="Max ₹" />
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Sort By</p>
              <select className="cb-input w-full py-2 text-xs">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Top Rated</option>
              </select>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Brands</p>
              {['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'HP', 'Dell', 'Sony', 'Nike'].map((brand) => (
                <label key={brand} className="flex items-center gap-2 py-1">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-[var(--cb-text-secondary)]">{brand}</span>
                </label>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Rating</p>
              {['4★+', '3★+', 'Any'].map((rating) => (
                <span key={rating} className="cb-badge mb-1 block w-fit cursor-pointer">
                  {rating}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Platform</p>
              {['Amazon', 'Flipkart', 'Myntra'].map((platform) => (
                <label key={platform} className="flex items-center gap-2 py-1">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-[var(--cb-text-secondary)]">{platform}</span>
                </label>
              ))}
            </div>

            <button type="button" className="cb-btn cb-btn-primary mt-6 w-full">
              Apply Filters
            </button>
            <button type="button" className="cb-btn cb-btn-ghost mt-2 w-full">
              Reset
            </button>
          </div>

          <div className="ad-slot-rectangle mt-4">Advertisement · 300×250</div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--cb-text-muted)]">
              Showing {visibleCount.toLocaleString('en-IN')} of {CATALOG.length.toLocaleString('en-IN')} products
            </p>
            <div className="flex items-center gap-2">
              <select className="cb-input w-auto py-1.5 text-xs">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
              <button type="button" className="cb-btn cb-btn-ghost p-2" aria-label="Grid view">
                <Grid3X3 size={15} />
              </button>
              <button type="button" className="cb-btn cb-btn-ghost p-2" aria-label="List view">
                <List size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            {isPaginating ? Array.from({ length: PAGE_SIZE }, (_, index) => <ProductSkeleton key={index} index={index} />) : null}
          </div>

          {hasMore ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button type="button" className="cb-btn cb-btn-primary min-w-36" onClick={onLoadMore} disabled={isPaginating}>
                {isPaginating ? 'Loading...' : 'Load More'}
              </button>
              <p className="text-xs text-[var(--cb-text-muted)]">
                Showing {visibleCount.toLocaleString('en-IN')} of {CATALOG.length.toLocaleString('en-IN')} products
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto mb-8 flex max-w-7xl items-center justify-center gap-2 px-6 text-xs text-[var(--cb-text-muted)]">
        <TrendingDown size={12} /> NEXQON price intelligence updates every hour
      </div>
    </main>
  )
}

