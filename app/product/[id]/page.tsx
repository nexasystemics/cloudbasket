// Estimated: ~500 lines
// Purpose: Product detail page with structured data (Product, Breadcrumb), dynamic metadata and price comparison.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ExternalLink,
  Star,
  Shield,
  Truck,
  RefreshCw,
  TrendingDown,
  ChevronRight,
} from 'lucide-react'
import { CATALOG } from '@/lib/intelligence/catalog'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'
import {
  CATALOG_PRODUCTS,
  getCategoryDefinition,
  getSavePercent,
  getProductById,
  type CatalogProduct as CloudbasketCatalogProduct,
} from '@/lib/cloudbasket-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { getRelated } from '@/lib/india-catalog/utils'
import type { IndiaProduct } from '@/lib/india-catalog/types'
import SchemaMarkup from '@/components/SchemaMarkup'
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
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'
import AffiliateDisclosureBanner from '@/components/AffiliateDisclosureBanner'

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

type MockReview = {
  name: string
  city: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
  helpful: number
}

const MOCK_REVIEWS: MockReview[] = [
  { name: 'Rahul M.', city: 'Mumbai', rating: 5, date: 'Feb 28, 2026', title: 'Excellent value for money', body: 'Been using for 3 months. Battery life is outstanding. Camera quality surprised me at this price point. Highly recommend.', verified: true, helpful: 24 },
  { name: 'Priya S.', city: 'Bengaluru', rating: 4, date: 'Feb 20, 2026', title: 'Good phone, minor issues', body: 'Overall very happy with the purchase. Heating under heavy load is the only concern. Display and camera are top notch.', verified: true, helpful: 18 },
  { name: 'Arjun K.', city: 'Delhi', rating: 5, date: 'Feb 15, 2026', title: 'Best in segment', body: 'Compared 6 phones before buying this. Nothing comes close at this price. Fast charging works as advertised.', verified: false, helpful: 31 },
  { name: 'Sneha T.', city: 'Pune', rating: 3, date: 'Feb 10, 2026', title: 'Average camera in low light', body: 'Day time photos are great. Night mode is disappointing compared to what was advertised. Rest of the phone is solid.', verified: true, helpful: 12 },
  { name: 'Vikram R.', city: 'Chennai', rating: 5, date: 'Feb 5, 2026', title: 'CloudBasket saved me Rs3,200', body: 'Found this same phone for Rs3,200 more on another site. CloudBasket showed me the best price instantly. Love this platform.', verified: true, helpful: 45 },
]

const RATING_BREAKDOWN = [
  { stars: 5, width: '65%', count: '987' },
  { stars: 4, width: '20%', count: '304' },
  { stars: 3, width: '8%', count: '121' },
  { stars: 2, width: '4%', count: '61' },
  { stars: 1, width: '3%', count: '45' },
] as const

function getDealPath(platform: DisplayProduct['affiliatePlatform'], id: string): string {
  return `/go/${platform}-${id}`
}

function getCloudbasketAffiliatePlatform(product: CloudbasketCatalogProduct): DisplayProduct['affiliatePlatform'] {
  if (product.platform === 'Flipkart') return 'flipkart'
  if (product.platform === 'CJ Global') return 'cj'
  if (product.platform === 'Print on Demand') return 'pod'
  return 'amazon'
}

function getCategoryDetails(product: DisplayProduct, cloudbasketProduct?: CloudbasketCatalogProduct) {
  if (cloudbasketProduct) {
    const categoryDefinition = getCategoryDefinition(cloudbasketProduct.category)
    return { label: categoryDefinition?.label ?? cloudbasketProduct.category, slug: cloudbasketProduct.category }
  }
  return { label: product.mainCategory, slug: product.mainCategory.toLowerCase().replace(/\s+/g, '-') }
}

