// app/offline/page.tsx
// Shown to all non-admin visitors when MAINTENANCE_MODE=true (proxy.ts §7)
// Also served at /offline for PWA offline fallback
// Server component — no client JS needed
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coming Soon | CloudBasket',
  description:
    'CloudBasket is launching soon. India\'s smartest affiliate and print-on-demand platform. Design. Print. Earn.',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B1F35] flex flex-col items-center justify-center px-6 text-center">

      {/* Background accent blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#039BE5] opacity-10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#E65100] opacity-10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center">

        {/* Brand wordmark */}
        <div className="mb-3 flex items-baseline gap-0.5">
          <span className="text-5xl font-black tracking-tighter text-[#039BE5] sm:text-6xl">
            Cloud
          </span>
          <span className="text-5xl font-black tracking-tighter text-white sm:text-6xl">
            Basket
          </span>
        </div>

        {/* Tagline */}
        <p className="mb-12 text-xs font-black uppercase tracking-[0.3em] text-[#F5C518]">
          Design. Print. Earn.
        </p>

        {/* Headline */}
        <h1 className="mb-4 text-3xl font-black tracking-tighter text-white sm:text-4xl">
          Something exciting is coming.
        </h1>

        {/* Sub-copy */}
        <p className="mb-10 max-w-md text-sm leading-7 text-white/60">
          We&apos;re putting the finishing touches on CloudBasket — India&apos;s
          smartest affiliate &amp; print-on-demand platform. We&apos;ll notify
          you the moment we launch.
        </p>

        {/* Email capture — static form, no backend required */}
        <form
          action="/api/waitlist"
          method="POST"
          className="mb-14 flex w-full max-w-sm flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            autoComplete="email"
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#039BE5] focus:bg-white/15 transition-colors"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#039BE5] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#0288d1] active:bg-[#0277bd]"
          >
            Notify Me
          </button>
        </form>

        {/* Trust badges */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {[
            '🔒 Privacy First',
            '🇮🇳 Made in India',
            '⚡ Launching 2026',
          ].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/50"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Footer credit */}
        <p className="text-xs text-white/25">
          © 2026{' '}
          <span className="font-semibold text-white/40">NEXQON HOLDINGS</span>
          . All rights reserved.
        </p>

      </div>
    </main>
  )
}
