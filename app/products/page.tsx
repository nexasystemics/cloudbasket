import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SlidersHorizontal, ExternalLink, Grid3X3, List, TrendingDown, Zap } from 'lucide-react'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: "All Products — 2,000+ Deals Tracked",
  description: "Browse 2,000+ products tracked across Amazon, Flipkart and CJ Global.",
}
type Product = (typeof MOCK_PRODUCTS)[number]

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

function getPlatformBadgeClass(source: Product['source']): string {
  if (source === 'Amazon') {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (source === 'Flipkart') {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

function getPlatformLabel(source: Product['source']): string {
  return source === 'CJ' ? 'CJ Global' : source
}

function ProductCard({ product }: { product: Product }) {
  const originalPrice = product.originalPrice ?? Math.round(product.price * 1.2)
  const discount = product.discount ?? Math.max(1, Math.round(((originalPrice - product.price) / originalPrice) * 100))

  return (
    <article key={product.id} className="cb-card group flex flex-col overflow-hidden">
      <div className="relative h-48">
        <Image
          fill
          className="object-cover"
          src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
          alt={product.name}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount ? <span className="cb-badge cb-badge-green">-{discount}%</span> : null}
          {product.isTrending ? <span className="cb-badge cb-badge-orange">Trending</span> : null}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={`/product/${product.id}`} className="cb-btn bg-white px-4 py-2 text-xs text-[#09090B]">
            Quick View
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className={`cb-badge w-fit text-[10px] ${getPlatformBadgeClass(product.source)}`}>
          {getPlatformLabel(product.source)}
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

export default function ProductsPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">All Products</h1>
            <p className="mt-2 text-[var(--cb-text-muted)]">
              2,000+ deals tracked across Amazon, Flipkart & CJ Global
            </p>
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
              {['Amazon', 'Flipkart', 'CJ Global'].map((platform) => (
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
            <p className="text-sm text-[var(--cb-text-muted)]">Showing {MOCK_PRODUCTS.length} products</p>
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
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-2">
            <button type="button" className="cb-btn cb-btn-ghost">
              Prev
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button key={page} type="button" className={`cb-btn ${page === 1 ? 'cb-btn-primary' : ''}`}>
                {page}
              </button>
            ))}
            <button type="button" className="cb-btn cb-btn-ghost">
              Next
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto mb-8 flex max-w-7xl items-center justify-center gap-2 px-6 text-xs text-[var(--cb-text-muted)]">
        <TrendingDown size={12} /> NEXQON price intelligence updates every hour
      </div>
    </main>
  )
}