function toDisplayFromCatalog(product: any): DisplayProduct {
  return {
    id: product.id,
    name: product.name || product.title,
    image: product.image || '',
    brand: product.brand || '',
    price: product.price,
    originalPrice: product.originalPrice || product.mrp || product.price,
    discount: Math.max(1, Math.round((((product.originalPrice ?? product.mrp ?? product.price) - product.price) / (product.originalPrice ?? product.mrp ?? product.price)) * 100)),
    rating: product.rating,
    reviewCount: (product.reviews ?? product.reviewCount ?? 0) as number,
    mainCategory: (product.category ?? product.mainCategory ?? '') as string,
    affiliatePlatform: product.affiliatePlatform || (product.platform === 'Flipkart' ? 'flipkart' : 'amazon'),
    badge: product.badge,
    description: product.description || '',
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
    mainCategory: p.category,
    affiliatePlatform,
    badge: p.isSponsored ? 'Sponsored' : p.isTrending ? 'Trending' : undefined,
    description: p.description,
    isIndiaProduct: true, subBrand: p.subBrand, affiliateUrl: p.affiliateUrl,
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = findDisplayProductById(id)
  if (product === null) {
    return { title: 'Product Not Found | CloudBasket', description: 'The requested CloudBasket product could not be found.' }
  }
  const title = product.isIndiaProduct
    ? `${product.name} — Best Price in India | CloudBasket`
    : `${product.name} - Best Price Comparison | CloudBasket`
  const description = product.isIndiaProduct
    ? `Buy ${product.name} by ${product.brand} at the best price. Compare prices across Amazon, Flipkart, Croma and more.`
    : `Compare prices for ${product.name} on CloudBasket. Find the best ${product.mainCategory} deals from Amazon, Flipkart and more. Verified links.`
  const url = `https://cloudbasket.in/product/${id}`
  const ogImage = `https://cloudbasket.in/api/og?title=${encodeURIComponent(product.name)}&type=product`
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

  const cloudbasketProduct = CATALOG_PRODUCTS.find((item) => item.id === id)
  const categoryDetails = getCategoryDetails(product, cloudbasketProduct)
  const dealPath = product.affiliateUrl ? `/go/${id}` : getDealPath(product.affiliatePlatform, String(product.id))

  let relatedProducts: { id: string; name: string; image: string; brand: string; price: number; originalPrice: number; discount: number; rating: number; reviewCount: number; source: 'Amazon' | 'Flipkart' | 'CJ'; affiliatePlatform: 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm' }[] = []

  if (product.isIndiaProduct) {
    relatedProducts = getRelated(id, 4).map((p) => {
      const origPrice = p.originalPrice ?? Math.round(p.price * 1.2)
      const isFlip = p.affiliatePlatform === 'flipkart' || p.affiliatePlatform === 'myntra' || p.affiliatePlatform === 'ajio'
      return { id: p.id, name: p.name, image: p.image, brand: p.brand, price: p.price, originalPrice: origPrice, discount: p.discount ?? Math.round(((origPrice - p.price) / origPrice) * 100), rating: p.rating ?? 4.0, reviewCount: p.reviewCount ?? 0, source: isFlip ? 'Flipkart' as const : 'Amazon' as const, affiliatePlatform: isFlip ? 'flipkart' as const : 'amazon' as const }
    })
  } else {
    relatedProducts = CATALOG_PRODUCTS.filter((item) => item.category === categoryDetails.slug && item.id !== id).slice(0, 4).map((item) => ({ id: item.id, name: item.title, image: item.image, brand: item.brand, price: item.price, originalPrice: item.mrp, discount: getSavePercent(item), rating: item.rating, reviewCount: item.reviewCount, source: item.platform === 'CJ Global' ? 'CJ' as const : item.platform === 'Flipkart' ? 'Flipkart' as const : 'Amazon' as const, affiliatePlatform: getCloudbasketAffiliatePlatform(item) }))
  }

  const priceComparison: readonly PriceEntry[] = [
    { platform: 'Amazon', platformSlug: 'amazon', price: product.price, delivery: 'Free Delivery', eta: '2-4 days', best: false },
    { platform: 'Flipkart', platformSlug: 'flipkart', price: Math.round(product.price * 1.03), delivery: 'Rs40 delivery', eta: '3-5 days', best: false },
    { platform: 'CJ Global', platformSlug: 'cj', price: Math.round(product.price * 0.97), delivery: 'Free Delivery', eta: '5-7 days', best: true },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cloudbasket.in' },
      { '@type': 'ListItem', position: 2, name: categoryDetails.label, item: `https://cloudbasket.in/category/${categoryDetails.slug}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://cloudbasket.in/product/${product.id}` },
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
      lowPrice: Math.min(...priceComparison.map((p) => p.price)),
      highPrice: Math.max(...priceComparison.map((p) => p.price)),
      offerCount: priceComparison.length, availability: 'https://schema.org/InStock',
      offers: priceComparison.map((p) => ({ '@type': 'Offer', price: p.price, priceCurrency: 'INR', url: product.affiliateUrl ?? `https://cloudbasket.in/go/${p.platformSlug}-${product.id}`, seller: { '@type': 'Organization', name: p.platform } })),
    },
  }

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <AffiliateDisclosureBanner />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <ProductViewTracker id={String(product.id)} />
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
              <Image fill className="object-cover" src={resolveImageSource(product.image, IMAGE_ASSETS.noImage)} alt={product.name} sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
            <div className="flex gap-3 p-6 border-t border-zinc-50 dark:border-zinc-800">
              {[0, 1, 2].map((thumb) => (
                <div key={thumb} className={`relative h-20 w-20 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${thumb === 0 ? 'border-skyline-primary ring-4 ring-skyline-primary/10' : 'border-transparent hover:border-zinc-200'}`}>
                  <Image fill className="object-cover" src={resolveImageSource(product.image, IMAGE_ASSETS.noImage)} alt={`${product.name} preview ${thumb + 1}`} sizes="80px" />
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
          <p className="mt-3 text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs">
            {product.brand}
            {product.subBrand && product.subBrand !== product.brand && <span className="ml-2 text-zinc-300">· {product.subBrand}</span>}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{product.reviewCount.toLocaleString('en-IN')} Global Reviews</span>
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
            {[{ icon: Shield, label: 'Secure Redirect' }, { icon: Truck, label: 'Official Store' }, { icon: RefreshCw, label: 'Live Pricing' }, { icon: TrendingDown, label: 'Best Tracked' }].map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                <feature.icon size={18} className="text-skyline-primary" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-500 dark:text-zinc-400">{feature.label}</span>
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
          <div className="mt-6">
            <svg className="h-[120px] w-full" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 78 C60 24, 120 24, 180 64 S300 108, 360 62 S480 18, 600 44" fill="none" stroke="#039BE5" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Price tracking coming soon — set a price alert to be notified of drops.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Customer Intel</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Verified community feedback</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 sticky top-24">
              <div className="text-center mb-8">
                <p className="text-7xl font-black text-yellow-500">{product.rating.toFixed(1)}</p>
                <div className="flex justify-center gap-1 my-2">
                  {[1,2,3,4].map(s => <Star key={s} size={20} className="fill-yellow-500 text-yellow-500" />)}
                  <Star size={20} className="text-yellow-500" />
                </div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Based on {product.reviewCount.toLocaleString()} reports</p>
              </div>
              <div className="space-y-3">
                {RATING_BREAKDOWN.map((row) => (
                  <div key={row.stars} className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-zinc-400 w-4">{row.stars}</p>
                    <div className="h-2 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div className="h-full rounded-full bg-yellow-500 shadow-sm" style={{ width: row.width }} />
                    </div>
                    <p className="text-[10px] font-black text-zinc-400 w-10 text-right">{row.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {MOCK_REVIEWS.map((review) => (
              <div key={`${review.name}-${review.date}`} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-skyline-primary/10 text-lg font-black text-skyline-primary uppercase">{review.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{review.name}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{review.city} · {review.date}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                      <Shield size={10} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-200'} />
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-snug">{review.title}</h3>
                <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{review.body}</p>
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-800">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Community Trust: {review.helpful} Helpful Votes</p>
                  <button type="button" className="cb-btn-ghost px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Support Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <ErrorBoundary><RecentlyViewed /></ErrorBoundary>
        {relatedProducts.length >= 2 ? (
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
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={{ ...item, rating: item.rating, reviews: item.reviewCount }} />
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-12"><TelegramCTA variant="inline" /></div>
      </section>
    </main>
  )
}
