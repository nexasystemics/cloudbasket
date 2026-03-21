import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'POD Analytics — Admin | CloudBasket' }
export default function PODAnalyticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">POD Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {['Total Orders','Revenue','Avg Order Value','Return Rate'].map((l,i)=>(
          <div key={l} className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">{['0','₹0','₹0','0%'][i]}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{l}</p></div>
        ))}
      </div>
      <div className="cb-card p-8 text-center"><p className="text-[var(--cb-text-muted)]">POD orders will appear here once Razorpay + Printify are configured and first orders come in.</p></div>
    </main>
  )
}