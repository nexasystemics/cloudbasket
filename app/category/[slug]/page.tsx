// Estimated: ~380 lines
// Purpose: Category landing page with structured data (ItemList), dynamic metadata and product filtering.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, SlidersHorizontal, ChevronDown, Star, Zap, TrendingDown } from 'lucide-react'
import TrackBehavior from '@/components/TrackBehavior'
import {
  getCategoryDefinition,
  getCategoryProducts,
  type CatalogProduct,
  CATEGORY_ALIASES
} from '@/lib/cloudbasket-data'
import { getIndiaCatalogBySlug } from '@/lib/india-catalog/utils'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const resolvedSlug = (CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES] ?? slug)
  const category = getCategoryDefinition(resolvedSlug)

  if (!category) {
    return { title: 'Category Not Found' }
  }

  const title = `${category.label} - Best Prices in India | CloudBasket`
  const description = `${category.heroDescription} Compare prices on CloudBasket across Amazon, Flipkart, and more with verified deals. Shop smarter with CloudBasket.`
  const url = `https://cloudbasket.in/category/${slug}`
  const ogImage = `https://cloudbasket.in/api/og?title=${encodeURIComponent(category.label)}&type=category`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'CloudBasket',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: category.label,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

function getSourceBadgeClass(source: string): string {
  const normalized = source.toLowerCase()
  if (normalized.includes('amazon')) {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (normalized.includes('flipkart')) {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolvedSlug = (CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES] ?? slug)
  const category = getCategoryDefinition(resolvedSlug)

  if (!category) {
    notFound()
  }

  const baseProducts = getCategoryProducts(category.slug)
  const indiaProducts = getIndiaCatalogBySlug(category.slug)
  const existingIds = new Set(baseProducts.map(p => p.id))
  const products = [...baseProducts, ...indiaProducts.filter(p => !existingIds.has(p.id))]

  // Structured Data: ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${category.label} Products on CloudBasket`,
    'description': category.heroDescription,
    'url': `https://cloudbasket.in/category/${slug}`,
    'numberOfItems': products.length,
    'itemListElement': products.map((product, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': product.title,
        'image': product.image,
        'description': product.description,
        'brand': {
          '@type': 'Brand',
          'name': product.brand
        },
        'offers': {
          '@type': 'Offer',
          'price': product.price,
          'priceCurrency': 'INR',
          'availability': 'https://schema.org/InStock',
          'url': `https://cloudbasket.in/product/${product.id}`
        }
      }
    }))
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackBehavior category={category.slug} />
      <section className="relative h-64 overflow-hidden">
        <Image fill className="object-cover" src={category.image} alt={category.label} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-end px-8 pb-10">
          <div>
            <p className="mb-3 text-xs text-white/60">Home / Category / {category.label}</p>
            <h1 className="text-4xl font-black tracking-tighter text-white">{category.heroTitle}</h1>
            <p className="mt-1 text-sm text-white/70">{category.heroDescription}</p>
            <span className="cb-badge mt-3 border-white/30 bg-white/20 text-white">
              <TrendingDown size={12} />
              Verified deals updated hourly
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="ad-slot-leaderboard">Ad Space · Contact us to advertise</div>
      </section>

      <section className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="cb-card p-5 sticky top-24">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#039BE5]" />
              <p className="text-sm font-black uppercase tracking-tight">Filters</p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--cb-text-muted)]">Price Range</p>
              <div className="grid grid-cols-2 gap-2">
                <input className="cb-input py-2 text-xs" placeholder="Min ₹" />
                <input className="cb-input py-2 text-xs" placeholder="Max ₹" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.priceRanges.map((pill) => (
                  <button
                    key={pill}
                    className="cb-badge cb-badge-blue cursor-pointer transition-colors hover:bg-[#039BE5] hover:text-white border-transparent"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--cb-text-muted)]">Sort By</p>
              <div className="relative">
                <select className="cb-input w-full appearance-none py-2 pe-8 text-xs font-bold">
                  {category.sortOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--cb-text-muted)]">Top Brands</p>
              <div className="space-y-2">
                {category.brands.slice(0, 8).map((brand) => (
                  <label key={brand} className="flex items-center gap-2 py-0.5 cursor-pointer group">
                    <input type="checkbox" className="rounded border-zinc-200 text-skyline-primary focus:ring-skyline-primary" />
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="cb-btn cb-btn-primary mt-8 w-full py-3 text-[10px] font-black uppercase tracking-widest">Apply Filters</button>
            <button className="cb-btn cb-btn-ghost mt-2 w-full py-3 text-[10px] font-black uppercase tracking-widest">Reset All</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[var(--cb-text-muted)]">
              Showing {products.length} products in {category.label}
            </p>
            <div className="lg:hidden">
               <button className="cb-btn cb-btn-ghost flex items-center gap-2 py-2 px-4 text-xs font-bold">
                 <SlidersHorizontal size={14} /> Filter
               </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const effectiveDiscount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

                return (
                  <article key={product.id} className="cb-card group flex flex-col overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                      <Image
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        src={product.image}
                        alt={product.title}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />

                      <div className="absolute left-2 top-2 flex flex-col gap-1">
                        {effectiveDiscount > 5 ? (
                          <span className="rounded-md bg-green-500 px-2 py-1 text-[10px] font-black text-white shadow-sm">
                            {effectiveDiscount}% OFF
                          </span>
                        ) : null}
                        {product.badge && (
                          <span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-black text-white shadow-sm">
                            <Zap size={10} className="inline mr-1" /> {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link 
                          href={`/products/${product.id}`} 
                          className="rounded-full bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-950 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                        >
                          Quick View
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-1.5 p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border w-fit ${getSourceBadgeClass(product.platform)}`}>
                        {product.platform}
                      </span>

                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.brand}</p>

                      <h3 className="line-clamp-2 text-xs font-black leading-snug text-zinc-900 dark:text-white min-h-[2.5rem]">
                        <Link href={`/products/${product.id}`} className="hover:text-skyline-primary transition-colors">
                          {product.title}
                        </Link>
                      </h3>

                      <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <span className="flex items-center gap-0.5 text-yellow-500">
                          <Star size={10} fill="currentColor" />
                          <span className="font-black ml-0.5">{product.rating.toFixed(1)}</span>
                        </span>
                        <span className="font-bold opacity-60">({product.reviewCount.toLocaleString()})</span>
                      </div>

                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-base font-black text-skyline-primary">₹{product.price.toLocaleString('en-IN')}</p>
                        {product.mrp > product.price && (
                          <p className="text-[10px] font-bold text-zinc-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</p>
                        )}
                      </div>

                      <div className="mt-auto pt-4">
                        <Link 
                          href={`/go/${product.id}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cb-btn cb-btn-primary w-full py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
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
              <TrendingDown size={48} className="mx-auto text-zinc-200 mb-4" />
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">No active deals found</h2>
              <p className="text-sm text-zinc-500 mt-2">We couldn&apos;t find any active deals in this category right now. Check back soon!</p>
              <Link href="/products" className="cb-btn cb-btn-primary mt-8 inline-flex px-8 py-3 text-[10px] font-black uppercase tracking-widest">
                Browse all products
              </Link>
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-12 flex justify-center gap-2">
              <button className="cb-btn cb-btn-ghost px-4 py-2 text-[10px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed">Previous</button>
              <button className="cb-btn cb-btn-primary h-10 w-10 text-[10px] font-black">1</button>
              <button className="cb-btn cb-btn-ghost h-10 w-10 text-[10px] font-black">2</button>
              <button className="cb-btn cb-btn-ghost h-10 w-10 text-[10px] font-black">3</button>
              <button className="cb-btn cb-btn-ghost px-4 py-2 text-[10px] font-black uppercase tracking-widest">Next</button>
            </div>
          )}
        </div>

        <aside className="hidden w-40 flex-shrink-0 xl:block">
          <div className="ad-slot-skyscraper sticky top-24">Ad Space · Contact us to advertise</div>
        </aside>
      </section>
    </main>
  )
}
