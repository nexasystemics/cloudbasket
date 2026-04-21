// app/product/[id]/page.tsx
// Purpose: Product detail page — India Catalog + CloudBasket catalog unified.
// A13: India catalog fallback. A18: India SEO metadata. A19: generateStaticParams.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, ExternalLink, Star, Shield, Truck, RefreshCw, TrendingDown, ChevronRight,
} from 'lucide-react'
import { CATALOG, type Product as IntelligenceProduct } from '@/lib/intelligence/catalog'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'
import {
  CATALOG_PRODUCTS, getCategoryDefinition, getSavePercent, getProductById,
  type CatalogProduct as CloudbasketCatalogProduct,
} from '@/lib/cloudbasket-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { getIndiaCatalogBySlug, getRelated } from '@/lib/india-catalog/utils'
import type { IndiaProduct } from '@/lib/india-catalog/types'
import { priceTracker } from '@/services/price-engine/tracker'
import { PriceHistoryChart } from '@/components/products/PriceHistoryChart'
import ErrorBoundary from '@/components/ErrorBoundary'

import ProductDetailActions, { PriceAlertTriggerButton } from '@/components/ProductDetailActions'
import RecentlyViewed, { ProductViewTracker } from '@/components/RecentlyViewed'
import PriceComparisonTable from '@/components/PriceComparisonTable'
import TrackBehavior from '@/components/TrackBehavior'
import WhatsAppShare from '@/components/WhatsAppShare'
import WishlistButton from '@/components/WishlistButton'
import { TelegramCTA } from '@/components/TelegramCTA'
import { CODBadge } from '@/components/products/CODBadge'
import { EMIBadge } from '@/components/products/EMIBadge'
import { PincodeChecker } from '@/components/products/PincodeChecker'
import { ProductCard } from '@/components/products/ProductCard'
import { getProductImage } from '@/lib/utils/product-image'
import AffiliateDisclosureBanner from '@/components/AffiliateDisclosureBanner'

export const revalidate = 3600 // ISR: revalidate product pages at most once per hour

type DisplayProduct = {
  id: string
  name: string
  image: string
  brand: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  mainCategory: string
  affiliatePlatform: 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'
  badge?: string
  description: string
  isIndiaProduct?: boolean
  subBrand?: string
  variant?: string
  affiliateUrl?: string
}

type PriceEntry = {
  platform: 'Amazon' | 'Flipkart' | 'CJ Global'
  platformSlug: 'amazon' | 'flipkart' | 'cj'
  price: number
  delivery: string
  eta: string
  best: boolean
}


function getDealPath(platform: DisplayProduct['affiliatePlatform'], id: string) {
  return `/go/${platform}-${id}`
}

function getCloudbasketAffiliatePlatform(p: CloudbasketCatalogProduct): DisplayProduct['affiliatePlatform'] {
  if (p.platform === 'Flipkart') return 'flipkart'
  if (p.platform === 'CJ Global') return 'cj'
  if (p.platform === 'Print on Demand') return 'pod'
  return 'amazon'
}

function getCategoryDetails(product: DisplayProduct, cbProduct?: CloudbasketCatalogProduct) {
  if (cbProduct) {
    const def = getCategoryDefinition(cbProduct.category)
    return { label: def?.label ?? cbProduct.category, slug: cbProduct.category }
  }
  return { label: product.mainCategory, slug: product.mainCategory.toLowerCase().replace(/\s+/g, '-') }
}

// Union of the two catalog shapes fed into this function.
// CloudbasketCatalogProduct uses `title` + `mrp` + `platform`.
// IntelligenceProduct uses `name` + `originalPrice` + `affiliatePlatform`.
type CatalogInput = CloudbasketCatalogProduct | IntelligenceProduct

function isCloudbasketProduct(p: CatalogInput): p is CloudbasketCatalogProduct {
  return 'title' in p && 'mrp' in p
}

