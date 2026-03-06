import Link from 'next/link'
import { ArrowRight, Briefcase, MapPin } from 'lucide-react'

const OPENINGS = [
  {
    title: 'Senior Next.js Engineer',
    type: 'Remote',
    location: 'India',
    tag: 'Engineering',
  },
  {
    title: 'Affiliate Partnership Manager',
    type: 'Remote',
    location: 'India',
    tag: 'Growth',
  },
  {
    title: 'Content & SEO Strategist',
    type: 'Remote',
    location: 'India',
    tag: 'Marketing',
  },
] as const

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="flex items-center gap-2 font-display text-3xl font-black text-[var(--cb-text-primary)]">
          <Briefcase size={30} className="text-skyline-primary" />
          Careers at CloudBasket
        </h1>
        <p className="mt-2 text-[var(--cb-text-muted)]">Build the future of price discovery in India</p>

        <section className="mt-10 space-y-4">
          {OPENINGS.map((opening) => (
            <article key={opening.title} className="cb-card flex items-center justify-between p-6">
              <div>
                <h2 className="text-lg font-bold text-[var(--cb-text-primary)]">{opening.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-[var(--cb-text-muted)]">
                  <MapPin size={14} />
                  {opening.location} · {opening.type}
                </p>
                <span className="cb-badge mt-2 bg-skyline-glow text-skyline-primary">{opening.tag}</span>
              </div>
              <Link
                href={`mailto:careers@cloudbasket.in?subject=Application: ${encodeURIComponent(opening.title)}`}
                className="cb-btn-ghost items-center gap-2"
              >
                Apply
                <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </section>

        <p className="mt-10 text-center text-sm text-[var(--cb-text-muted)]">
          Remote-first. Mission-driven. Equity available for early team members.
        </p>
      </div>
    </div>
  )
}
