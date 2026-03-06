import { BookOpen, Globe, Scale, Shield, TrendingDown, Zap } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Scale,
    title: 'Best Value',
    desc: 'Scanning millions of global data points for the absolute lowest price.',
  },
  {
    icon: BookOpen,
    title: 'Expert Guides',
    desc: 'Unbiased reviews and detailed comparisons for smart decisions.',
  },
  {
    icon: Shield,
    title: 'DPDPA Compliant',
    desc: 'Fully DPDP Act 2023 compliant. Your privacy is our priority.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    desc: 'INR, USD, EUR, GBP pricing. Shop from India or anywhere.',
  },
  {
    icon: TrendingDown,
    title: 'Price Drop Alerts',
    desc: 'Track any product. Get notified when the price drops.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Prices refreshed every hour from 50+ verified sources.',
  },
] as const

export default function TrustSection() {
  return (
    <section className="border-y border-[var(--cb-border)] bg-[var(--cb-surface)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-16 text-center font-display text-3xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
          Why CloudBasket
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-skyline-primary shadow-[0_0_24px_rgba(3,155,229,0.2)]">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="mb-3 font-display text-xl font-black text-[var(--cb-text-primary)]">{item.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--cb-text-secondary)]">{item.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}