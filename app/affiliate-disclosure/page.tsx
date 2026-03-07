import Link from 'next/link'
import { Shield, ExternalLink, Info, CheckCircle, AlertCircle } from 'lucide-react'

const PARTNER_NETWORKS: ReadonlyArray<{ name: string; range: string; badgeClass: string }> = [
  { name: 'Amazon Associates India', range: 'Commission range: 1% - 10%', badgeClass: 'cb-badge cb-badge-orange' },
  { name: 'Flipkart Affiliate', range: 'Commission range: 2% - 12%', badgeClass: 'cb-badge cb-badge-blue' },
  { name: 'CJ Affiliate (Commission Junction)', range: 'Commission range: 3% - 20%', badgeClass: 'cb-badge cb-badge-green' },
]

export default function AffiliateDisclosurePage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Shield size={40} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black tracking-tighter">Affiliate Disclosure</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">Full transparency about how CloudBasket earns revenue</p>
          <span className="cb-badge cb-badge-green mt-4">
            <CheckCircle size={13} /> FTC & DPDPA 2023 Compliant
          </span>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Info size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">What is Affiliate Marketing?</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            Affiliate marketing is a standard online business model where publishers earn a small referral commission
            after driving qualified purchase traffic to partner retailers.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            When you click a deal link on CloudBasket and make a purchase, we may earn a small commission from the
            retailer at no extra cost to you.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <ExternalLink size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Our Partner Networks</h2>
          <div className="mt-4">
            {PARTNER_NETWORKS.map((partner, index) => (
              <div
                key={partner.name}
                className={`flex items-center justify-between gap-3 py-3 ${
                  index !== PARTNER_NETWORKS.length - 1 ? 'border-b border-[var(--cb-border)]' : ''
                }`}
              >
                <p className="text-sm font-medium">{partner.name}</p>
                <span className={partner.badgeClass}>{partner.range}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Shield size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Our Editorial Independence</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            Affiliate relationships do not influence our price comparisons. We always show the lowest price regardless
            of commission rates. Our recommendation algorithm is based purely on price, availability, and user ratings.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <CheckCircle size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Price Transparency</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            We display original prices and deal prices for every product. Savings calculations are based on the
            retailer's listed MRP. We do not inflate original prices to make discounts appear larger.
          </p>
        </article>

        <article className="cb-card border-[#039BE5]/20 bg-[#039BE5]/5 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[#039BE5]">
            <AlertCircle size={14} /> Questions about our affiliate relationships?
          </p>
          <Link href="/contact" className="cb-btn cb-btn-primary mt-3">
            Contact Us
          </Link>
        </article>
      </section>
    </main>
  )
}
