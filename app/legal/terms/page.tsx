import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Scale, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: "Terms of Service — CloudBasket",
  description: "CloudBasket terms of service. Governed by Indian law.",
}
const LAST_UPDATED = 'March 1, 2026'
const EFFECTIVE_DATE = 'March 1, 2026'

export default function TermsPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <FileText size={40} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black">Terms of Service</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">
            Effective: {EFFECTIVE_DATE} · Last updated: {LAST_UPDATED}
          </p>
          <span className="cb-badge cb-badge-blue mt-4">
            <Scale size={13} /> Governed by Indian Law
          </span>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
        <article className="cb-card p-8">
          <h2 className="text-xl font-black">1. Acceptance of Terms</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            By using CloudBasket, you agree to these terms. CloudBasket is operated by NEXQON Holdings, Bengaluru,
            India.
          </p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">2. Service Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            CloudBasket is a price comparison platform. We do not sell products, process payments, or hold inventory.
            All purchases happen on third-party retailer sites.
          </p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">3. Affiliate Links & Income Shield</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            All deal links use our Income Shield (`/go/`) system. Clicking a deal link may earn CloudBasket an
            affiliate commission. This does not affect the price you pay.
          </p>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Full disclosure available at <Link href="/affiliate-disclosure" className="text-[#039BE5]">/affiliate-disclosure</Link>.
          </p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">4. User Accounts</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            You must be 18+ to create an account. You are responsible for account security. We reserve the right to
            suspend accounts for policy violations.
          </p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">5. Associates Program</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            Associates earn commissions per our published rate card. Commissions are paid monthly via bank transfer or
            UPI. Fraudulent referrals result in immediate termination.
          </p>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            See <Link href="/associates" className="text-[#039BE5]">/associates</Link> for full program terms.
          </p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">6. Print on Demand (POD)</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            POD products are fulfilled by our print partner. Custom products cannot be returned unless defective.
            Delivery timeline is 5-7 business days pan-India.
          </p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">7. Limitation of Liability</h2>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-[var(--cb-text-muted)]">
            <li>Price inaccuracies on partner sites</li>
            <li>Product quality issues (contact retailer directly)</li>
            <li>Delivery delays by third-party retailers</li>
          </ul>
          <p className="mt-3 text-sm text-[var(--cb-text-muted)]">Maximum liability is limited to ₹1,000.</p>
        </article>

        <article className="cb-card p-8">
          <h2 className="text-xl font-black">8. Governing Law & Contact</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            These terms are governed by the laws of India. Disputes are subject to jurisdiction of Bengaluru courts.
            Legal notices can be sent to legal@nexqon.in.
          </p>
          <div className="mt-4">
            <Link href="/contact" className="cb-btn cb-btn-primary">
              Contact Us
            </Link>
          </div>
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <AlertCircle size={12} /> NEXQON sovereign compliance coverage active
          </p>
        </article>
      </section>
    </main>
  )
}

