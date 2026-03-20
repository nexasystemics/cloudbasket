import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingDown, ExternalLink } from 'lucide-react'
import { getDailyDeals } from '@/lib/deals-engine'

export const metadata: Metadata = {
  title: 'Best Deals Today in India 2026 — Up to 80% Off | CloudBasket',
  description: 'Find the best deals today in India across Amazon, Flipkart, Croma and more. Updated hourly. Up to 80% off on electronics, fashion, home and more.',
  alternates: { canonical: 'https://cloudbasket.in/best-deals' },
  openGraph: {
    title: 'Best Deals Today in India 2026',
    description: 'Verified price drops on 1,000+ products. Updated hourly.',
    images: [{ url: '/brand/og-image.svg' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Deals Today in India',
  description: 'Top deals across Amazon, Flipkart and more — updated hourly.',
  url: 'https://cloudbasket.in/best-deals',
}

export default function BestDealsPage() {
  const deals = getDailyDeals(20)
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <main className="bg-[var(--cb-bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-[#0F2D4A] to-[#1F4E79] py-16 text-white text-center px-6">
        <h1 className="text-4xl font-black tracking-tighter md:text-5xl">Best Deals Today in India 2026</h1>
        <p className="mt-3 text-lg text-white/80">Up to 80% off across Amazon, Flipkart and 50+ stores</p>
        <p className="mt-2 text-xs text-white/50">Updated today at {now} — {deals.length} active deals</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="cb-card p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="cb-badge cb-badge-green text-[10px]">-{deal.discountPercent}%</span>
                <span className="cb-badge text-[10px]">{deal.platform}</span>
              </div>
              <p className="font-black text-sm line-clamp-2 mb-2">{deal.title}</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-black text-skyline-primary">₹{deal.dealPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs line-through text-[var(--cb-text-muted)]">₹{deal.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <Link href={`/product/${deal.id}`} className="cb-btn cb-btn-primary w-full text-xs gap-1">
                <ExternalLink size={12} /> View Deal
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-2xl font-black mb-4">Why prices differ across platforms</h2>
        <p className="text-[var(--cb-text-muted)] leading-relaxed mb-4">Different platforms set their own prices based on seller competition, platform promotions, and inventory levels. Amazon and Flipkart run independent pricing algorithms that can vary by hundreds of rupees for the same product on the same day.</p>
        <p className="text-[var(--cb-text-muted)] leading-relaxed">CloudBasket compares prices in real-time so you always see the current best price without having to visit multiple websites.</p>

        <div className="mt-8 space-y-4">
          {[
            { q: 'How often are deals updated?', a: 'Our price tracking system updates prices every hour from all major platforms.' },
            { q: 'Are all deals verified?', a: 'Yes. We cross-check prices across multiple sources before showing them on CloudBasket.' },
            { q: 'Can I get notified of price drops?', a: 'Yes. Set a price alert on any product and we\'ll email you when the price drops to your target.' },
          ].map((faq, i) => (
            <div key={i} className="cb-card p-4">
              <p className="font-black text-sm mb-1">{faq.q}</p>
              <p className="text-sm text-[var(--cb-text-muted)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}