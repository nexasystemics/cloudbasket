import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, UserCheck, Clock, Mail, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: "Privacy Policy — DPDPA 2023 Compliant",
  description:
    'Read the CloudBasket Privacy Policy to learn how we handle personal data, cookies, tracking, security, and clearly explain your rights under applicable laws.',
}
const LAST_UPDATED = 'March 1, 2026'
const DPO_EMAIL = 'privacy@cloudbasket.in'

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Shield size={40} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black tracking-tighter">Privacy Policy</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">Last updated: {LAST_UPDATED} · DPDPA 2023 & GDPR Compliant</p>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Database size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Data We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            <li>Email address (registration only)</li>
            <li>Search queries and filters used</li>
            <li>Products clicked and deals viewed</li>
            <li>Device type and browser (analytics)</li>
            <li>IP address (security only, not stored beyond 30 days)</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            We never collect payment information. All purchases happen on partner sites.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Eye size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">How We Use Your Data</h2>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            <li>Personalise deal recommendations</li>
            <li>Send price drop alerts (if opted in)</li>
            <li>Improve search relevance</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Lock size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Affiliate Tracking</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            When you click a deal link, our affiliate partner (Amazon, Flipkart, CJ) may set a tracking cookie. This
            is standard affiliate practice. See our Affiliate Disclosure for full details.
          </p>
          <Link href="/affiliate-disclosure" className="cb-btn cb-btn-ghost mt-4">
            View Affiliate Disclosure →
          </Link>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Database size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Cookies</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            Essential cookies keep core platform features working. Analytics cookies help us improve relevance and site
            speed. Affiliate tracking cookies allow commission attribution to partner networks.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            You can manage cookies in your browser settings at any time.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <UserCheck size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Your Rights (DPDPA 2023)</h2>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            <li>Right to access your data</li>
            <li>Right to correction</li>
            <li>Right to erasure (Right to be Forgotten)</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p className="mt-3 text-sm text-[var(--cb-text-muted)]">To exercise any right, email: {DPO_EMAIL}</p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Clock size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Data Retention</h2>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            <li>Account data: retained while account is active + 90 days</li>
            <li>Analytics data: 24 months rolling</li>
            <li>IP logs: 30 days maximum</li>
            <li>Affiliate click data: 90 days</li>
          </ul>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Lock size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Data Security</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--cb-text-muted)]">
            All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use Supabase hosted on AWS Mumbai
            (ap-south-1) for Indian data residency.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
            <Mail size={18} className="text-[#039BE5]" />
          </div>
          <h2 className="text-xl font-black">Contact Our DPO</h2>
          <div className="cb-card border-[#039BE5]/20 bg-[#039BE5]/5 p-6">
            <p className="text-sm font-black">Data Protection Officer</p>
            <p className="mt-1 text-sm text-[#039BE5]">{DPO_EMAIL}</p>
            <p className="mt-1 text-sm text-[var(--cb-text-muted)]">Response time: Within 72 hours</p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-[#039BE5]">
              <AlertCircle size={12} /> Priority handling for legal privacy requests
            </p>
            <Link href="/contact" className="cb-btn cb-btn-primary mt-4">
              Contact DPO
            </Link>
          </div>
        </article>
      </section>
    </main>
  )
}