function toDisplayFromCatalog(p: CatalogInput): DisplayProduct {
  const isCB = isCloudbasketProduct(p)
  const name = isCB ? p.title : p.name
  const originalPrice = isCB ? p.mrp : p.originalPrice
  const reviewCount = isCB ? p.reviewCount : p.reviews
  const affiliatePlatform: DisplayProduct['affiliatePlatform'] = isCB
    ? p.platform === 'Flipkart'         ? 'flipkart'
    : p.platform === 'CJ Global'        ? 'cj'
    : p.platform === 'Print on Demand'  ? 'pod'
    : 'amazon'
    : p.affiliatePlatform
  const safeOriginal = originalPrice ?? p.price
  return {
    id: p.id,
    name,
    image: p.image || '',
    brand: p.brand || '',
    price: p.price,
    originalPrice: safeOriginal,
    discount: Math.max(1, Math.round(((safeOriginal - p.price) / safeOriginal) * 100)),
    rating: p.rating,
    reviewCount: Number(reviewCount ?? 0),
    mainCategory: String(p.category),
    affiliatePlatform,
    badge: p.badge,
    description: p.description || '',
  }
}

function toDisplayFromIndia(p: IndiaProduct): DisplayProduct {
  const originalPrice = p.originalPrice ?? Math.round(p.price * 1.2)
  const discount = p.discount ?? Math.max(0, Math.round(((originalPrice - p.price) / originalPrice) * 100))
  const affiliatePlatform: DisplayProduct['affiliatePlatform'] =
    p.affiliatePlatform === 'flipkart' || p.affiliatePlatform === 'myntra' || p.affiliatePlatform === 'ajio'
      ? 'flipkart' : 'amazon'
  return {
    id: p.id, name: p.name, image: p.image, brand: p.brand,
    price: p.price, originalPrice, discount,
    rating: p.rating ?? 4.0, reviewCount: p.reviewCount ?? 0,
    mainCategory: p.category, affiliatePlatform,
    badge: p.isSponsored ? 'Sponsored' : p.isTrending ? 'Trending' : undefined,
    description: p.description,
    isIndiaProduct: true, subBrand: p.subBrand, variant: p.variant, affiliateUrl: p.affiliateUrl,
  }
}

function findDisplayProductById(id: string): DisplayProduct | null {
  const cbProduct = getProductById(id)
  if (cbProduct) return toDisplayFromCatalog(cbProduct)

  const catalogProduct = CATALOG.find((item) => item.id === id)
  if (catalogProduct) return toDisplayFromCatalog(catalogProduct)

  const numericId = Number.parseInt(id, 10)
  const mockProduct = Number.isNaN(numericId) ? undefined : MOCK_PRODUCTS.find((item) => item.id === numericId)
  if (mockProduct) {
    return {
      id: String(mockProduct.id), name: mockProduct.name, image: mockProduct.image || '',
      brand: mockProduct.brand || '', price: mockProduct.price,
      originalPrice: mockProduct.originalPrice ?? Math.round(mockProduct.price * 1.15),
      discount: mockProduct.discount ?? 0, rating: mockProduct.rating,
      reviewCount: mockProduct.reviewCount || 0, mainCategory: mockProduct.mainCategory,
      affiliatePlatform: mockProduct.source === 'Flipkart' ? 'flipkart' : 'amazon', description: '',
    }
  }

  const indiaProduct = INDIA_CATALOG.find((p) => p.id === id)
  if (indiaProduct) return toDisplayFromIndia(indiaProduct)

  return null
}

// ── A19: generateStaticParams — pre-render all product pages ─────────────────
export async function generateStaticParams() {
  if (process.env.DEV_FAST_BUILD === "true") return []
  const catalogIds = CATALOG_PRODUCTS.map((p) => ({ id: p.id }))
  const indiaIds = INDIA_CATALOG.map((p) => ({ id: p.id }))
  return [...catalogIds, ...indiaIds]
}

