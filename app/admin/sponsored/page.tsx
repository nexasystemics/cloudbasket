import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Sponsored — Admin | CloudBasket' }
export default function SponsoredPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Sponsored Campaigns</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{['Active Campaigns', 'Impressions', 'Clicks', 'Revenue This Month'].map(l => <div key={l} className="cb-card p-5 text-center"><p className="text-2xl font-black text-skyline-primary">--</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{l}</p></div>)}</div>
      <div className="cb-card p-8 text-center"><p className="text-[var(--cb-text-muted)]">Connect Supabase sponsored_campaigns table to manage campaigns.</p></div>
    </main>
  )
}