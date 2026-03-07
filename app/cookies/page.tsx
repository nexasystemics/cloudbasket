import Link from 'next/link'
import { Cookie, Shield, Settings, BarChart2, ExternalLink, CheckCircle } from 'lucide-react'

export default function CookiesPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <Cookie size={40} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black">Cookie Policy</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">Last updated: March 1, 2026</p>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
        <article className="cb-card p-8">
          <p className="text-sm leading-relaxed text-[var(--cb-text-muted)]">
            CloudBasket uses cookies to improve your experience. This policy explains what cookies we use and why.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-3 inline-flex items-center gap-2 text-[#039BE5]">
            <Shield size={16} /> <h2 className="text-lg font-black text-[var(--cb-text-primary)]">Essential Cookies</h2>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-[#10B981]">Always On</p>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Purpose: Authentication, security and session management. Examples: `supabase-auth`, `cb-session`,
            `csrf-token`. These cannot be disabled.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-3 inline-flex items-center gap-2 text-[#039BE5]">
            <BarChart2 size={16} />{' '}
            <h2 className="text-lg font-black text-[var(--cb-text-primary)]">Analytics Cookies</h2>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-[#039BE5]">Default On</p>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Purpose: Understand navigation and improve UX. Tool: Vercel Analytics (privacy-first, no IP storage).
            Can be disabled in browser settings.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-3 inline-flex items-center gap-2 text-[#039BE5]">
            <ExternalLink size={16} />{' '}
            <h2 className="text-lg font-black text-[var(--cb-text-primary)]">Affiliate Tracking Cookies</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Purpose: Track deal clicks for commission attribution. Set by Amazon, Flipkart and CJ Affiliate.
            Duration: 1-30 days depending on partner. Required for affiliate revenue model.
          </p>
        </article>

        <article className="cb-card p-8">
          <div className="mb-3 inline-flex items-center gap-2 text-[#039BE5]">
            <Settings size={16} /> <h2 className="text-lg font-black text-[var(--cb-text-primary)]">Preference Cookies</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Purpose: Remember your region, currency and theme preferences. Duration is up to 1 year and can be
            cleared in browser settings.
          </p>
        </article>

        <article className="cb-card border-[#039BE5]/20 bg-[#039BE5]/5 p-6">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[#039BE5]">
            <CheckCircle size={14} /> Managing Your Cookies
          </p>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            You can manage cookies through your browser settings. Note: disabling essential cookies will affect site
            functionality.
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" className="cb-btn cb-btn-primary">
              Accept All
            </button>
            <button type="button" className="cb-btn cb-btn-ghost">
              Essential Only
            </button>
          </div>
        </article>

        <p>
          <Link href="/legal/privacy" className="text-sm text-[#039BE5]">
            View our full Privacy Policy →
          </Link>
        </p>
      </section>
    </main>
  )
}
