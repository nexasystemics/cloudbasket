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
import { DEALS } from '@/lib/deals-data'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'
import { PRODUCTS } from '@/lib/mock-data'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_TAGLINE } from '@/lib/constants'

import PersonalisedRecommendations from '@/components/PersonalisedRecommendations'

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const WEBSITE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const DEAL_OF_DAY = {
  id: 'dotd-1',
  name: 'Samsung Galaxy M15 5G',
  brand: 'Samsung',
  image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
  originalPrice: 15999,
  price: 12999,
  discount: 19,
  platform: 'Amazon',
  endsAt: '23:59',
  goUrl: '/go/amazon-B0DGXBSYHS',
  features: [
    '50MP AI Triple Camera System',
    'MediaTek Dimensity 6100+ · 5G Ready',
    '6000mAh Battery · 25W Fast Charge',
    '6.5" Super AMOLED 90Hz FHD+ Display',
    '4GB RAM · 128GB Storage · Android 14',
  ],
}

function DealOfTheDay() {
  return (
    <section className="bg-gradient-to-r from-sky-600/5 via-transparent to-orange-500/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
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
              <Image
                fill
                className="object-cover"
                src={DEAL_OF_DAY.image}
                alt={DEAL_OF_DAY.name}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="cb-badge absolute left-4 top-4 border-orange-500 bg-orange-500 text-lg font-black text-white">
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
                    <span className="font-black text-[#1B5E20]">✓</span>
                    {feature}
                  </p>
                ))}
              </div>

              <div className="mt-2 flex items-baseline gap-3">
                <p className="price-current text-3xl">₹{DEAL_OF_DAY.price.toLocaleString('en-IN')}</p>
                <p className="price-original">₹{DEAL_OF_DAY.originalPrice.toLocaleString('en-IN')}</p>
                <span className="cb-badge cb-badge-green">
                  Save ₹{(DEAL_OF_DAY.originalPrice - DEAL_OF_DAY.price).toLocaleString('en-IN')}
                </span>
              </div>

              <a
                href={DEAL_OF_DAY.goUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cb-btn cb-btn-primary mt-6 w-full gap-2 py-4 text-base"
              >
                <Zap size={18} />
                Grab This Deal
              </a>

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
          View All Deals
          <ArrowRight size={14} />
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
                <p className="mt-2 font-display text-xl font-black text-[#E65100]">-{deal.discount}%</p>

                <a
                  href={deal.goId ? `/go/${deal.goId}` : `/products`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cb-btn-orange mt-3 flex w-full items-center justify-center gap-2"
                >
                  Grab Deal
                  <ExternalLink size={14} />
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
    <main className="bg-[var(--cb-bg)] text-[var(--cb-text-primary)] dark:bg-zinc-950 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_STRUCTURED_DATA) }} />
      <HeroSection totalCount={PRODUCTS.length} />
      <PlatformTrustBar />
      <TrendingSearches />
      <DealsBar />
      <TopDealsToday />
      <PersonalisedRecommendations />
      <CategoryGrid />
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

