import Link from 'next/link'
import { DollarSign } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <DollarSign size={40} className="text-skyline-primary" />
        <h1 className="mt-4 font-display text-3xl font-black text-[var(--cb-text-primary)]">
          Affiliate Disclosure
        </h1>

        <section className="mt-8 space-y-8">
          <article>
            <h2 className="text-lg font-bold text-[var(--cb-text-primary)]">FTC Compliance</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--cb-text-secondary)]">
              CloudBasket participates in affiliate programs with Amazon, Flipkart and CJ Affiliate. We
              earn commission when you click through and purchase.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-bold text-[var(--cb-text-primary)]">Price Transparency</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--cb-text-secondary)]">
              Affiliate relationships never affect the prices shown. We always show the actual retailer
              price as tracked at listing time.
            </p>
          </article>

          <article>
            <h2 className="text-lg font-bold text-[var(--cb-text-primary)]">Your Choice</h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--cb-text-secondary)]">
              You are never required to use our affiliate links. You may navigate directly to any
              retailer at any time.
            </p>
          </article>
        </section>

        <Link href={ROUTES.PRIVACY} className="mt-10 inline-flex text-skyline-primary hover:underline">
          Read our full Privacy Policy
        </Link>
      </div>
    </div>
  )
}
