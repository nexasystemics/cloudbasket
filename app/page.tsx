import type { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryGrid from '@/components/CategoryGrid'
import HeroSection from '@/components/HeroSection'
import TrustSection from '@/components/TrustSection'

export const metadata: Metadata = {
  title: 'CloudBasket — Everything in One Basket',
  description: "India's sovereign price aggregator. Compare deals from Amazon, Flipkart & 50+ stores.",
  openGraph: {
    title: 'CloudBasket — Everything in One Basket',
    description: "India's sovereign price aggregator.",
    images: [{ url: '/og/default.png' }],
  },
}

export default function HomePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex min-h-[90vh] items-center justify-center bg-[var(--cb-surface)]">
            <div className="shimmer-line h-8 w-48 rounded-pill" />
          </div>
        }
      >
        <HeroSection />
      </Suspense>
      <CategoryGrid />
      <TrustSection />
    </main>
  )
}