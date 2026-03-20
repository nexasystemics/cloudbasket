import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Email Manager — Admin | CloudBasket', robots: { index: false, follow: false } }

export default function EmailManagerPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Email Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">--</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Total Subscribers</p><p className="text-xs text-orange-500 mt-1">Connect Supabase to view</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-green-500">3</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Email Templates</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-orange-500">0</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Unsubscribed</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { name: 'Weekly Deal Digest', desc: 'Sent every Monday with top 5 deals', status: 'Active' },
          { name: 'Price Drop Alert', desc: 'Triggered when product hits target price', status: 'Active' },
          { name: 'Welcome Email', desc: 'Sent on new user registration', status: 'Draft' },
        ].map((t) => (
          <div key={t.name} className="cb-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-sm">{t.name}</h3>
              <span className={t.status === 'Active' ? 'cb-badge cb-badge-green' : 'cb-badge'}>{t.status}</span>
            </div>
            <p className="text-xs text-[var(--cb-text-muted)]">{t.desc}</p>
            <button type="button" className="cb-btn cb-btn-ghost text-xs mt-3 w-full">Preview Template</button>
          </div>
        ))}
      </div>
      <div className="cb-card p-6">
        <h2 className="font-black mb-4">Send Test Email</h2>
        <div className="flex gap-3">
          <input className="cb-input flex-1" placeholder="test@example.com" />
          <select className="cb-input w-48">
            <option>Weekly Digest</option>
            <option>Price Drop Alert</option>
            <option>Welcome Email</option>
          </select>
          <button type="button" className="cb-btn cb-btn-primary">Send Test</button>
        </div>
      </div>
    </main>
  )
}