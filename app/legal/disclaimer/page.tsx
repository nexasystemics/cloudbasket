// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/disclaimer/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import {
  DISCLAIMER_DOCUMENT_ID,
  DISCLAIMER_EFFECTIVE_DATE,
  DISCLAIMER_LAST_UPDATED,
  DISCLAIMER_SECTIONS,
  DISCLAIMER_VERSION,
  LEGAL_EMAIL,
} from './data'

export const metadata: Metadata = {
  title: 'Disclaimer | CloudBasket',
  description:
    'Read the CloudBasket Disclaimer covering pricing accuracy, affiliate links, warranties, liability limits, and intermediary status under Indian law.',
  alternates: {
    canonical: 'https://www.cloudbasket.in/legal/disclaimer',
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Disclaimer | CloudBasket',
  description:
    'CloudBasket disclaimer covering pricing, availability, affiliate relationships, warranties, and liability limitations.',
  url: 'https://www.cloudbasket.in/legal/disclaimer',
  dateModified: '2026-04-01',
  publisher: {
    '@type': 'Organization',
    name: 'NEXQON HOLDINGS',
    url: 'https://www.cloudbasket.in',
  },
}

function toneClasses(tone: 'warning' | 'success' | 'neutral') {
  if (tone === 'warning') return 'border-amber-300 bg-amber-50 text-amber-950'
  if (tone === 'success') return 'border-emerald-300 bg-emerald-50 text-emerald-950'
  return 'border-sky-300 bg-sky-50 text-sky-950'
}

export default function DisclaimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-5xl">
        <nav
          className="mb-6 flex items-center gap-2 text-xs text-gray-500 print:hidden"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#039BE5]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/legal" className="hover:text-[#039BE5]">
            Legal
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-gray-900">Disclaimer</span>
        </nav>

        <header className="relative overflow-hidden rounded-[28px] border border-[#d7e6f7] bg-[linear-gradient(135deg,#0f2347_0%,#1b3a6b_58%,#2a5797_100%)] px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,35,71,0.18)] sm:px-8">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_72%)]" />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-100">
                Legal Document
              </p>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white">
                CloudBasket Disclaimer
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100">
                Covers pricing accuracy, third-party merchant dependence, affiliate disclosures,
                warranty exclusions, liability boundaries, and intermediary positioning under
                Indian law.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-sky-100">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  Effective: {DISCLAIMER_EFFECTIVE_DATE}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  Version: {DISCLAIMER_VERSION}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  Doc ID: {DISCLAIMER_DOCUMENT_ID}
                </span>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:w-auto">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                PDF-First Access
              </p>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Open a dedicated document view in a separate tab, then use your browser&apos;s
                print dialog to save a clean PDF copy.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/legal/disclaimer/pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#12315f] transition-opacity hover:opacity-90"
                >
                  Open PDF View
                </Link>
                <a
                  href={`mailto:${LEGAL_EMAIL}`}
                  className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Contact Legal
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="print:hidden">
            <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
                Contents
              </p>
              <ol className="mt-4 space-y-2">
                {DISCLAIMER_SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#039BE5]"
                    >
                      <span className="mr-2 text-xs font-bold text-gray-400">{index + 1}.</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="space-y-5">
            <section className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-5 text-sm leading-6 text-slate-700">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#c2410c]">
                Plain-Language Summary
              </p>
              <p className="mt-3">
                CloudBasket helps users discover products and compare listings, but the final
                transaction always happens on a third-party merchant website. That means prices,
                availability, warranties, refunds, and order fulfilment remain the merchant&apos;s
                responsibility.
              </p>
            </section>

            {DISCLAIMER_SECTIONS.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <details open={index < 2} className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12315f] text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-black tracking-tight text-slate-900">
                        {section.title}
                      </h2>
                    </div>
                    <div className="text-gray-400 transition-transform group-open:rotate-180">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                          d="M5 8l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </summary>

                  <div className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-slate-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}

                    {section.bullets && (
                      <ul className="mb-4 space-y-2 rounded-xl bg-slate-50 p-4">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#039BE5]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.callout && (
                      <div
                        className={`mb-4 rounded-xl border px-4 py-4 text-sm leading-6 ${toneClasses(section.callout.tone)}`}
                      >
                        <p className="text-[11px] font-black uppercase tracking-[0.16em]">
                          {section.callout.title}
                        </p>
                        <p className="mt-2">{section.callout.body}</p>
                      </div>
                    )}

                    {section.legalBasis && (
                      <p className="inline-flex rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
                        Legal basis: {section.legalBasis}
                      </p>
                    )}
                  </div>
                </details>
              </section>
            ))}

            <section className="rounded-2xl border border-gray-200 bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-200">
                    Related Documents
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <Link href="/legal/terms" className="text-sky-300 hover:text-white">
                      Terms of Service
                    </Link>
                    <Link href="/legal/privacy" className="text-sky-300 hover:text-white">
                      Privacy Policy
                    </Link>
                    <Link href="/legal/cookies" className="text-sky-300 hover:text-white">
                      Cookie Policy
                    </Link>
                    <Link href="/legal/affiliate-disclosure" className="text-sky-300 hover:text-white">
                      Affiliate Disclosure
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  <p>NEXQON HOLDINGS</p>
                  <p>Kadapa, Andhra Pradesh – 516002, India</p>
                  <a href={`mailto:${LEGAL_EMAIL}`} className="text-sky-300 hover:text-white">
                    {LEGAL_EMAIL}
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Disclaimer last updated {DISCLAIMER_LAST_UPDATED} | {DISCLAIMER_DOCUMENT_ID}
        </p>
      </article>
    </>
  )
}
