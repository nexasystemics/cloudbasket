import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'SEO Manager — Admin | CloudBasket', robots: { index: false, follow: false } }

const ROUTES = [
  { path: '/', title: "CloudBasket — India's Best Price Comparison", desc: 'Compare prices across Amazon, Flipkart & 50+ stores.', hasOg: true, hasCanonical: true },
  { path: '/products', title: 'All Products — 2,000+ Deals Tracked', desc: 'Browse 2,000+ products tracked across Amazon, Flipkart and CJ Global.', hasOg: true, hasCanonical: true },
  { path: '/deals', title: "Today's Best Deals | CloudBasket", desc: 'Compare price drops from 50+ stores. Verified savings.', hasOg: true, hasCanonical: true },
  { path: '/blog', title: 'Buying Guides, Deal Alerts and Brand Reviews | CloudBasket Blog', desc: "India's most trusted price comparison blog.", hasOg: true, hasCanonical: true },
  { path: '/about', title: "About CloudBasket — India's Smartest Price Comparison", desc: 'Learn about CloudBasket and our mission.', hasOg: true, hasCanonical: true },
  { path: '/careers', title: 'Careers at NEXQON — Join Our Team', desc: 'Explore careers at CloudBasket.', hasOg: false, hasCanonical: true },
  { path: '/contact', title: 'Contact CloudBasket', desc: 'Get in touch with the CloudBasket team.', hasOg: false, hasCanonical: true },
  { path: '/faq', title: 'Frequently Asked Questions | CloudBasket', desc: 'Everything you need to know about CloudBasket.', hasOg: false, hasCanonical: true },
  { path: '/associates', title: 'Associates Program — Earn with CloudBasket', desc: 'Join the CloudBasket Associates Program.', hasOg: true, hasCanonical: true },
  { path: '/partners', title: 'Partner With CloudBasket', desc: 'Reach millions of Indian shoppers.', hasOg: true, hasCanonical: true },
]

export default function SEOManagerPage() {
  const issues = ROUTES.filter((r) => !r.hasOg || !r.hasCanonical)

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">SEO Manager</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="cb-card p-4 text-center"><p className="text-3xl font-black text-green-500">{ROUTES.length}</p><p className="text-xs text-[var(--cb-text-muted)]">Total Routes</p></div>
        <div className="cb-card p-4 text-center"><p className="text-3xl font-black text-orange-500">{issues.length}</p><p className="text-xs text-[var(--cb-text-muted)]">Missing OG/Canonical</p></div>
        <div className="cb-card p-4 text-center"><p className="text-3xl font-black text-skyline-primary">1,198</p><p className="text-xs text-[var(--cb-text-muted)]">Static Pages</p></div>
      </div>
      <div className="cb-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--cb-surface-2)]">
            <tr>{['Route', 'Title', 'Description', 'OG Image', 'Canonical'].map((h) => <th key={h} className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{h}</th>)}</tr>
          </thead>
          <tbody>
            {ROUTES.map((route) => (
              <tr key={route.path} className="border-t border-[var(--cb-border)]">
                <td className="py-3 px-4 font-mono text-xs text-skyline-primary">{route.path}</td>
                <td className="py-3 px-4 text-xs max-w-xs truncate">{route.title}</td>
                <td className="py-3 px-4 text-xs max-w-xs truncate text-[var(--cb-text-muted)]">{route.desc}</td>
                <td className="py-3 px-4"><span className={route.hasOg ? 'cb-badge cb-badge-green' : 'cb-badge bg-red-500/10 text-red-500'}>{route.hasOg ? '✓' : '✗ Missing'}</span></td>
                <td className="py-3 px-4"><span className={route.hasCanonical ? 'cb-badge cb-badge-green' : 'cb-badge bg-red-500/10 text-red-500'}>{route.hasCanonical ? '✓' : '✗ Missing'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}