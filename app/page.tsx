import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import CategoryGrid from '@/components/CategoryGrid'
import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'
import { DEALS } from '@/lib/deals-data'
import { PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'CloudBasket — Everything in One Basket',
  description: "India's sovereign price aggregator. Compare deals from Amazon, Flipkart and 50+ stores.",
  openGraph: {
    title: 'CloudBasket — Everything in One Basket',
    description: "India's sovereign price aggregator.",
    images: [{ url: '/og/default.png' }],
  },
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
      <CategoryGrid />
      <FeaturedDeals />
      <TrustSection />
    </main>
  )
}
