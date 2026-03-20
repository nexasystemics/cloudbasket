import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ExternalLink, Info, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — CloudBasket',
  description: 'Full transparency about how CloudBasket earns affiliate revenue. FTC and ASCI compliant.',
}

const PARTNER_NETWORKS = [
  { name: 'Amazon Associates India', operator: 'Amazon India Pvt Ltd', type: 'Percentage of sale', range: '0.2% – 9%', badgeClass: 'cb-badge cb-badge-orange' },
  { name: 'Flipkart Affiliate Program', operator: 'Flipkart Internet Pvt Ltd', type: 'Percentage of sale', range: '1% – 8%', badgeClass: 'cb-badge cb-badge-blue' },
  { name: 'Commission Junction (CJ) Network', operator: 'Conversant LLC', type: 'Variable per merchant', range: '1% – 15%', badgeClass: 'cb-badge cb-badge-green' },
  { name: 'Google AdSense', operator: 'Google Ireland Ltd', type: 'Display advertising CPM/CPC', range: 'Variable', badgeClass: 'cb-badge' },
] as const

export default function AffiliateDisclosurePage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Shield size={40} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black tracking-tighter">Affiliate Disclosure</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">Full transparency about how CloudBasket earns revenue</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="cb-badge cb-badge-green"><CheckCircle size={13} /> FTC Compliant</span>
            <span className="cb-badge cb-badge-blue"><CheckCircle size={13} /> ASCI Compliant</span>
            <span className="cb-badge cb-badge-orange"><CheckCircle size={13} /> DPDPA 2023 Compliant</span>
          </div>
          <p className="mt-4 text-sm text-[var(--cb-text-muted)]">Last Updated: March 2026</p>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">

        {/* Main disclosure statement */}
        <div className="cb-card p-6 border-l-4 border-skyline-primary">
          <p className="text-base leading-relaxed">
            CloudBasket participates in affiliate advertising programs. <strong>We earn a small commission when you click a link and make a purchase on a partner platform — at no additional cost to you.</strong>
          </p>
        </div>

        {/* What is affiliate marketing */}
        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Info size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">What is Affiliate Marketing?</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            Affiliate marketing is a standard online business model where publishers earn a small referral commission after driving qualified purchase traffic to partner retailers. When you click a deal link on CloudBasket and make a purchase, we may earn a small commission from the retailer at no extra cost to you.
          </p>
        </article>

        {/* Partner Networks */}
        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <ExternalLink size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black mb-4">Our Affiliate Programs</h2>
          <div className="space-y-3">
            {PARTNER_NETWORKS.map((partner) => (
              <div key={partner.name} className="flex flex-wrap items-start justify-between gap-3 py-3 border-b border-[var(--cb-border)] last:border-0">
                <div>
                  <p className="text-sm font-black">{partner.name}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">Operated by {partner.operator}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">{partner.type}</p>
                </div>
                <span className={partner.badgeClass}>{partner.range}</span>
              </div>
            ))}
          </div>
        </article>

        {/* Editorial Independence */}
        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Shield size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Editorial Independence</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            Our editorial content is not influenced by affiliate relationships. Products are recommended based on price, popularity, and relevance — not commission rates. We always show the lowest price regardless of which platform pays us more. We comply with FTC guidelines and ASCI (Advertising Standards Council of India) standards for transparent disclosure.
          </p>
        </article>

        {/* Price Transparency */}
        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <CheckCircle size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Price Transparency</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            We display original prices and deal prices for every product. Savings calculations are based on the retailer's listed MRP. We do not inflate original prices to make discounts appear larger.
          </p>
        </article>

        {/* Contact + CTA */}
        <article className="cb-card border-[#039BE5]/20 bg-[#039BE5]/5 p-6">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[#039BE5] mb-3">
            <AlertCircle size={14} /> For affiliate-related queries: <a href="mailto:affiliates@cloudbasket.in" className="underline">affiliates@cloudbasket.in</a>
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link href="/associates" className="cb-btn cb-btn-primary gap-2">
              <DollarSign size={16} /> Become Our Associate
            </Link>
            <Link href="/contact" className="cb-btn cb-btn-ghost">Contact Us</Link>
          </div>
        </article>

      </section>
    </main>
  )
}