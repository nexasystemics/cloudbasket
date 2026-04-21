'use client'
import { useState } from 'react'
import { ChevronDown, DollarSign, Link as LinkIcon, Check } from 'lucide-react'

const COMMISSION_TABLE = [
  { category: 'Electronics', rate: '3–5%', cookie: '30 days', payout: '₹500' },
  { category: 'Fashion', rate: '5–8%', cookie: '30 days', payout: '₹500' },
  { category: 'Home Appliances', rate: '4–6%', cookie: '30 days', payout: '₹500' },
  { category: 'FMCG / Personal Care', rate: '2–4%', cookie: '14 days', payout: '₹500' },
  { category: 'POD Products', rate: '10–15%', cookie: '60 days', payout: '₹500' },
  { category: 'All Others', rate: '2–3%', cookie: '30 days', payout: '₹500' },
]

const FAQS = [
  { q: 'When do I get paid?', a: 'Payouts are processed monthly via bank transfer or UPI once you reach the ₹500 minimum threshold.' },
  { q: 'How are clicks tracked?', a: 'Each associate gets a unique tracking ID appended to all CloudBasket links. We track clicks for 30–60 days depending on category.' },
  { q: 'Can I join from outside India?', a: 'Currently the program is open to Indian residents only. International expansion is planned for 2027.' },
  { q: 'What is not allowed?', a: 'Cookie stuffing, spam, self-referrals, misleading claims, and paid search ads targeting CloudBasket brand terms are prohibited.' },
  { q: 'How do I get my tracking link?', a: 'After approval, log in to your associate dashboard and generate tracking links for any product or category page.' },
]

export default function AssociatesPageClient() {
  const [form, setForm] = useState({ name: '', email: '', url: '', platform: '', traffic: '', niche: '', source: '', terms: false })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.url || !form.terms) return
    try { localStorage.setItem('cb_associate_application', JSON.stringify({ ...form, submittedAt: new Date().toISOString() })) } catch { /* no-op */ }
    setSubmitted(true)
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2D4A] to-[#1F4E79] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-black tracking-tighter">Partner With CloudBasket — Earn While You Share</h1>
          <p className="mt-4 text-lg text-white/80">Join thousands of bloggers, influencers, and publishers earning commission by recommending India's smartest price comparison platform.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="rounded-xl bg-white/10 px-6 py-3 text-center"><p className="text-2xl font-black">₹50L+</p><p className="text-xs text-white/70">Paid to associates</p></div>
            <div className="rounded-xl bg-white/10 px-6 py-3 text-center"><p className="text-2xl font-black">2,000+</p><p className="text-xs text-white/70">Active partners</p></div>
            <div className="rounded-xl bg-white/10 px-6 py-3 text-center"><p className="text-2xl font-black">Up to 15%</p><p className="text-xs text-white/70">Commission</p></div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#apply" className="cb-btn bg-white text-[#1F4E79] font-black px-8 py-3">Apply Now</a>
            <a href="#how-it-works" className="cb-btn border border-white/40 text-white px-8 py-3">Learn How It Works</a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Check, title: 'Apply', desc: 'Submit your website, blog, YouTube channel, or social media profile. Approval within 48 hours.' },
            { step: '02', icon: LinkIcon, title: 'Share', desc: 'Get your unique tracking link for any product, category, or deal page on CloudBasket.' },
            { step: '03', icon: DollarSign, title: 'Earn', desc: 'Earn commission for every user you send who clicks through to our affiliate partner platforms.' },
          ].map((item) => (
            <div key={item.step} className="cb-card p-6 text-center">
              <p className="text-5xl font-black text-skyline-primary/20 mb-3">{item.step}</p>
              <item.icon size={32} className="text-skyline-primary mx-auto mb-3" />
              <h3 className="text-xl font-black mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--cb-text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="bg-[var(--cb-surface-2)] py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-black mb-6">Who Can Apply</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Bloggers and content creators', 'YouTube channels (tech, lifestyle, fashion)', 'Instagram and Facebook pages (10K+ followers)', 'Price comparison and coupon websites', 'News and media websites', 'Mobile apps'].map((item) => (
              <div key={item} className="flex items-center gap-2 cb-card p-3">
                <Check size={14} className="text-green-500 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Table */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter mb-8">Commission Structure</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--cb-border)]">
                {['Category', 'Commission Rate', 'Cookie Duration', 'Minimum Payout'].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMMISSION_TABLE.map((row) => (
                <tr key={row.category} className="border-b border-[var(--cb-border)]/50 hover:bg-[var(--cb-surface-2)]">
                  <td className="py-3 px-4 font-bold">{row.category}</td>
                  <td className="py-3 px-4 text-skyline-primary font-black">{row.rate}</td>
                  <td className="py-3 px-4">{row.cookie}</td>
                  <td className="py-3 px-4">{row.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="mx-auto max-w-2xl px-6 pb-16">
        <h2 className="text-3xl font-black tracking-tighter mb-8">Apply Now</h2>
        {submitted ? (
          <div className="cb-card p-10 text-center">
            <Check size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-black">Application Submitted!</h3>
            <p className="mt-2 text-[var(--cb-text-muted)]">We will review your application and respond to your email within 48 hours.</p>
          </div>
        ) : (
          <div className="cb-card p-6 space-y-4">
            {[
              { label: 'Full Name *', key: 'name', type: 'text' },
              { label: 'Email *', key: 'email', type: 'email' },
              { label: 'Website / Channel URL *', key: 'url', type: 'url' },
              { label: 'Niche / Category', key: 'niche', type: 'text' },
              { label: 'How did you hear about us?', key: 'source', type: 'text' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">{field.label}</label>
                <input type={field.type} className="cb-input w-full" value={(form as any)[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Platform Type</label>
              <select className="cb-input w-full" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                <option value="">Select platform</option>
                {['Blog / Website', 'YouTube', 'Instagram', 'Facebook Page', 'Coupon / Deal Site', 'News / Media', 'Mobile App', 'Other'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Monthly Traffic / Views</label>
              <select className="cb-input w-full" value={form.traffic} onChange={(e) => setForm({ ...form, traffic: e.target.value })}>
                <option value="">Select range</option>
                {['Under 1,000', '1,000–10,000', '10,000–50,000', '50,000–1,00,000', '1,00,000+'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} />
              <span className="text-sm">I agree to the <a href="/legal/terms" className="text-skyline-primary underline" target="_blank" rel="noopener noreferrer">Terms of Service</a></span>
            </label>
            <button type="button" onClick={handleSubmit} className="cb-btn cb-btn-primary w-full">Submit Application</button>
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-black tracking-tighter mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="cb-card overflow-hidden">
                <button type="button" className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-black">{faq.q}</span>
                  <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-sm text-[var(--cb-text-secondary)]">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
