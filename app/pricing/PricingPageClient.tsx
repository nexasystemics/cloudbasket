'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { MEMBERSHIP_PLANS } from '@/lib/subscriptions/membership'
import { SITE_TAGLINE } from '@/lib/constants'

type BillingCycle = 'monthly' | 'yearly'

function getMonthlyPrice(price: number, cycle: BillingCycle): number {
  if (price === 0) return 0
  return cycle === 'yearly' ? Math.round(price * 0.8) : price
}

export default function PricingPageClient() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-black tracking-tighter text-center mb-2">Simple, Transparent Pricing</h1>
      <p className="text-[#F5C518] font-medium text-center mb-2">{SITE_TAGLINE}</p>
      <p className="text-[var(--cb-text-muted)] text-center mb-10">Start free. Upgrade when you need more.</p>

      {/* Billing toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--cb-border)] bg-[var(--cb-surface)] p-1">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            aria-pressed={billingCycle === 'monthly'}
            className={`rounded-lg px-5 py-2 text-sm font-black transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#039BE5] text-white'
                : 'text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            aria-pressed={billingCycle === 'yearly'}
            className={`rounded-lg px-5 py-2 text-sm font-black transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-[#039BE5] text-white'
                : 'text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]'
            }`}
          >
            Yearly
            <span className="ml-2 rounded-full bg-[#1B5E20] px-2 py-0.5 text-[10px] font-black text-white">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MEMBERSHIP_PLANS.map((plan) => {
          const monthlyPrice = getMonthlyPrice(plan.price, billingCycle)
          const isPopular = plan.id === 'pro'

          return (
            <div
              key={plan.id}
              className={`cb-card p-6 relative pt-8 ${
                isPopular ? 'border-skyline-primary ring-2 ring-skyline-primary' : ''
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#039BE5] text-white rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <h2 className="font-black text-xl mb-1">{plan.name}</h2>

              <div className="mb-2">
                <span className="text-3xl font-black">
                  {monthlyPrice === 0 ? 'Free' : `₹${monthlyPrice}`}
                </span>
                {monthlyPrice > 0 && (
                  <span className="text-[var(--cb-text-muted)]">/mo</span>
                )}
              </div>

              {billingCycle === 'yearly' && plan.price > 0 && (
                <p className="text-xs text-[#1B5E20] font-bold mb-3">
                  ₹{Math.round(plan.price * 12 * 0.8)} billed yearly · Save ₹{Math.round(plan.price * 12 * 0.2)}
                </p>
              )}

              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-green-500 flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?plan=${plan.id}`}
                className={`cb-btn w-full block text-center ${
                  isPopular ? 'cb-btn-primary' : 'cb-btn-ghost'
                }`}
                aria-label={
                  plan.price === 0
                    ? 'Get started with Free plan'
                    : plan.id === 'pro'
                    ? `Upgrade to Pro plan — ₹${monthlyPrice} per month`
                    : `Upgrade to Business plan — ₹${monthlyPrice} per month`
                }
              >
                {plan.price === 0 ? 'Get Started Free' : `Upgrade to ${plan.name}`}
              </Link>
            </div>
          )
        })}
      </div>
    </main>
  )
}
