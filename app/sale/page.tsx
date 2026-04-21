import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Tag } from 'lucide-react'
import { getDailyDeals } from '@/lib/deals-engine'

export const metadata: Metadata = {
  title: 'Current Sales and Offers in India — All Platforms | CloudBasket',
  description: 'All active sales and offers across Amazon, Flipkart, Croma and more. Find products with 30%+ discount — updated daily.',
  alternates: { canonical: 'https://cloudbasket.co/sale' },
}

export default function SalePage() {
  const allDeals = getDailyDeals(50).filter((d) => d.discountPercent >= 30)
  const platforms = ['Amazon', 'Flipkart', 'CJ Global'] as const

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16 text-center px-6">
        <h1 className="text-4xl font-black tracking-tighter">Current Sales & Offers in India</h1>
        <p className="mt-3 text-[var(--cb-text-muted)]">All products with 30%+ discount across all platforms — {allDeals.length} offers found</p>
      </section>

      {platforms.map((platform) => {
        const platformDeals = allDeals.filter((d) => d.platform === platform)
        if (platformDeals.length === 0) return null
        return (
          <section key={platform} className="mx-auto max-w-7xl px-6 py-10">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Tag size={20} className="text-skyline-primary" /> {platform} Offers ({platformDeals.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {platformDeals.slice(0, 12).map((deal) => (
                <Link key={deal.id} href={`/product/${deal.id}`} className="cb-card p-3 group hover:border-skyline-primary transition-colors">
                  <span className="cb-badge cb-badge-green text-[9px] mb-2">-{deal.discountPercent}%</span>
                  <p className="text-xs font-bold line-clamp-2 group-hover:text-skyline-primary">{deal.title}</p>
                  <p className="text-skyline-primary font-black text-sm mt-1">₹{deal.dealPrice.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
