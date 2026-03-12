import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ExternalLink,
  Star,
  Shield,
  Truck,
  RefreshCw,
  TrendingDown,
  ChevronRight,
  BarChart2,
} from 'lucide-react'
import { CATALOG, type Product as CatalogProduct } from '@/lib/intelligence/catalog'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'
import SchemaMarkup from '@/components/SchemaMarkup'
import RecentlyViewed, { ProductViewTracker } from '@/components/RecentlyViewed'
import ProductActions from '@/components/ProductActions'
import SocialProofWidget from '@/components/SocialProof'
import TrackBehavior from '@/components/TrackBehavior'
import WhatsAppShare from '@/components/WhatsAppShare'
import WishlistButton from '@/components/WishlistButton'
import { TelegramCTA } from '@/components/TelegramCTA'
import { CODBadge } from '@/components/products/CODBadge'
import { DealShareCard } from '@/components/products/DealShareCard'
import { EMIBadge } from '@/components/products/EMIBadge'
import { PincodeChecker } from '@/components/products/PincodeChecker'

type MockProduct = (typeof MOCK_PRODUCTS)[number]

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
  {
    name: 'Rahul M.',
    city: 'Mumbai',
    rating: 5,
    date: 'Feb 28, 2026',
    title: 'Excellent value for money',
    body: 'Been using for 3 months. Battery life is outstanding. Camera quality surprised me at this price point. Highly recommend.',
    verified: true,
    helpful: 24,
  },
  {
    name: 'Priya S.',
    city: 'Bengaluru',
    rating: 4,
    date: 'Feb 20, 2026',
    title: 'Good phone, minor issues',
    body: 'Overall very happy with the purchase. Heating under heavy load is the only concern. Display and camera are top notch.',
    verified: true,
    helpful: 18,
  },
  {
    name: 'Arjun K.',
    city: 'Delhi',
    rating: 5,
    date: 'Feb 15, 2026',
    title: 'Best in segment',
    body: 'Compared 6 phones before buying this. Nothing comes close at this price. Fast charging works as advertised.',
    verified: false,
    helpful: 31,
  },
  {
    name: 'Sneha T.',
    city: 'Pune',
    rating: 3,
    date: 'Feb 10, 2026',
    title: 'Average camera in low light',
    body: 'Day time photos are great. Night mode is disappointing compared to what was advertised. Rest of the phone is solid.',
    verified: true,
    helpful: 12,
  },
  {
    name: 'Vikram R.',
    city: 'Chennai',
    rating: 5,
    date: 'Feb 5, 2026',
    title: 'CloudBasket saved me Rs3,200',
    body: 'Found this same phone for Rs3,200 more on another site. CloudBasket showed me the best price instantly. Love this platform.',
    verified: true,
    helpful: 45,
  },
]

const RATING_BREAKDOWN = [
  { stars: 5, width: '65%', count: '987' },
  { stars: 4, width: '20%', count: '304' },
  { stars: 3, width: '8%', count: '121' },
  { stars: 2, width: '4%', count: '61' },
  { stars: 1, width: '3%', count: '45' },
] as const

