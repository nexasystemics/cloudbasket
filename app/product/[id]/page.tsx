// app/page.tsx
// Purpose: CloudBasket homepage.
// A16: Added PopularIndianBrands + TrendingInIndia sections.

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Zap, Clock, TrendingDown } from 'lucide-react'
import CategoryGrid from '@/components/CategoryGrid'
import HeroSection from '@/components/HeroSection'
import DealsBar from '@/components/DealsBar'
import ErrorBoundary from '@/components/ErrorBoundary'
import TopDealsToday from '@/components/TopDealsToday'
import PriceAlertBanner from '@/components/PriceAlertBanner'
import HomeDeferredSections from '@/components/HomeDeferredSections'
import { TelegramCTA } from '@/components/TelegramCTA'
import PlatformTrustBar from '@/components/PlatformTrustBar'
import TrendingSearches from '@/components/TrendingSearches'
import { ProductCard } from '@/components/products/ProductCard'
import { DEALS } from '@/lib/deals-data'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'
import { PRODUCTS } from '@/lib/mock-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { getTrending } from '@/lib/india-catalog/utils'

export const metadata: Metadata = {
  title: 'CloudBasket - Everything in One Basket',
  description: "Discover and compare the best prices across Amazon, Flipkart and 50+ stores worldwide. Zero checkout. Pure discovery.",
  openGraph: {
    title: 'CloudBasket - Everything in One Basket',
    description: "Discover and compare the best prices worldwide. Zero checkout. Pure discovery.",
    url: 'https://cloudbasket.in',
    images: [{ url: '/og-image.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudBasket - Everything in One Basket',
    description: "Discover and compare the best prices worldwide. Zero checkout. Pure discovery.",
    images: ['/og-image.svg'],
  },
}

const WEBSITE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CloudBasket',
  url: 'https://cloudbasket.in',
  description: "The World's Smartest Price Aggregator",
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://cloudbasket.in/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const DEAL_OF_DAY = {
  id: 'dotd-1',
  name: 'Samsung Galaxy S25 Ultra 256GB',
  brand: 'Samsung',
  image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
  originalPrice: 134999,
  price: 89999,
  discount: 33,
  platform: 'Amazon',
  endsAt: '23:59',
  features: [
    '200MP ProVisual Camera System',
    'Snapdragon 8 Elite Processor',
    '5000mAh Battery · 45W Charging',
    '6.9" QHD+ Dynamic AMOLED Display',
    'Titanium Frame · S Pen Included',
  ],
}

const INDIA_BRANDS = [
  { name: 'HUL',      color: 'bg-blue-50 text-blue-700' },
  { name: 'Dabur',    color: 'bg-green-50 text-green-700' },
  { name: 'ITC',      color: 'bg-yellow-50 text-yellow-700' },
  { name: 'Godrej',   color: 'bg-indigo-50 text-indigo-700' },
  { name: 'Bajaj',    color: 'bg-red-50 text-red-700' },
  { name: 'Havells',  color: 'bg-orange-50 text-orange-700' },
  { name: 'Philips',  color: 'bg-sky-50 text-sky-700' },
  { name: 'Prestige', color: 'bg-purple-50 text-purple-700' },
  { name: 'boAt',     color: 'bg-zinc-900 text-white' },
  { name: 'Noise',    color: 'bg-emerald-50 text-emerald-700' },
]

function PopularIndianBrands() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
            Popular Indian Brands
          </h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Top brands available on CloudBasket
          </p>
        </div>
        <Link href="/products" className="text-xs font-bold text-skyline-primary hover:underline">
          Browse All
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {INDIA_BRANDS.map((brand) => (
          <Link
            key={brand.name}
            href={`/products?brand=${encodeURIComponent(brand.name)}`}
            className={`px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-widest border border-transparent transition-all hover:scale-105 hover:shadow-md ${brand.color}`}
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  )
}

function TrendingInIndia() {
  // Get trending products, fallback to highest discount if < 6
  let trendingProducts = getTrending(6)
  if (trendingProducts.length < 6) {
    const trendingIds = new Set(trendingProducts.map((p) => p.id))
    const extras = [...INDIA_CATALOG]
      .filter((p) => !trendingIds.has(p.id))
      .sort((a, b) => {
        const dA = a.discount ?? 0
        const dB = b.discount ?? 0
        return dB - dA
      })
      .slice(0, 6 - trendingProducts.length)
    trendingProducts = [...trendingProducts, ...extras]
  }

  if (trendingProducts.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
            Trending in India 🔥
          </h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Most-watched products right now
          </p>
        </div>
        <Link href="/products" className="text-xs font-bold text-skyline-primary hover:underline flex items-center gap-1">
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {trendingProducts.map((p) => {
          const originalPrice = p.originalPrice ?? Math.round(p.price * 1.2)
          const discount = p.discount ?? Math.round(((originalPrice - p.price) / originalPrice) * 100)
          const isFlip = p.affiliatePlatform === 'flipkart' || p.affiliatePlatform === 'myntra' || p.affiliatePlatform === 'ajio'
          return (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                image: p.image,
                brand: p.brand,
                price: p.price,
                originalPrice,
                discount,
                rating: p.rating ?? 4.0,
                reviewCount: p.reviewCount ?? 0,
                source: isFlip ? 'Flipkart' : 'Amazon',
                affiliatePlatform: isFlip ? 'flipkart' : 'amazon',
              }}
            />
          )
        })}
      </div>
    </section>
  )
}

