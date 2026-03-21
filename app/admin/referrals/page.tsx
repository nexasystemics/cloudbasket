import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Referrals — Admin | CloudBasket' }
export default function ReferralsPage() {
  return (<main className="mx-auto max-w-7xl px-6 py-10"><h1 className="text-3xl font-black tracking-tighter mb-8">Referral Program</h1><div className="grid grid-cols-3 gap-4 mb-6">{['Total Referrers','Qualified Referrals','Total Paid'].map(l=><div key={l} className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">--</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{l}</p></div>)}</div><div className="cb-card p-6 text-center"><p className="text-[var(--cb-text-muted)]">Connect Supabase referrals table to manage program.</p></div></main>)
}