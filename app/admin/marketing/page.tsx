'use client'

import Link from 'next/link'
import { BarChart2, Mail, Share2, Shield, TrendingUp, Zap } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'

const MARKETING_TOOLS = [
  { icon: Mail, title: 'Email Campaigns', desc: 'Send deal alerts via Plunk', status: 'Coming Soon' },
  { icon: Share2, title: 'Social Sharing', desc: 'Auto-generate social posts for top deals', status: 'Coming Soon' },
  { icon: BarChart2, title: 'Analytics', desc: 'Click tracking and conversion reports', status: 'Coming Soon' },
  { icon: Zap, title: 'Flash Sale Manager', desc: 'Schedule and publish flash deals', status: 'Coming Soon' },
] as const

export default function AdminMarketingPage() {
  const { user } = useGlobal()

  if (!user || user.role !== 'Admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
        <Shield size={48} className="text-status-error" />
        <h1 className="mt-3 font-display text-2xl font-black text-[var(--cb-text-primary)]">Admin Access Required</h1>
        <Link href={ROUTES.LOGIN} className="cb-btn-primary mt-4">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <h1 className="flex items-center gap-2 font-display text-2xl font-black text-[var(--cb-text-primary)]">
          <TrendingUp size={26} className="text-skyline-primary" />
          Marketing Studio
        </h1>

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {MARKETING_TOOLS.map((tool) => (
            <article key={tool.title} className="cb-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-skyline-glow">
                <tool.icon size={22} className="text-skyline-primary" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-[var(--cb-text-primary)]">{tool.title}</h2>
              <p className="mt-2 text-sm text-[var(--cb-text-muted)]">{tool.desc}</p>
              <span className="cb-badge mt-4 bg-[var(--cb-surface-3)] text-[var(--cb-text-muted)]">{tool.status}</span>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
