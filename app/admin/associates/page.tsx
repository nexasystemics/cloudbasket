// F11: Associate Panel — Complete Self-Service Dashboard
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Associates Panel — CloudBasket Admin' }
export default function AssociatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Associate Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[['Total Associates','0'],['Active This Month','0'],['Total Commission Paid','₹0'],['Pending Payouts','₹0']].map(([l,v]) => (
          <div key={l} className="cb-card p-5 text-center"><p className="text-2xl font-black text-skyline-primary">{v}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{l}</p></div>
        ))}
      </div>
      <div className="cb-card p-8 text-center">
        <p className="font-black mb-2">Connect Supabase Associates Table</p>
        <p className="text-sm text-[var(--cb-text-muted)]">Run migration: supabase/migrations/ to create associates table, then associates will appear here.</p>
      </div>
    </main>
  )
}