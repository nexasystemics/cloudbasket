import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Earn Commission',
    desc: 'Up to 12% on every verified sale through your links',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    desc: 'Track clicks, conversions and earnings live',
  },
  {
    icon: Shield,
    title: 'DPDPA Compliant',
    desc: 'All data handling follows Indian privacy law',
  },
  {
    icon: Users,
    title: 'Growing Network',
    desc: 'Join 500+ associates already earning with CloudBasket',
  },
  {
    icon: CheckCircle,
    title: 'Easy Approval',
    desc: 'Simple application. Approval within 48 hours.',
  },
  {
    icon: ArrowRight,
    title: 'Instant Setup',
    desc: 'Get your affiliate links the moment you are approved',
  },
] as const

export default function AssociatesPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <span className="cb-badge mb-6 bg-skyline-glow text-skyline-primary">Associate Program</span>
        <h1 className="font-display text-5xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
          Earn with CloudBasket
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--cb-text-muted)]">
          Join India&apos;s fastest growing affiliate network. Earn commission on every deal you refer.
        </p>
        <Link href={ROUTES.REGISTER} className="cb-btn-primary mt-8 inline-flex items-center gap-2 px-10 py-4">
          Apply Now — It&apos;s Free
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 py-16 md:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <article key={benefit.title} className="cb-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-skyline-glow">
              <benefit.icon size={24} className="text-skyline-primary" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[var(--cb-text-primary)]">{benefit.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--cb-text-muted)]">{benefit.desc}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-16">
        <h2 className="mb-8 text-center font-display text-2xl font-black text-[var(--cb-text-primary)]">
          Commission Rates
        </h2>
        <div className="cb-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--cb-surface-3)] text-[11px] uppercase tracking-widest text-[var(--cb-text-muted)]">
                <th className="border cb-border px-4 py-3 text-start">Category</th>
                <th className="border cb-border px-4 py-3 text-start">Amazon</th>
                <th className="border cb-border px-4 py-3 text-start">Flipkart</th>
                <th className="border cb-border px-4 py-3 text-start">CJ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border cb-border px-4 py-3">Mobiles</td>
                <td className="border cb-border px-4 py-3">4%</td>
                <td className="border cb-border px-4 py-3">3%</td>
                <td className="border cb-border px-4 py-3">8%</td>
              </tr>
              <tr>
                <td className="border cb-border px-4 py-3">Laptops</td>
                <td className="border cb-border px-4 py-3">5%</td>
                <td className="border cb-border px-4 py-3">4%</td>
                <td className="border cb-border px-4 py-3">10%</td>
              </tr>
              <tr>
                <td className="border cb-border px-4 py-3">Fashion</td>
                <td className="border cb-border px-4 py-3">8%</td>
                <td className="border cb-border px-4 py-3">6%</td>
                <td className="border cb-border px-4 py-3">12%</td>
              </tr>
              <tr>
                <td className="border cb-border px-4 py-3">Home</td>
                <td className="border cb-border px-4 py-3">6%</td>
                <td className="border cb-border px-4 py-3">5%</td>
                <td className="border cb-border px-4 py-3">9%</td>
              </tr>
              <tr>
                <td className="border cb-border px-4 py-3">Beauty</td>
                <td className="border cb-border px-4 py-3">10%</td>
                <td className="border cb-border px-4 py-3">8%</td>
                <td className="border cb-border px-4 py-3">12%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[var(--cb-surface-2)] py-16 text-center">
        <h3 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Ready to start earning?</h3>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={ROUTES.REGISTER} className="cb-btn-primary">
            Apply Now
          </Link>
          <Link href="/faq" className="cb-btn-ghost">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  )
}
