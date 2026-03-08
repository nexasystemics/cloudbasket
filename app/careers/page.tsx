import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, Briefcase, ArrowRight, Code, PenTool, TrendingUp, Search, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: "Careers at NEXQON — Join Our Team",
  description: "Join NEXQON Engineering and build India's sovereign digital infrastructure.",
}
const BENEFITS: ReadonlyArray<{ title: string; desc: string }> = [
  { title: 'Remote First', desc: 'Work from anywhere in India' },
  { title: 'Equity', desc: 'ESOP for all full-time roles' },
  { title: 'Health', desc: 'Full family health coverage' },
  { title: 'Learning', desc: '₹50,000/year learning budget' },
]

const JOBS_DATA = [
  {
    title: 'Senior Frontend Engineer',
    dept: 'Engineering',
    location: 'Remote India',
    type: 'Full-time',
    icon: Code,
    color: '#039BE5',
    desc: 'Build sovereign-grade React/Next.js interfaces at NEXQON scale.',
  },
  {
    title: 'Product Manager — Commerce',
    dept: 'Product',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    icon: TrendingUp,
    color: '#F97316',
    desc: "Own the product roadmap for CloudBasket — India's top commerce platform.",
  },
  {
    title: 'SEO & Content Strategist',
    dept: 'Growth',
    location: 'Remote India',
    type: 'Full-time',
    icon: Search,
    color: '#10B981',
    desc: 'Drive organic traffic to 50K+ pages across the CloudBasket platform.',
  },
  {
    title: 'Associate Growth Manager',
    dept: 'Partnerships',
    location: 'Remote India',
    type: 'Part-time',
    icon: Users,
    color: '#8B5CF6',
    desc: 'Grow the CloudBasket Associates network across India.',
  },
  {
    title: 'Backend Engineer (Node.js)',
    dept: 'Engineering',
    location: 'Remote India',
    type: 'Full-time',
    icon: Zap,
    color: '#F5C842',
    desc: 'Build high-performance APIs for price aggregation at scale.',
  },
  {
    title: 'UI/UX Designer',
    dept: 'Design',
    location: 'Remote India',
    type: 'Full-time',
    icon: PenTool,
    color: '#EF4444',
    desc: 'Design sovereign-grade interfaces for 18+ NEXQON products.',
  },
] as const

export default function CareersPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-gradient-to-br from-[#039BE5]/5 to-[#0277BD]/5 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="cb-badge cb-badge-blue mb-6">
            <Briefcase size={14} /> We're Hiring
          </span>
          <h1 className="text-5xl font-black tracking-tighter">Join NEXQON Engineering</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--cb-text-muted)]">
            We are building India's sovereign digital infrastructure. 18+ products. 1 mission. Remote first.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="cb-card p-6 text-center">
              <h3 className="text-sm font-black">{benefit.title}</h3>
              <p className="mt-2 text-xs text-[var(--cb-text-muted)]">{benefit.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-8 text-2xl font-black tracking-tighter">Open Positions</h2>
        <div className="flex flex-col gap-4">
          {JOBS_DATA.map((job) => {
            const JobIcon = job.icon

            return (
              <article key={job.title} className="cb-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${job.color}1A` }}>
                    <JobIcon size={20} style={{ color: job.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black">{job.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="cb-badge text-[10px]">{job.dept}</span>
                      <span className="cb-badge text-[10px]">
                        <MapPin size={10} /> {job.location}
                      </span>
                      <span className={`cb-badge text-[10px] ${job.type === 'Full-time' ? 'cb-badge-green' : 'cb-badge-blue'}`}>
                        <Clock size={10} /> {job.type}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--cb-text-muted)]">{job.desc}</p>
                  </div>
                </div>

                <Link href="mailto:careers@nexqon.in" className="cb-btn cb-btn-primary gap-2 whitespace-nowrap">
                  Apply Now <ArrowRight size={14} />
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="cb-card border-[#039BE5]/20 bg-gradient-to-r from-[#039BE5]/5 to-[#0277BD]/5 p-10 text-center">
          <h2 className="text-2xl font-black">Don't see your role?</h2>
          <p className="mt-2 text-[var(--cb-text-muted)]">We hire for talent, not just open roles. Send your CV.</p>
          <Link href="mailto:careers@nexqon.in" className="cb-btn cb-btn-primary mt-6 gap-2">
            Send Your CV <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}