// ── A18: generateMetadata — India-specific format ────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = findDisplayProductById(id)

  if (!product) {
    return { title: 'Product Not Found | CloudBasket', description: 'The requested product could not be found.' }
  }

  const isIndia = product.isIndiaProduct || id.startsWith('IN-')
  const variantSuffix = isIndia && product.variant ? ` ${product.variant}` : ''

  const title = isIndia
    ? `Buy ${product.name}${variantSuffix} at Best Price | CloudBasket`
    : `${product.name} - Best Price Comparison | CloudBasket`

  const description = isIndia
    ? `Compare prices for ${product.name} by ${product.brand} across Amazon, Flipkart, Croma and more. Find the lowest price and best deals in India.`
    : `Compare prices for ${product.name} on CloudBasket. Find the best ${product.mainCategory} deals from Amazon, Flipkart and more.`

  const url = `https://cloudbasket.co/product/${id}`
  const ogImage = `https://cloudbasket.co/api/og?title=${encodeURIComponent(product.name)}&type=product`

  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'CloudBasket', locale: 'en_IN', type: 'website', images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = findDisplayProductById(id)
  if (!product) notFound()

  // Fetch initial price history for the last 30 days
  const initialHistory = await priceTracker.getPriceHistory(id, 30)

  const cloudbasketProduct = CATALOG_PRODUCTS.find((item) => item.id === id)
  const categoryDetails = getCategoryDetails(product, cloudbasketProduct)
  const dealPath = product.affiliateUrl ? `/go/${id}` : getDealPath(product.affiliatePlatform, String(product.id))

  let relatedProducts: {
    id: string; name: string; image: string; brand: string; price: number
    originalPrice: number; discount: number; rating: number; reviewCount: number
    source: 'Amazon' | 'Flipkart' | 'CJ'; affiliatePlatform: 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'
  }[] = []

  if (product.isIndiaProduct) {
    relatedProducts = getRelated(id, 4).map((p) => {
      const origPrice = p.originalPrice ?? Math.round(p.price * 1.2)
      const isFlip = p.affiliatePlatform === 'flipkart' || p.affiliatePlatform === 'myntra' || p.affiliatePlatform === 'ajio'
      return {
        id: p.id, name: p.name, image: p.image, brand: p.brand, price: p.price, originalPrice: origPrice,
        discount: p.discount ?? Math.round(((origPrice - p.price) / origPrice) * 100),
        rating: Number(p.rating ?? 4.0), reviewCount: Number(p.reviewCount ?? 0),
        source: isFlip ? 'Flipkart' as const : 'Amazon' as const,
        affiliatePlatform: isFlip ? 'flipkart' as const : 'amazon' as const,
      }
    })
  } else {
    relatedProducts = CATALOG_PRODUCTS.filter(item => item.category === categoryDetails.slug && item.id !== id).slice(0, 4).map(item => ({
      id: item.id, name: item.title, image: item.image, brand: item.brand,
      price: item.price, originalPrice: item.mrp, discount: getSavePercent(item),
      rating: item.rating, reviewCount: item.reviewCount,
      source: item.platform === 'CJ Global' ? 'CJ' as const : item.platform === 'Flipkart' ? 'Flipkart' as const : 'Amazon' as const,
      affiliatePlatform: getCloudbasketAffiliatePlatform(item),
    }))
  }

  // Build price comparison from real tracker history — no fake multipliers.
  // Groups initialHistory by platform and takes the most recent price per platform.
  // Amazon is always included using the catalog price as the baseline.
  // Flipkart and CJ only appear if the tracker has recorded real prices for them.
  const TRACKED_SLUGS = new Set<string>(['amazon', 'flipkart', 'cj'])
  const PLATFORM_META: Record<string, { platform: PriceEntry['platform']; platformSlug: PriceEntry['platformSlug']; delivery: string; eta: string }> = {
    amazon:   { platform: 'Amazon',    platformSlug: 'amazon',   delivery: 'Free Delivery', eta: '2-4 days' },
    flipkart: { platform: 'Flipkart',  platformSlug: 'flipkart', delivery: '₹40 delivery',  eta: '3-5 days' },
    cj:       { platform: 'CJ Global', platformSlug: 'cj',       delivery: 'Free Delivery', eta: '5-7 days' },
  }

  const latestByPlatform = new Map<string, number>()
  for (const point of initialHistory) {
    const slug = point.platform.toLowerCase()
    if (TRACKED_SLUGS.has(slug) && !latestByPlatform.has(slug)) {
      latestByPlatform.set(slug, point.price)
    }
  }
  // Always anchor Amazon to the catalog price if tracker has no record yet
  if (!latestByPlatform.has('amazon')) latestByPlatform.set('amazon', product.price)

  const compEntries = Array.from(latestByPlatform.entries())
    .filter(([slug]) => slug in PLATFORM_META)
  const minTrackedPrice = compEntries.reduce((min, [, price]) => Math.min(min, price), Infinity)

  const priceComparison: readonly PriceEntry[] = compEntries.map(([slug, price]) => ({
    ...PLATFORM_META[slug],
    price,
    best: price === minTrackedPrice && compEntries.length > 1,
  }))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cloudbasket.co' },
      { '@type': 'ListItem', position: 2, name: categoryDetails.label, item: `https://cloudbasket.co/category/${categoryDetails.slug}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://cloudbasket.co/product/${product.id}` },
    ],
  }

  const productJsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name,
    description: product.description || `Compare prices for ${product.name} on CloudBasket.`,
    image: product.image,
    brand: { '@type': 'Brand', name: product.brand, ...(product.subBrand ? { alternateName: product.subBrand } : {}) },
    sku: product.id, mpn: product.id,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount, bestRating: '5', worstRating: '1' },
    offers: {
      '@type': 'AggregateOffer', priceCurrency: 'INR',
      lowPrice: priceComparison.reduce((m, p) => Math.min(m, p.price), Infinity),
      highPrice: priceComparison.reduce((m, p) => Math.max(m, p.price), 0),
      offerCount: priceComparison.length, availability: 'https://schema.org/InStock',
      offers: priceComparison.map(p => ({
        '@type': 'Offer', price: p.price, priceCurrency: 'INR',
        url: product.affiliateUrl ?? `https://cloudbasket.co/go/${p.platformSlug}-${product.id}`,
        seller: { '@type': 'Organization', name: p.platform },
      })),
    },
  }

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <AffiliateDisclosureBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ProductViewTracker id={String(product.id)} category={categoryDetails.slug} price={product.price} brand={product.brand} />
      <TrackBehavior category={categoryDetails.slug} productId={String(product.id)} />

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/" className="hover:text-skyline-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href={`/category/${categoryDetails.slug}`} className="hover:text-skyline-primary transition-colors">{categoryDetails.label}</Link>
          <ChevronRight size={10} />
          <span className="text-zinc-900 dark:text-white line-clamp-1">{product.name}</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-6 lg:grid-cols-2">
        <div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-2xl">
            <div className="relative aspect-square">
              <Image fill className="object-cover" src={getProductImage(product.image, product.mainCategory)} alt={product.name} sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
            <div className="flex gap-3 p-6 border-t border-zinc-50 dark:border-zinc-800">
              {[0, 1, 2].map((thumb) => (
                <div key={thumb} className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${thumb === 0 ? 'border-skyline-primary ring-4 ring-skyline-primary/10' : 'border-transparent hover:border-zinc-200'}`}>
                  <Image fill className="object-cover" src={getProductImage(product.image, product.mainCategory)} alt={`${product.name} preview ${thumb + 1}`} sizes="80px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-skyline-primary/10 text-skyline-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">{categoryDetails.label}</span>
            {product.badge && <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg shadow-lg">{product.badge}</span>}
            {product.isIndiaProduct && <span className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">India Catalog</span>}
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">{product.name}</h1>
          {product.variant && <p className="mt-1 text-xs font-bold text-zinc-400 uppercase tracking-widest">{product.variant}</p>}
          <p className="mt-3 text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs">
            {product.brand}
            {product.subBrand && product.subBrand !== product.brand && <span className="ml-2 text-zinc-300">· {product.subBrand}</span>}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{product.reviewCount.toLocaleString('en-IN')} Reviews</span>
          </div>

          <div className="mt-8">
            <ProductDetailActions productId={String(product.id)} productName={product.name} currentPrice={product.price} dealPath={dealPath} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <EMIBadge price={product.price} />
            <CODBadge platform={product.affiliatePlatform} />
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Available Platforms</h2>
            <div className="grid grid-cols-1 gap-3">
              {priceComparison.map((entry) => (
                <div key={entry.platform} className={`flex items-center justify-between p-5 bg-white dark:bg-zinc-900 rounded-2xl border ${entry.best ? 'border-skyline-primary ring-4 ring-skyline-primary/5' : 'border-zinc-100 dark:border-zinc-800'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${entry.platformSlug === 'amazon' ? 'bg-orange-500' : entry.platformSlug === 'flipkart' ? 'bg-blue-600' : 'bg-green-500'}`}>{entry.platform.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{entry.platform}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">{entry.eta} · {entry.delivery}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="text-xl font-black text-zinc-900 dark:text-white">₹{entry.price.toLocaleString('en-IN')}</p>
                      {entry.best && <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-0.5">Price Winner</p>}
                    </div>
                    <Link href={`/go/${entry.platformSlug}-${product.id}`} className="cb-btn-primary h-11 px-6 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      Visit <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex-1 min-w-[200px]"><PincodeChecker /></div>
            <div className="flex items-center gap-3">
              <WishlistButton productId={String(product.id)} productName={product.name} />
              <WhatsAppShare productName={product.name} price={product.price} />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{ icon: Shield, label: 'Secure Redirect' }, { icon: Truck, label: 'Official Store' }, { icon: RefreshCw, label: 'Live Pricing' }, { icon: TrendingDown, label: 'Best Tracked' }].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                <f.icon size={18} className="text-skyline-primary" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-500 dark:text-zinc-400">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PriceComparisonTable productId={String(product.id)} />

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Price History</h2>
            <PriceAlertTriggerButton productName={product.name} currentPrice={product.price} className="cb-btn-ghost flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
              <span>Set Price Alert</span>
            </PriceAlertTriggerButton>
          </div>
          <PriceHistoryChart productId={id} initialHistory={initialHistory} />
          <p className="mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Price verified on CloudBasket · Historical data for last 30 days</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Customer Reviews</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Verified reviews — coming soon</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-12 text-center">
          <Star size={40} className="mx-auto mb-4 text-zinc-200 dark:text-zinc-700" />
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">Reviews Coming Soon</h3>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            We are building our verified review system. Check back soon for genuine customer feedback on this product.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <ErrorBoundary><RecentlyViewed /></ErrorBoundary>
        {relatedProducts.length >= 2 && (
          <div className="border-t border-zinc-100 py-16 dark:border-zinc-800">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">You Might Also Like</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">Curated alternatives in {categoryDetails.label}</p>
              </div>
              <Link href={`/category/${categoryDetails.slug}`} className="cb-btn-ghost gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-[10px] font-black uppercase tracking-widest">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => <ProductCard key={item.id} product={{ ...item, rating: item.rating, reviews: item.reviewCount }} />)}
            </div>
          </div>
        )}
        <div className="mt-12"><TelegramCTA variant="inline" /></div>
      </section>
    </main>
  )
}