function getPlatformBadgeClass(platform: PriceEntry['platform']): string {
  if (platform === 'Amazon') {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (platform === 'Flipkart') {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

function getProductPath(id: string): string {
  return `/product/${id}`
}

function getDealPath(platform: DisplayProduct['affiliatePlatform'], id: string): string {
  return `/go/${platform}-${id}`
}

function toDisplayFromCatalog(product: CatalogProduct): DisplayProduct {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: Math.max(1, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)),
    rating: product.rating,
    reviewCount: product.reviews,
    mainCategory: product.category,
    affiliatePlatform: product.affiliatePlatform,
    badge: product.badge,
  }
}

function toDisplayFromMock(product: MockProduct): DisplayProduct {
  return {
    id: String(product.id),
    name: product.name,
    image: product.image,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice ?? Math.round(product.price * 1.15),
    discount: product.discount ?? 0,
    rating: product.rating,
    reviewCount: product.reviewCount,
    mainCategory: product.mainCategory,
    affiliatePlatform: product.source === 'Flipkart' ? 'flipkart' : 'amazon',
  }
}

function RelatedCard({ product }: { product: DisplayProduct }) {
  return (
    <article className="cb-card group flex flex-col overflow-hidden">
      <div className="relative h-40">
        <Image
          fill
          className="object-cover"
          src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
          alt={product.name}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-xs font-bold">{product.name}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="price-current">Rs{product.price.toLocaleString('en-IN')}</p>
          <p className="price-original text-xs">Rs{product.originalPrice.toLocaleString('en-IN')}</p>
        </div>
        <p className="price-savings text-xs">Save {product.discount}%</p>
        <Link href={getDealPath(product.affiliatePlatform, product.id)} className="cb-btn cb-btn-primary mt-auto w-full py-2 text-xs">
          View Deal <ExternalLink size={12} />
        </Link>
      </div>
    </article>
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const catalogProduct = id.startsWith('cb-') ? CATALOG.find((item) => item.id === id) : undefined

  const numericId = Number.parseInt(id, 10)
  const mockProduct = Number.isNaN(numericId) ? undefined : MOCK_PRODUCTS.find((item) => item.id === numericId)

  const product = catalogProduct ? toDisplayFromCatalog(catalogProduct) : mockProduct ? toDisplayFromMock(mockProduct) : null

  if (!product) {
    notFound()
  }

  const related = catalogProduct
    ? CATALOG.filter((item) => item.category === catalogProduct.category && item.id !== catalogProduct.id)
        .slice(0, 4)
        .map(toDisplayFromCatalog)
    : MOCK_PRODUCTS.filter((item) => item.mainCategory === product.mainCategory && String(item.id) !== product.id)
        .slice(0, 4)
        .map(toDisplayFromMock)

  const priceComparison: readonly PriceEntry[] = [
    {
      platform: 'Amazon',
      platformSlug: 'amazon',
      price: product.price,
      delivery: 'Free Delivery',
      eta: '2-4 days',
      best: false,
    },
    {
      platform: 'Flipkart',
      platformSlug: 'flipkart',
      price: Math.round(product.price * 1.03),
      delivery: 'Rs40 delivery',
      eta: '3-5 days',
      best: false,
    },
    {
      platform: 'CJ Global',
      platformSlug: 'cj',
      price: Math.round(product.price * 0.97),
      delivery: 'Free Delivery',
      eta: '5-7 days',
      best: true,
    },
  ]

  const historyBars: readonly number[] = [
    54, 60, 58, 62, 65, 63, 59, 66, 68, 71, 73, 69, 72, 70, 67, 64, 62, 58, 61, 63, 66, 68, 72, 75, 77, 80, 83,
    86, 89, 94,
  ]

  return (
    <main className="bg-[var(--cb-bg)]">
      <ProductViewTracker id={String(product.id)} />
      <TrackBehavior category={product.mainCategory.toLowerCase()} productId={String(product.id)} />
      <SchemaMarkup
        type="product"
        data={{
          name: product.name,
          brand: product.brand,
          price: product.price,
          rating: product.rating,
          reviews: product.reviewCount,
        }}
      />

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--cb-text-muted)]">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products">Products</Link>
          <ChevronRight size={12} />
          <Link href={`/category/${encodeURIComponent(product.mainCategory.toLowerCase())}`}>{product.mainCategory}</Link>
          <ChevronRight size={12} />
          <span className="line-clamp-1">{product.name}</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-6 lg:grid-cols-2">
        <div>
          <div className="cb-card overflow-hidden">
            <div className="relative h-96">
              <Image
                fill
                className="object-cover"
                src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
                alt={product.name}
              />
            </div>
            <div className="flex gap-2 p-4">
              {[0, 1, 2].map((thumb) => (
                <div
                  key={thumb}
                  className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-lg border-2 ${
                    thumb === 0 ? 'border-[#039BE5]' : 'border-transparent'
                  }`}
                >
                  <Image
                    fill
                    className="object-cover"
                    src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
                    alt={`${product.name} preview ${thumb + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="cb-badge cb-badge-blue mb-3">{product.mainCategory}</span>
          <h1 className="text-3xl font-black tracking-tighter">{product.name}</h1>
          <p className="mt-1 text-sm text-[var(--cb-text-muted)]">{product.brand}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-[#F5C842]">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} />
            </span>
            <span className="text-sm">{product.rating.toFixed(1)} out of 5</span>
            <span className="cb-badge">{product.reviewCount.toLocaleString('en-IN')} reviews</span>
          </div>

          <SocialProofWidget productId={String(product.id)} className="mt-4" />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <EMIBadge price={product.price} />
            <CODBadge platform={product.affiliatePlatform} />
          </div>

          <div className="mt-4">
            <PincodeChecker />
          </div>

          <div className="cb-card mt-6 p-6">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Price Comparison</p>

            {priceComparison.map((entry, index) => (
              <div
                key={entry.platform}
                className={`flex items-center justify-between py-3 ${
                  index !== priceComparison.length - 1 ? 'border-b border-[var(--cb-border)]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`cb-badge text-[10px] ${getPlatformBadgeClass(entry.platform)}`}>{entry.platform}</span>
                    <p className="text-sm font-bold">{entry.platform}</p>
                  </div>
                  <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
                    {entry.delivery} · {entry.eta}
                  </p>
                </div>

                <div className="text-right">
                  <p className="price-current text-lg">Rs{entry.price.toLocaleString('en-IN')}</p>
                  {entry.best ? <span className="cb-badge cb-badge-green mt-1">Best Price</span> : null}
                  <div>
                    <Link href={`/go/${entry.platformSlug}-${product.id}`} className="cb-btn cb-btn-primary mt-2 gap-1 text-xs">
                      Buy Now <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cb-card mt-6 p-6">
            <DealShareCard
              productName={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              productId={product.id}
              badge={product.badge}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--cb-text-muted)]">
            <span className="inline-flex items-center gap-2">
              <Shield size={13} /> Secure Redirect
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck size={13} /> Direct from Retailer
            </span>
            <span className="inline-flex items-center gap-2">
              <RefreshCw size={13} /> No Hidden Fees
            </span>
            <span className="inline-flex items-center gap-2">
              <TrendingDown size={13} /> Best Price Tracked
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <WishlistButton productId={String(product.id)} productName={product.name} />
            <WhatsAppShare productName={product.name} price={product.price} />
            <ProductActions productName={product.name} currentPrice={product.price} />
            <Link href="/compare" className="cb-btn cb-btn-ghost gap-2">
              <BarChart2 size={16} /> Compare
            </Link>
          </div>

          <div className="mt-3">
            <TelegramCTA variant="inline" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="cb-card p-8">
          <h2 className="mb-6 text-xl font-black tracking-tighter">Price History (30 days)</h2>
          <div className="flex h-32 items-end gap-1">
            {historyBars.map((height, index) => (
              <div
                key={`${height}-${index}`}
                className={`flex-1 rounded-t ${index === historyBars.length - 1 ? 'bg-[#039BE5]' : 'bg-[#039BE5]/60'}`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--cb-text-muted)]">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-8 text-sm">
            <p>Lowest: Rs{Math.round(product.price * 0.9).toLocaleString('en-IN')}</p>
            <p>Highest: Rs{Math.round(product.price * 1.15).toLocaleString('en-IN')}</p>
            <p>Current: Rs{product.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-2 text-2xl font-black tracking-tighter">Customer Reviews</h2>

        <div className="cb-card mb-6 p-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-6xl font-black text-[#F5C842]">4.4</p>
              <p className="text-xl text-[#F5C842]">★★★★½</p>
              <p className="text-muted text-xs">Based on 1,518 reviews</p>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {RATING_BREAKDOWN.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <p className="text-muted w-4 text-xs">{row.stars}</p>
                  <div className="h-2 flex-1 rounded-full bg-[var(--cb-surface-2)]">
                    <div className="h-2 rounded-full bg-[#F5C842]" style={{ width: row.width }} />
                  </div>
                  <p className="text-muted w-8 text-xs">{row.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {MOCK_REVIEWS.map((review) => (
            <div key={`${review.name}-${review.date}`} className="cb-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#039BE5]/10 text-sm font-black text-[#039BE5]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{review.name}</p>
                    <p className="text-muted text-xs">
                      {review.city} · {review.date}
                    </p>
                  </div>
                </div>
                {review.verified ? <span className="cb-badge cb-badge-green text-xs">✓ Verified</span> : null}
              </div>

              <p className="mt-3 text-sm text-[#F5C842]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <h3 className="mt-2 text-sm font-bold">{review.title}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{review.body}</p>

              <div className="text-muted mt-4 flex justify-between border-t border-[var(--cb-border)] pt-3 text-xs">
                <p>Helpful ({review.helpful})</p>
                <button type="button" className="cb-btn cb-btn-ghost py-1 text-xs">
                  Helpful
                </button>
              </div>
            </div>
          ))}
        </div>

        <RecentlyViewed />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-6 text-2xl font-black tracking-tighter">Related Products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  )
}

