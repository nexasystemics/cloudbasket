import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Zap, Globe, TrendingDown, Users, Award, Target, Heart } from 'lucide-react'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_TAGLINE } from '@/lib/constants'

const ABOUT_TITLE = `About ${SITE_NAME}`
const ABOUT_DESCRIPTION = SITE_DESCRIPTION

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `About ${SITE_NAME}`,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
}

const STATS: ReadonlyArray<{ value: string; label: string }> = [
  { value: '1,200+', label: 'Products Tracked' },
  { value: '50+',    label: 'Stores Compared' },
  { value: '5',      label: 'Revenue Streams' },
  { value: '₹0',     label: 'Checkout Fee' },
]

const REVENUE_STREAMS = [
  {
    title: 'Affiliate Commissions',
    desc: 'Earn when users click deals on Amazon, Flipkart & CJ Global',
    color: '#039BE5',
    icon: TrendingDown,
  },
  {
    title: 'Print on Demand',
    desc: 'Custom merchandise sold via /pod — zero inventory',
    color: '#E65100',
    icon: Award,
  },
  {
    title: 'Associates Program',
    desc: 'Partners earn commissions by sharing CloudBasket links',
    color: '#1B5E20',
    icon: Users,
  },
  {
    title: 'Google AdSense',
    desc: 'Non-intrusive ads on high-traffic pages',
    color: '#8B5CF6',
    icon: Globe,
  },
  {
    title: 'CJ Network',
    desc: 'International product commissions via Commission Junction',
    color: '#F5C842',
    icon: Zap,
  },
] as const

export default function AboutPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#039BE5]/5 to-[#0277BD]/5 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="cb-badge cb-badge-blue mb-6">About {SITE_NAME}</span>
          <h1 className="text-5xl font-black leading-tight tracking-tighter">
            {SITE_TAGLINE}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[var(--cb-text-muted)]">
            {SITE_NAME} was built with one mission: help every shopper find the absolute best price without
            ever trusting a single retailer. We compare. You decide. You save.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/deals" className="cb-btn cb-btn-primary">
              Browse Deals
            </Link>
            <Link href="/associates" className="cb-btn cb-btn-ghost">
              Join Associates
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="cb-card p-8 text-center transition-colors hover:border-[#039BE5]/50">
              <p className="text-4xl font-black tracking-tighter text-[#039BE5]">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[var(--cb-text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl md:w-1/2">
            <Image
              fill
              className="object-cover"
              src="https://m.media-amazon.com/images/I/71ZWNVU4GSL._AC_UF1000,1000_QL80_.jpg"
              alt="NEXQON mission"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="md:w-1/2">
            <span className="cb-badge cb-badge-orange mb-4">Our Mission</span>
            <h2 className="text-3xl font-black tracking-tighter">Zero Checkout. Pure Discovery.</h2>
            <p className="mt-3 leading-relaxed text-[var(--cb-text-muted)]">
              We are not a store. We never hold inventory. We never process payments. {SITE_NAME} is pure
              intelligence, a global price aggregator that scans 50+ retailers every hour to surface the best deals
              worldwide. Every rupee saved is a win for our users.
            </p>
            <p className="mt-3 leading-relaxed text-[var(--cb-text-muted)]">
              Built by NEXQON HOLDINGS, {SITE_NAME} is engineered for global scale, designed to last 20 years.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#039BE5]">
              <Target size={16} aria-hidden="true" /> Global architecture. Measurable savings.
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="cb-card p-10">
          <h2 className="mb-10 text-center text-3xl font-black tracking-tighter">How {SITE_NAME} Makes Money</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {REVENUE_STREAMS.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="text-center">
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: item.color + '1A' }}
                  >
                    <Icon size={22} style={{ color: item.color }} aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-sm font-black">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <section className="mt-10 bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Shield size={32} className="mx-auto mb-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          <p className="text-lg font-black">Powered by NEXQON HOLDINGS</p>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            © 2026 {SITE_NAME} — NEXQON HOLDINGS
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            DPDPA 2023 · GDPR · FTC Compliant · Zero Checkout
          </p>
          <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#039BE5]">
            <Heart size={12} aria-hidden="true" /> Built for shoppers worldwide
          </p>
        </div>
      </section>
    </main>
  )
}
