import { BookOpen, Globe, Scale, Shield, TrendingDown, Zap, type LucideIcon } from 'lucide-react'

type TrustItem = {
  icon: LucideIcon
  title: string
  desc: string
  gradient: string
}

const STATS = [
  { value: '2,000+', label: 'Products Listed' },
  { value: '50+', label: 'Stores Compared' },
  { value: '15%', label: 'Avg Savings' },
  { value: '₹0', label: 'Platform Cost' },
] as const

const TRUST_ITEMS: readonly TrustItem[] = [
  {
    icon: Scale,
    title: 'Best Value',
    desc: 'Scanning millions of global data points for the absolute lowest price.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: BookOpen,
    title: 'Expert Guides',
    desc: 'Unbiased reviews and detailed comparisons for smarter purchase decisions.',
    gradient: 'from-indigo-500 to-violet-400',
  },
  {
    icon: Shield,
    title: 'DPDPA Compliant',
    desc: 'Fully aligned with DPDPA 2023 and privacy-first handling standards.',
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    desc: 'INR, USD, EUR and GBP pricing with normalized local deal intelligence.',
    gradient: 'from-cyan-500 to-blue-400',
  },
  {
    icon: TrendingDown,
    title: 'Price Drop Alerts',
    desc: 'Track products and catch high-impact discounts with precision timing.',
    gradient: 'from-orange-500 to-amber-400',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Prices refreshed from verified sources for dependable comparisons.',
    gradient: 'from-purple-500 to-pink-400',
  },
]

export default function TrustSection() {
  return (
    <section className="border-y border-[var(--cb-border)] bg-[var(--cb-surface)] py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mx-auto mb-14 flex w-full max-w-3xl flex-wrap items-center justify-center gap-12 rounded-[var(--cb-radius-pill)] border border-[var(--cb-border)] bg-[var(--cb-surface-2)] px-8 py-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="font-display text-3xl font-black text-skyline-primary">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-widest text-[var(--cb-text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-10 text-center font-display text-3xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
          Why CloudBasket
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="cb-card relative p-8">
                <span className="pointer-events-none absolute end-3 top-3 text-6xl font-black text-skyline-primary/5">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient}`}>
                  <Icon size={26} className="text-white" />
                </div>

                <h3 className="mb-2 font-display text-xl font-black text-[var(--cb-text-primary)]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--cb-text-secondary)]">{item.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
