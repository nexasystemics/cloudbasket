import Link from 'next/link'
import { ArrowRight, DollarSign, Link2, Users, TrendingUp, Zap } from 'lucide-react'

const COMMISSION_TABLE: ReadonlyArray<{ category: string; rate: string; cookie: string; color: string }> = [
  { category: 'POD Products', rate: '10%', cookie: '60 days', color: '#F97316' },
  { category: 'Fashion', rate: '5%', cookie: '7 days', color: '#EC4899' },
  { category: 'Home & Living', rate: '4%', cookie: '30 days', color: '#F97316' },
  { category: 'Laptops', rate: '3%', cookie: '30 days', color: '#334155' },
  { category: 'Mobiles', rate: '2.5%', cookie: '30 days', color: '#039BE5' },
  { category: 'Beauty', rate: '4%', cookie: '30 days', color: '#8B5CF6' },
  { category: 'Sports', rate: '3.5%', cookie: '30 days', color: '#10B981' },
]

const TESTIMONIALS: ReadonlyArray<{ name: string; location: string; earnings: string; quote: string }> = [
  {
    name: 'Rahul M.',
    location: 'Mumbai',
    earnings: '₹12,400/month',
    quote: 'I share deals in my WhatsApp groups. The commissions are passive income now.',
  },
  {
    name: 'Priya S.',
    location: 'Bengaluru',
    earnings: '₹8,200/month',
    quote: 'CloudBasket Associates is the easiest affiliate program I have ever used.',
  },
  {
    name: 'Arjun K.',
    location: 'Delhi',
    earnings: '₹19,800/month',
    quote: 'Started with 0 followers. Built a Telegram channel. Now earning full-time.',
  },
]

export default function AssociatesPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-gradient-to-r from-[#039BE5] to-[#0277BD] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="cb-badge mb-6 border-white/30 bg-white/20 text-white">
            <Users size={14} /> Associates Program
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-white">Earn with CloudBasket</h1>
          <p className="mt-4 text-lg text-white/80">Share deals. Earn commissions. Zero investment required.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register" className="cb-btn bg-white font-black text-[#039BE5]">
              Join Free — Start Earning
            </Link>
            <Link href="#how-it-works" className="cb-btn border-white/30 bg-white/10 text-white">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: '500+', label: 'Associates' },
            { value: '₹2.5%', label: 'Avg Commission' },
            { value: '30 days', label: 'Cookie Duration' },
            { value: 'Monthly', label: 'Payouts' },
          ].map((stat) => (
            <article key={stat.label} className="cb-card p-8 text-center">
              <p className="text-2xl font-black tracking-tighter text-[#039BE5]">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[var(--cb-text-muted)]">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-12 text-center text-3xl font-black tracking-tighter">How It Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: '1. Sign Up Free',
              desc: 'Create your free account in 2 minutes. No approval needed.',
              icon: Link2,
            },
            {
              title: '2. Get Your Link',
              desc: 'Get a unique referral link for any deal on CloudBasket.',
              icon: Zap,
            },
            {
              title: '3. Earn Commissions',
              desc: 'Earn when anyone clicks your link and makes a purchase.',
              icon: DollarSign,
            },
          ].map((step) => {
            const StepIcon = step.icon
            return (
              <article key={step.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#039BE5]">
                  <StepIcon size={28} className="text-white" />
                </div>
                <h3 className="mt-4 text-lg font-black">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--cb-text-muted)]">{step.desc}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="cb-card p-8">
          <h2 className="mb-6 text-2xl font-black tracking-tighter">Commission Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--cb-surface-2)]">
                  <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
                    Category
                  </th>
                  <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
                    Commission
                  </th>
                  <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
                    Cookie Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMMISSION_TABLE.map((row) => (
                  <tr key={row.category} className="border-t border-[var(--cb-border)]">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                        {row.category}
                      </span>
                    </td>
                    <td className="p-4 text-lg font-black text-[#039BE5]">{row.rate}</td>
                    <td className="p-4 text-sm text-[var(--cb-text-muted)]">{row.cookie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-8 text-center text-2xl font-black">What Associates Say</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.name} className="cb-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#039BE5]/10 text-lg font-black text-[#039BE5]">
                {testimonial.name.charAt(0)}
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-[var(--cb-text-muted)]">"{testimonial.quote}"</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black">{testimonial.name}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">{testimonial.location}</p>
                </div>
                <span className="cb-badge cb-badge-green">{testimonial.earnings}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black tracking-tighter">Ready to Start Earning?</h2>
          <p className="mt-3 text-[var(--cb-text-muted)]">Join 500+ associates already earning with CloudBasket</p>
          <Link href="/register" className="cb-btn cb-btn-primary mt-8 gap-2 px-8 py-4 text-lg">
            Start Earning Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  )
}
