'use client'
import { useState } from 'react'
import { ChevronDown, Check, TrendingUp, Users, ShoppingBag, Star } from 'lucide-react'
import { SITE_TAGLINE } from '@/lib/constants'

const TIERS = [
  { tier: 'Featured Listing', includes: 'Product appears first in category, sponsored badge', price: '₹5,000/month per category', best: 'Brands launching new products' },
  { tier: 'Brand Store', includes: 'Dedicated brand page, custom banner, brand story', price: '₹15,000/month', best: 'Established brands' },
  { tier: 'Price Alert Sponsor', includes: 'Products appear in price alert emails', price: '₹8,000/month', best: 'Brands with frequent price drops' },
  { tier: 'Homepage Feature', includes: 'Featured in Top Deals Today and DealsBar', price: '₹12,000/week', best: 'High-priority launches' },
  { tier: 'Newsletter Sponsor', includes: 'Brand featured in weekly deals digest', price: '₹10,000/send', best: 'New product launches' },
]

const FAQS = [
  { q: 'How do sponsored listings work?', a: 'Sponsored products appear at the top of category search results with a "Sponsored" badge. You pay per month per category.' },
  { q: 'How do we track performance?', a: 'You get a monthly report showing impressions, clicks, and estimated conversions for your sponsored content.' },
  { q: 'What is your cancellation policy?', a: 'Monthly contracts can be cancelled with 7 days notice before the next billing cycle.' },
  { q: 'Is editorial content affected by partnerships?', a: 'No. Our editorial recommendations are independent of paid partnerships. Sponsored content is always clearly labelled.' },
]

// IBF: confirm real brand names before launch
const BRANDS = [
  'Partner Brand 1', 'Partner Brand 2', 'Partner Brand 3',
  'Partner Brand 4', 'Partner Brand 5', 'Partner Brand 6',
  'Partner Brand 7', 'Partner Brand 8', 'Partner Brand 9',
  'Partner Brand 10', 'Partner Brand 11', 'Partner Brand 12',
]

type FormState = {
  company: string
  brand: string
  contact: string
  email: string
  phone: string
  type: string
  budget: string
  message: string
}

const FORM_FIELDS: { label: string; key: keyof FormState }[] = [
  { label: 'Company Name *', key: 'company' },
  { label: 'Brand Name', key: 'brand' },
  { label: 'Contact Person', key: 'contact' },
  { label: 'Email *', key: 'email' },
  { label: 'Phone', key: 'phone' },
]

export default function PartnersPageClient() {
  const [form, setForm] = useState<FormState>({ company: '', brand: '', contact: '', email: '', phone: '', type: '', budget: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = () => {
    if (!form.company || !form.email) return
    try { localStorage.setItem('cb_partner_enquiry', JSON.stringify({ ...form, submittedAt: new Date().toISOString() })) } catch { /* no-op */ }
    setSubmitted(true)
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-950 to-sky-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-black tracking-tighter">Reach Millions of Smart Indian Shoppers</h1>
          <p className="mt-3 text-sm font-black uppercase tracking-[0.2em] text-[#F5C518]">{SITE_TAGLINE}</p>
          <p className="mt-4 text-lg text-white/80">CloudBasket connects price-conscious Indian consumers with the brands they love. Partner with us to get your products in front of high-intent buyers.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, num: '10M+',  label: 'Monthly deal searches' },
            { icon: ShoppingBag, num: '₹500Cr+', label: 'In deals discovered' },
            { icon: Users,       num: 'Soon',  label: 'Growing fast — launching 2026' },
            { icon: Star,        num: '98%',   label: 'Compare before buying' },
          ].map((stat) => (
            <div key={stat.label} className="cb-card p-6 text-center">
              <stat.icon size={28} className="text-skyline-primary mx-auto mb-2" aria-hidden="true" />
              <p className="text-3xl font-black">{stat.num}</p>
              <p className="text-xs text-[var(--cb-text-muted)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current Partners */}
      <section className="bg-[var(--cb-surface-2)] py-10">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)] mb-4 text-center">Brands Already on CloudBasket</p>
          <div className="flex flex-wrap justify-center gap-2">
            {BRANDS.map((brand) => (
              <span key={brand} className="cb-badge px-4 py-1.5">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter mb-8">Partnership Tiers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--cb-border)]">
                {['Tier', "What's Included", 'Investment', 'Best For'].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIERS.map((row) => (
                <tr key={row.tier} className="border-b border-[var(--cb-border)]/50 hover:bg-[var(--cb-surface-2)]">
                  <td className="py-3 px-4 font-black">{row.tier}</td>
                  <td className="py-3 px-4 text-[var(--cb-text-secondary)]">{row.includes}</td>
                  <td className="py-3 px-4 text-skyline-primary font-black">{row.price}</td>
                  <td className="py-3 px-4 text-[var(--cb-text-muted)]">{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Case Studies — hidden until real content available */}
      {false && (
        // IBF: add real case studies before launch
        <section className="bg-[var(--cb-surface-2)] py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-black mb-6">Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Electronics Brand', 'Fashion Label', 'FMCG Company'].map((brand) => (
                <div key={brand} className="cb-card p-6">
                  <span className="cb-badge cb-badge-orange mb-3">Coming Soon</span>
                  <p className="text-sm font-bold mt-2">How {brand} increased click-through rate by 340% with a Featured Listing campaign on CloudBasket.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter mb-8">Get in Touch</h2>
        {submitted ? (
          <div className="cb-card p-10 text-center">
            <Check size={48} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-black">Enquiry Received!</h3>
            <p className="mt-2 text-[var(--cb-text-muted)]">Our partnerships team will contact you within 24 hours.</p>
          </div>
        ) : (
          <div className="cb-card p-6 space-y-4">
            {FORM_FIELDS.map((f) => (
              <div key={f.key}>
                <label htmlFor={`partner-${f.key}`} className="block text-xs font-black uppercase tracking-widest mb-1">
                  {f.label}
                </label>
                <input
                  id={`partner-${f.key}`}
                  className="cb-input w-full"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label htmlFor="partner-type" className="block text-xs font-black uppercase tracking-widest mb-1">
                Partnership Type
              </label>
              <select
                id="partner-type"
                className="cb-input w-full"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select tier</option>
                {TIERS.map((t) => <option key={t.tier}>{t.tier}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="partner-message" className="block text-xs font-black uppercase tracking-widest mb-1">
                Message
              </label>
              <textarea
                id="partner-message"
                className="cb-input w-full h-24 resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button type="button" onClick={handleSubmit} className="cb-btn cb-btn-primary w-full">
              Send Enquiry
            </button>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-black tracking-tighter mb-8">How Brand Partnerships Work</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="cb-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-black">{faq.q}</span>
                  <ChevronDown size={18} aria-hidden="true" className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[var(--cb-text-secondary)]">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
