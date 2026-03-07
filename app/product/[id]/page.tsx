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
  Share2,
  Heart,
  BarChart2,
} from 'lucide-react'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'

type Product = (typeof MOCK_PRODUCTS)[number]

type PriceEntry = {
  platform: 'Amazon' | 'Flipkart' | 'CJ Global'
  platformSlug: 'amazon' | 'flipkart' | 'cj'
  price: number
  delivery: string
  eta: string
  best: boolean
}

function getPlatformBadgeClass(platform: PriceEntry['platform']): string {
  if (platform === 'Amazon') {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (platform === 'Flipkart') {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

function RelatedCard({ product }: { product: Product }) {
  const originalPrice = product.originalPrice ?? Math.round(product.price * 1.2)
  const discount = product.discount ?? Math.max(1, Math.round(((originalPrice - product.price) / originalPrice) * 100))

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numericId = Number.parseInt(id, 10)

  if (Number.isNaN(numericId)) {
    notFound()
  }

  const product = MOCK_PRODUCTS.find((item) => item.id === numericId)

  if (!product) {
    notFound()
  }

  const related = MOCK_PRODUCTS.filter(
    (item) => item.mainCategory === product.mainCategory && item.id !== product.id,
  ).slice(0, 4)

  const reviewCount = product.reviewCount

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
      delivery: '₹40 delivery',
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
            <span className="cb-badge">{reviewCount.toLocaleString('en-IN')} reviews</span>
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
                  <p className="price-current text-lg">₹{entry.price.toLocaleString('en-IN')}</p>
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
            <button type="button" className="cb-btn cb-btn-ghost gap-2">
              <Heart size={16} /> Wishlist
            </button>
            <button type="button" className="cb-btn cb-btn-ghost gap-2">
              <Share2 size={16} /> Share
            </button>
            <Link href="/compare" className="cb-btn cb-btn-ghost gap-2">
              <BarChart2 size={16} /> Compare
            </Link>
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
            <p>Lowest: ₹{Math.round(product.price * 0.9).toLocaleString('en-IN')}</p>
            <p>Highest: ₹{Math.round(product.price * 1.15).toLocaleString('en-IN')}</p>
            <p>Current: ₹{product.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
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
