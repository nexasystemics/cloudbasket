import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Associates Program — Coming Soon · CloudBasket",
  description: "CloudBasket Associates Program is launching soon. Register your interest.",
}

export default function AssociatesPage() {
  return (
    <main className="bg-[var(--cb-bg)] min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center py-20">
        <div className="inline-flex items-center gap-2 cb-badge cb-badge-blue mb-6 px-4 py-1.5 text-sm font-semibold">
          🚧 Coming Soon
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-4">Associates Program</h1>
        <p className="text-muted text-lg mb-8">
          Earn commissions by sharing deals. We are finalising partner terms and the dashboard — launching soon.
        </p>
        <div className="cb-card p-6 text-left mb-8 space-y-3">
          <p className="font-bold text-sm uppercase tracking-wide text-muted">What to expect</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>✅ Up to 10% commission on POD products</li>
            <li>✅ 30-day cookie on most categories</li>
            <li>✅ Real-time earnings dashboard</li>
            <li>✅ Weekly payouts via UPI</li>
          </ul>
        </div>
        <Link href="/contact" className="cb-btn cb-btn-primary inline-flex items-center gap-2">
          Register Interest →
        </Link>
        <p className="text-xs text-muted mt-6">
          Already a partner? Email us at partners@cloudbasket.in
        </p>
      </div>
    </main>
  )
}
