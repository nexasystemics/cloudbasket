// F56: Revenue Forecasting + BI Dashboard
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Revenue Dashboard — CloudBasket Admin' }
const REVENUE_STREAMS = [
  { name: 'Amazon Affiliate', description: 'Commission from Amazon product clicks', rate: '2-10%', status: 'Active', potential: '₹50,000/mo' },
  { name: 'Flipkart Affiliate', description: 'Commission from Flipkart referrals', rate: '1-8%', status: 'Setup Required', potential: '₹30,000/mo' },
  { name: 'CJ Affiliate', description: 'International brand commissions', rate: '5-15%', status: 'Active', potential: '₹20,000/mo' },
  { name: 'POD Products', description: 'CloudBasket Originals T-shirts, mugs, etc.', rate: '40-60% margin', status: 'Active', potential: '₹1,00,000/mo' },
  { name: 'Google AdSense', description: 'Display ads revenue', rate: 'CPM-based', status: 'Setup Required', potential: '₹15,000/mo' },
  { name: 'Sponsored Listings', description: 'Brands pay for featured placement', rate: '₹5,000-50,000/listing', status: 'Not Started', potential: '₹75,000/mo' },
  { name: 'Associates Program', description: 'Human affiliates promoting CloudBasket', rate: '5% of sales', status: 'Active', potential: '₹25,000/mo' },
  { name: 'B2B Bulk POD', description: 'Corporate POD orders', rate: '30-45% margin', status: 'Active', potential: '₹2,00,000/mo' },
]
export default function RevenuePage() {
  const totalPotential = '₹5,15,000/mo'
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Revenue Dashboard</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">All revenue streams at full activation. Current: build phase — activate APIs for live revenue.</p>
      <div className="cb-card p-6 mb-8 bg-skyline-primary/5 border-skyline-primary/20">
        <p className="text-sm text-[var(--cb-text-muted)]">Total Revenue Potential at Full Activation</p>
        <p className="text-4xl font-black text-skyline-primary">{totalPotential}</p>
      </div>
      <div className="space-y-3">
        {REVENUE_STREAMS.map(s => (
          <div key={s.name} className="cb-card p-5 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black">{s.name}</p>
                <span className={`cb-badge text-[9px] ${s.status === 'Active' ? 'bg-green-500/10 text-green-500' : s.status === 'Setup Required' ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{s.status}</span>
              </div>
              <p className="text-sm text-[var(--cb-text-muted)]">{s.description}</p>
              <p className="text-xs mt-1">Rate: <span className="font-bold">{s.rate}</span></p>
            </div>
            <div className="text-right"><p className="font-black text-green-500 text-sm">{s.potential}</p><p className="text-[10px] text-[var(--cb-text-muted)]">potential</p></div>
          </div>
        ))}
      </div>
    </main>
  )
}