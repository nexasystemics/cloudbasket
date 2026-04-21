'use client'
// components/CategoryPageClient.tsx
// Purpose: Client-side filtered product grid for category pages.
// A17: Brand pills, price range, platform checkboxes, sponsored-first, count indicator.

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Star, Zap, X, SlidersHorizontal } from 'lucide-react'
import type { CatalogProduct } from '@/lib/cloudbasket-data'
import { getProductImage } from '@/lib/utils/product-image'

type Props = {
  products: CatalogProduct[]
  categoryLabel: string
  categorySlug: string
}

function getSourceBadgeClass(platform: string): string {
  const n = platform.toLowerCase()
  if (n.includes('amazon')) return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20 dark:bg-[#FF9900]/20 dark:text-[#FF9900] dark:border-[#FF9900]/40'
  if (n.includes('flipkart')) return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20 dark:bg-[#2874F0]/20 dark:text-[#2874F0] dark:border-[#2874F0]/40'
  if (n.includes('myntra')) return 'bg-[#E73967]/10 text-[#E73967] border-[#E73967]/20 dark:bg-[#E73967]/20 dark:text-[#E73967] dark:border-[#E73967]/40'
  if (n.includes('croma')) return 'bg-[#000000]/10 text-[#000000] dark:bg-white/10 dark:text-white border-[#000000]/20'
  if (n.includes('bigbasket')) return 'bg-[#689F38]/10 text-[#689F38] border-[#689F38]/20 dark:bg-[#689F38]/20 dark:text-[#689F38] dark:border-[#689F38]/40'
  if (n.includes('reliance')) return 'bg-[#E42529]/10 text-[#E42529] border-[#E42529]/20 dark:bg-[#E42529]/20 dark:text-[#E42529] dark:border-[#E42529]/40'
  return 'cb-badge-green'
}

const REQUESTED_PLATFORMS = ['Amazon', 'Flipkart', 'Croma', 'Myntra', 'BigBasket', 'Reliance Digital']

export default function CategoryPageClient({ products, categoryLabel, categorySlug }: Props) {
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const availableBrands = useMemo(() =>
    [...new Set(products.map(p => p.brand))].sort(), [products])

  const availablePlatforms = useMemo(() =>
    [...new Set(products.map(p => p.platform))].sort(), [products])

  const maxProductPrice = useMemo(() =>
    products.reduce((m, p) => Math.max(m, p.price), 0), [products])

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0
    const max = maxPrice ? Number(maxPrice) : Infinity

    let result = products.filter(p => {
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false
      if (p.price < min || p.price > max) return false
      if (selectedPlatforms.size > 0 && !selectedPlatforms.has(p.platform)) return false
      return true
    })

    // Sponsored always first
    result = result.sort((a, b) => {
      if (a.badge === 'Sponsored' && b.badge !== 'Sponsored') return -1
      if (a.badge !== 'Sponsored' && b.badge === 'Sponsored') return 1
      return 0
    })

    return result
  }, [products, selectedBrands, minPrice, maxPrice, selectedPlatforms])

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      const next = new Set(prev)
      next.has(brand) ? next.delete(brand) : next.add(brand)
      return next
    })
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev)
      next.has(platform) ? next.delete(platform) : next.add(platform)
      return next
    })
  }

  const clearAll = () => {
    setSelectedBrands(new Set())
    setSelectedPlatforms(new Set())
    setMinPrice('')
    setMaxPrice('')
  }

  const hasActiveFilters = selectedBrands.size > 0 || selectedPlatforms.size > 0 || minPrice || maxPrice

  return (
    <section className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="cb-card p-5 sticky top-24">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#039BE5]" />
              <p className="text-sm font-black uppercase tracking-tight">Filters</p>
            </div>
            {hasActiveFilters && (
              <button onClick={clearAll} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 flex items-center gap-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                <X size={10} /> Clear
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--cb-text-muted)]">Price Range</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="cb-input py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                placeholder="Min ₹"
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <input
                className="cb-input py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                placeholder="Max ₹"
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
            {(minPrice || maxPrice) && (
              <p className="mt-2 text-[10px] font-black text-[#039BE5]">
                ₹{minPrice || '0'} – ₹{maxPrice || maxProductPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--cb-text-muted)]">Brand</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-zinc-200 text-skyline-primary focus:ring-skyline-primary"
                  />
                  <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div className="mb-6">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--cb-text-muted)]">Platform</p>
            <div className="space-y-2">
              {REQUESTED_PLATFORMS.filter(p => availablePlatforms.includes(p as any)).map(platform => (
                <label key={platform} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.has(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="rounded border-zinc-200 text-skyline-primary focus:ring-skyline-primary"
                  />
                  <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={clearAll} className="cb-btn cb-btn-ghost mt-2 w-full py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
              Reset All
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Count indicator + mobile filter toggle */}
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-bold text-[var(--cb-text-muted)]">
            Showing <span className="text-zinc-900 dark:text-white font-black">{filtered.length}</span> of <span className="font-black">{products.length}</span> products in {categoryLabel}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden cb-btn cb-btn-ghost flex items-center gap-2 py-2 px-4 text-xs font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >
            <SlidersHorizontal size={14} /> {showFilters ? 'Hide' : 'Filter'}
          </button>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="lg:hidden cb-card p-5 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Min Price ₹</p>
                <input className="cb-input py-2 text-xs w-full" type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Max Price ₹</p>
                <input className="cb-input py-2 text-xs w-full" type="number" placeholder="Any" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Brands</p>
              <div className="flex flex-wrap gap-2">
                {availableBrands.map(brand => (
                  <button key={brand} onClick={() => toggleBrand(brand)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${selectedBrands.has(brand) ? 'bg-[#039BE5] text-white border-[#039BE5] dark:bg-[#039BE5]/80 dark:border-[#039BE5]/60 dark:text-white' : 'border-zinc-200 text-zinc-500'}`}>
                    {brand}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {REQUESTED_PLATFORMS.filter(p => availablePlatforms.includes(p as any)).map(platform => (
                  <button key={platform} onClick={() => togglePlatform(platform)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${selectedPlatforms.has(platform) ? 'bg-orange-500 text-white border-orange-500' : 'border-zinc-200 text-zinc-500'}`}>
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters && <button onClick={clearAll} className="mt-4 text-xs font-black text-red-500 uppercase tracking-widest">Clear All</button>}
          </div>
        )}

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {[...selectedBrands].map(b => (
              <button key={b} onClick={() => toggleBrand(b)} className="flex items-center gap-1 px-3 py-1 bg-[#039BE5]/10 text-[#039BE5] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#039BE5]/20 hover:bg-[#039BE5]/20 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-skyline-primary">
                {b} <X size={10} />
              </button>
            ))}
            {[...selectedPlatforms].map(p => (
              <button key={p} onClick={() => togglePlatform(p)} className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200 hover:bg-orange-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500">
                {p} <X size={10} />
              </button>
            ))}
            {(minPrice || maxPrice) && (
              <button onClick={() => { setMinPrice(''); setMaxPrice('') }} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600">
                ₹{minPrice || '0'} – ₹{maxPrice || '∞'} <X size={10} />
              </button>
            )}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => {
              const effectiveDiscount = Math.round(((product.mrp - product.price) / product.mrp) * 100)
              const isSponsored = product.badge === 'Sponsored'
              return (
                <article key={product.id} className="cb-card group flex flex-col overflow-hidden relative">
                  {isSponsored && (
                    <span className="absolute top-2 right-2 z-10 text-[8px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-200">
                      Sponsored
                    </span>
                  )}
                  <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                    <Image
                      fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                      src={getProductImage(product.image, product.category)}
                      alt={product.title}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {effectiveDiscount > 5 && (
                        <span className="rounded-md bg-green-500 px-2 py-1 text-[10px] font-black text-white shadow-sm dark:bg-green-600">{effectiveDiscount}% OFF</span>
                      )}
                      {product.badge && product.badge !== 'Sponsored' && (
                        <span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-sm dark:bg-orange-600">
                          <Zap size={10} className="inline mr-1" />{product.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href={`/products/${product.id}`} className="rounded-full bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-950 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:bg-zinc-900 dark:text-white">
                        Quick View
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border w-fit ${getSourceBadgeClass(product.platform)}`}>{product.platform}</span>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.brand}</p>
                    <h3 className="line-clamp-2 text-xs font-black leading-snug text-zinc-900 dark:text-white min-h-[2.5rem]">
                      <Link href={`/products/${product.id}`} className="hover:text-skyline-primary transition-colors">{product.title}</Link>
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <Star size={10} className="fill-yellow-500 text-yellow-500" />
                      <span className="font-black ml-0.5">{product.rating.toFixed(1)}</span>
                      <span className="font-bold opacity-60">({product.reviewCount.toLocaleString()})</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-base font-black text-skyline-primary">₹{product.price.toLocaleString('en-IN')}</p>
                      {product.mrp > product.price && <p className="text-[10px] font-bold text-zinc-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</p>}
                    </div>
                    <div className="mt-auto pt-4">
                      <Link href={`/go/${product.id}`} target="_blank" rel="noopener noreferrer"
                        className="cb-btn cb-btn-primary w-full py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
                        Get Deal <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="cb-card p-20 text-center">
            <p className="text-xl font-black text-zinc-900 dark:text-white">No products match your filters</p>
            <p className="text-sm text-zinc-500 mt-2">Try adjusting your filters or clearing them.</p>
            <button onClick={clearAll} className="cb-btn cb-btn-primary mt-6 inline-flex px-8 py-3 text-[10px] font-black uppercase tracking-widest">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <aside className="hidden w-40 flex-shrink-0 xl:block">
        <div className="ad-slot-skyscraper sticky top-24">Ad Space · Contact us to advertise</div>
      </aside>
    </section>
  )
}
