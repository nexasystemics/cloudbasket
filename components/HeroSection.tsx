import { ArrowRight, Search, Shield, TrendingDown, Zap } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

type DemoColumn = {
  id: 'amazon' | 'flipkart' | 'cj'
  label: string
  price: string
  badge: string
  goId: string
  highlight: boolean
}

const DEMO_COLUMNS: readonly DemoColumn[] = [
  {
    id: 'amazon',
    label: 'Amazon',
    price: '₹32,999',
    badge: 'Free Delivery',
    goId: 'amazon-demo1',
    highlight: false,
  },
  {
    id: 'flipkart',
    label: 'Flipkart',
    price: '₹31,499',
    badge: '10% Bank Off',
    goId: 'flipkart-demo1',
    highlight: false,
  },
  {
    id: 'cj',
    label: 'CJ Global',
    price: '₹29,999',
    badge: 'Best Price',
    goId: 'cj-demo1',
    highlight: true,
  },
]

const logoBadgeByPlatform: Record<DemoColumn['id'], { label: string; className: string }> = {
  amazon: { label: 'a', className: 'bg-[#F97316] text-white' },
  flipkart: { label: 'F', className: 'bg-[#FACC15] text-[#0F172A]' },
  cj: { label: 'CJ', className: 'bg-[#10B981] text-white' },
}

export default function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden px-6 py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(3,155,229,0.08) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="pointer-events-none absolute -end-20 top-0 h-[300px] w-[300px] rounded-full bg-skyline-primary/30 blur-3xl opacity-20" />
      <div className="pointer-events-none absolute -start-12 bottom-8 h-[200px] w-[200px] rounded-full bg-[#F97316]/30 blur-3xl opacity-20" />
      <div className="pointer-events-none absolute end-1/3 top-1/2 h-[150px] w-[150px] rounded-full bg-[#8B5CF6]/30 blur-3xl opacity-20" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center">
        <div className="mb-8 inline-flex">
          <span className="cb-badge cb-badge-blue inline-flex items-center gap-1 px-3 py-1">
            <Zap size={12} />
            The World&apos;s Smartest Price Aggregator
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-5xl font-black tracking-tighter text-[var(--cb-text-primary)] sm:text-6xl lg:text-6xl">
            Everything
          </h1>
          <h1 className="font-display text-5xl font-black tracking-tighter text-[var(--cb-text-primary)] sm:text-6xl lg:text-6xl">
            in One
          </h1>
          <h1 className="font-display text-5xl font-black tracking-tighter text-skyline-primary sm:text-6xl lg:text-6xl">
            Basket.
          </h1>
        </div>

        <div className="mt-6 max-w-xl space-y-1 text-lg text-[var(--cb-text-secondary)]">
          <p>Compare prices across 50+ global stores.</p>
          <p>Zero checkout. Pure discovery. Maximum savings.</p>
        </div>

        <div className="mt-10 space-y-4">
          <div className="glass-panel flex h-12 items-center gap-3 rounded-[var(--cb-radius-card)] px-4 ring-1 ring-[var(--cb-border)]">
            <Search size={18} className="text-[var(--cb-text-muted)]" />
            <span className="font-mono-cb text-sm text-[var(--cb-text-primary)]">₹35,000 smartphone</span>
          </div>

          <div className="grid min-h-[218px] gap-4 md:grid-cols-3">
            {DEMO_COLUMNS.map((column) => {
              const isHighlighted = column.highlight
              const logoBadge = logoBadgeByPlatform[column.id]

              return (
                <div
                  key={column.id}
                  className={`cb-card p-4 ${
                    isHighlighted ? 'border-2 border-[#F97316] shadow-[0_0_24px_rgba(249,115,22,0.2)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[10px] font-black ${logoBadge.className}`}
                    >
                      {logoBadge.label}
                    </span>
                    <p className="font-mono-cb text-[11px] font-black uppercase tracking-[0.08em] text-[var(--cb-text-muted)]">
                      {column.label}
                    </p>
                  </div>

                  <p className="mt-2 truncate text-[13px] font-bold text-[var(--cb-text-primary)]">Galaxy S25 Ultra</p>
                  <p className={`mt-3 font-display text-2xl font-black ${isHighlighted ? 'text-[#F97316]' : 'text-[var(--cb-text-primary)]'}`}>
                    {column.price}
                  </p>
                  <span className={`cb-badge mt-2 ${isHighlighted ? 'cb-badge-orange' : 'cb-badge-blue'}`}>{column.badge}</span>
                  <Link href={`/go/${column.goId}`} className={`mt-4 w-full px-3 py-2 text-center text-[11px] ${isHighlighted ? 'cb-btn-orange' : 'cb-btn-ghost'}`}>
                    View Deal
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex min-h-[48px] flex-wrap items-center gap-3">
          <Link href={ROUTES.PRODUCTS} className="cb-btn-primary inline-flex items-center gap-2">
            Browse All Deals
            <ArrowRight size={14} />
          </Link>
          <Link href={ROUTES.COMPARE} className="cb-btn-ghost inline-flex items-center gap-2">
            Compare Products
          </Link>
        </div>

        <div className="mt-12 flex min-h-[24px] flex-wrap items-center gap-8">
          <div className="inline-flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-skyline-glow)]">
              <Shield size={13} className="text-skyline-primary" />
            </span>
            <span>DPDPA 2023 Compliant</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-skyline-glow)]">
              <TrendingDown size={13} className="text-skyline-primary" />
            </span>
            <Link href="/compare" className="underline-offset-2 hover:underline">
              50+ Stores Compared
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-skyline-glow)]">
              <Zap size={13} className="text-skyline-primary" />
            </span>
            <span>Real-time Prices</span>
          </div>
        </div>
      </div>
    </section>
  )
}