function DealOfTheDay() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl bg-gradient-to-r from-[#039BE5]/5 via-transparent to-[#F97316]/5 px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]">
              <Zap size={20} className="text-white" />
            </div>
            <div className="min-h-[52px]">
              <h2 className="text-2xl font-black tracking-tighter">Deal of the Day</h2>
              <p className="text-muted text-xs">Refreshes midnight IST</p>
            </div>
          </div>
          <span className="cb-badge cb-badge-orange flex items-center gap-2">
            <Clock size={14} />
            Ends at {DEAL_OF_DAY.endsAt}
          </span>
        </div>

        <div className="cb-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 min-h-64 md:h-auto">
              <Image fill className="object-cover" src={DEAL_OF_DAY.image} alt={DEAL_OF_DAY.name} sizes="(max-width: 768px) 100vw, 50vw" />
              <span className="cb-badge absolute left-4 top-4 border-[#F97316] bg-[#F97316] text-lg font-black text-white">
                -{DEAL_OF_DAY.discount}% OFF
              </span>
            </div>
            <div className="flex min-h-[320px] flex-col justify-center p-8">
              <span className="cb-badge cb-badge-blue mb-3">{DEAL_OF_DAY.platform}</span>
              <p className="text-muted mb-1 text-xs font-black uppercase tracking-widest">{DEAL_OF_DAY.brand}</p>
              <h3 className="text-2xl font-black leading-tight tracking-tighter">{DEAL_OF_DAY.name}</h3>
              <div className="my-4 flex min-h-[120px] flex-col gap-2">
                {DEAL_OF_DAY.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-sm">
                    <span className="font-black text-[#10B981]">✓</span>
                    {feature}
                  </p>
                ))}
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="price-current text-3xl">Rs{DEAL_OF_DAY.price.toLocaleString('en-IN')}</p>
                <p className="price-original">Rs{DEAL_OF_DAY.originalPrice.toLocaleString('en-IN')}</p>
                <span className="cb-badge cb-badge-green">Save Rs{(DEAL_OF_DAY.originalPrice - DEAL_OF_DAY.price).toLocaleString('en-IN')}</span>
              </div>
              <Link href="/go/amazon-dotd-1" className="cb-btn cb-btn-primary mt-6 w-full gap-2 py-4 text-base">
                <Zap size={18} /> Grab This Deal
              </Link>
              <p className="text-muted mt-3 text-center text-xs">
                <TrendingDown size={12} className="inline" /> Price verified on CloudBasket
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FlashDealsPreview() {
  const flashDeals = DEALS.filter((deal) => deal.isFlash).slice(0, 4)
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-[var(--cb-text-primary)]">Today&apos;s Best Deals</h2>
          <p className="text-sm text-[var(--cb-text-muted)]">Limited-time flash picks with verified redirects.</p>
        </div>
        <Link href="/deals" className="cb-btn-ghost inline-flex items-center gap-2 px-3 py-2 text-xs">
          View All Deals <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {flashDeals.map((deal) => {
          const product = PRODUCTS.find((item) => item.id === deal.productId)
          const imageSrc = resolveImageSource(product?.image, IMAGE_ASSETS.brandMark)
          return (
            <article key={deal.id} className="cb-card overflow-hidden">
              <div className="relative h-48">
                <Image src={imageSrc} alt={deal.title} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div className="min-h-[146px] p-4">
                <span className="cb-badge cb-badge-orange">Flash</span>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-bold text-[var(--cb-text-primary)]">{deal.title}</h3>
                <p className="mt-2 font-display text-xl font-black text-[#F97316]">-{deal.discount}%</p>
                <a href={`/go/amazon-${deal.productId}`} target="_blank" rel="noopener noreferrer" className="cb-btn-orange mt-3 flex w-full items-center justify-center gap-2">
                  Grab Deal <ExternalLink size={14} />
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_STRUCTURED_DATA) }} />
      <HeroSection />
      <PlatformTrustBar />
      <TrendingSearches />
      <DealsBar />
      <TopDealsToday />
      <CategoryGrid />
      {/* A16: New India Catalog sections */}
      <PopularIndianBrands />
      <TrendingInIndia />
      <DealOfTheDay />
      <FlashDealsPreview />
      <section className="mx-auto max-w-7xl px-6 py-4">
        <TelegramCTA />
      </section>
      <ErrorBoundary>
        <PriceAlertBanner />
      </ErrorBoundary>
      <HomeDeferredSections />
    </main>
  )
}