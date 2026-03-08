import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Zap, Clock, TrendingDown } from 'lucide-react'
import CategoryGrid from '@/components/CategoryGrid'
import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import { DEALS } from '@/lib/deals-data'
import { PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'CloudBasket - Everything in One Basket',
  description: "India's sovereign price aggregator. Compare deals from Amazon, Flipkart and 50+ stores.",
  openGraph: {
    title: 'CloudBasket - Everything in One Basket',
    description: "India's sovereign price aggregator.",
    images: [{ url: '/og/default.png' }],
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

function DealOfTheDay() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl bg-gradient-to-r from-[#039BE5]/5 via-transparent to-[#F97316]/5 px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]">
              <Zap size={20} className="text-white" />
            </div>
            <div>
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
              <Image fill className="object-cover" src={DEAL_OF_DAY.image} alt={DEAL_OF_DAY.name} />
              <span className="cb-badge absolute left-4 top-4 border-[#F97316] bg-[#F97316] text-lg font-black text-white">
                -{DEAL_OF_DAY.discount}% OFF
              </span>
            </div>

            <div className="flex flex-col justify-center p-8">
              <span className="cb-badge cb-badge-blue mb-3">{DEAL_OF_DAY.platform}</span>
              <p className="text-muted mb-1 text-xs font-black uppercase tracking-widest">{DEAL_OF_DAY.brand}</p>
              <h3 className="text-2xl font-black leading-tight tracking-tighter">{DEAL_OF_DAY.name}</h3>

              <div className="my-4 flex flex-col gap-2">
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
                <span className="cb-badge cb-badge-green">
                  Save Rs{(DEAL_OF_DAY.originalPrice - DEAL_OF_DAY.price).toLocaleString('en-IN')}
                </span>
              </div>

              <Link href="/go/amazon-dotd-1" className="cb-btn cb-btn-primary mt-6 w-full gap-2 py-4 text-base">
                <Zap size={18} />
                Grab This Deal
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

function FeaturedDeals() {
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
          const imageSrc = product?.image ?? '/brand/logo-mark.svg'
          return (
            <article key={deal.id} className="cb-card overflow-hidden">
              <div className="relative h-48">
                <Image src={imageSrc} alt={deal.title} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div className="p-4">
                <span className="cb-badge cb-badge-orange">Flash</span>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-bold text-[var(--cb-text-primary)]">{deal.title}</h3>
                <p className="mt-2 font-display text-xl font-black text-[#F97316]">-{deal.discount}%</p>

                <a
                  href={`/go/amazon-${deal.productId}`}
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
    <main>
      <HeroSection />
      <DealOfTheDay />
      <CategoryGrid />
      <FeaturedDeals />
      <TrustSection />
    </main>
  )
}
