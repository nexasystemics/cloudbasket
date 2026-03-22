import type { Metadata } from 'next'
import { MEMBERSHIP_PLANS } from '@/lib/subscriptions/membership'
import { Check } from 'lucide-react'
export const metadata: Metadata = { title: 'CloudBasket Pro — Pricing', description: 'Upgrade to CloudBasket Pro for unlimited alerts, ad-free experience and exclusive deals.' }
export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-black tracking-tighter text-center mb-4">Simple, Transparent Pricing</h1>
      <p className="text-[var(--cb-text-muted)] text-center mb-12">Start free. Upgrade when you need more.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERSHIP_PLANS.map(plan => (
          <div key={plan.id} className={`cb-card p-6 ${plan.id === 'pro' ? 'border-skyline-primary ring-2 ring-skyline-primary' : ''}`}>
            {plan.id === 'pro' && <p className="text-[10px] font-black uppercase tracking-widest text-skyline-primary text-center mb-3">Most Popular</p>}
            <h2 className="font-black text-xl mb-1">{plan.name}</h2>
            <div className="mb-4"><span className="text-3xl font-black">{plan.price === 0 ? 'Free' : `₹${plan.price}`}</span>{plan.price > 0 && <span className="text-[var(--cb-text-muted)]">/mo</span>}</div>
            <ul className="space-y-2 mb-6">{plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm"><Check size={14} className="text-green-500 flex-shrink-0" />{f}</li>)}</ul>
            <button className={`cb-btn w-full ${plan.id === 'pro' ? 'cb-btn-primary' : 'cb-btn-ghost'}`}>{plan.price === 0 ? 'Get Started Free' : `Upgrade to ${plan.name}`}</button>
          </div>
        ))}
      </div>
    </main>
  )
}