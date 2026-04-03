// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/refund-policy/pdf/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import Logo from '@/components/brand/Logo'

import PrintButton from './PrintButton'
import {
  REFUND_POLICY_CONTACT_EMAIL,
  REFUND_POLICY_DOCUMENT_ID,
  REFUND_POLICY_EFFECTIVE_DATE,
  REFUND_POLICY_LAST_UPDATED,
  REFUND_POLICY_SECTIONS,
  REFUND_POLICY_VERSION,
} from '../data'

export const metadata: Metadata = {
  title: 'Refund & Returns Policy PDF View | CloudBasket',
  description:
    'Printable PDF-style view of the CloudBasket refund and returns policy for affiliate and third-party marketplace purchases.',
  robots: { index: false, follow: false },
}

function toneClasses(tone: 'warning' | 'success' | 'neutral') {
  if (tone === 'warning') return 'border-amber-300 bg-amber-50'
  if (tone === 'success') return 'border-emerald-300 bg-emerald-50'
  return 'border-sky-300 bg-sky-50'
}

export default function RefundPolicyPdfPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb] px-4 py-6 print:bg-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <nav
          className="mb-4 flex items-center gap-2 text-xs text-gray-500 print:hidden"
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
          <Link href="/legal/refund-policy" className="hover:text-[#039BE5]">
            Refund Policy
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-gray-900">PDF View</span>
        </nav>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-sm text-slate-600">
            PDF-style document view. Use your browser&apos;s print dialog to save as PDF.
          </div>
          <div className="flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href="/legal/refund-policy"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#039BE5] hover:text-[#039BE5]"
            >
              Back to Page
            </Link>
          </div>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-[#d7e6f7] bg-white shadow-[0_30px_90px_rgba(18,49,95,0.15)] print:rounded-none print:border-0 print:shadow-none">
          <header className="border-b border-[#d7e6f7] bg-[linear-gradient(135deg,#f8fbff_0%,#edf4fd_100%)] px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Logo variant="full" size="lg" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4e89]">
                    Controlled Legal Document
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    Refund &amp; Returns Policy
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Structured for affiliate referrals and third-party marketplace POD publishing.
                    External marketplaces and sellers govern order-level returns and refund
                    outcomes.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:min-w-[280px]">
                <div className="rounded-2xl border border-[#c8daf1] bg-white p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Document Control
                  </p>
                  <dl className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between gap-4">
                      <dt className="font-semibold text-slate-500">Doc ID</dt>
                      <dd>{REFUND_POLICY_DOCUMENT_ID}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-semibold text-slate-500">Version</dt>
                      <dd>{REFUND_POLICY_VERSION}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-semibold text-slate-500">Effective</dt>
                      <dd>{REFUND_POLICY_EFFECTIVE_DATE}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-semibold text-slate-500">Reviewed</dt>
                      <dd>{REFUND_POLICY_LAST_UPDATED}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-[#c8daf1] bg-[#f7fbff] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    ISO-Style Formatting Note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    This layout uses an ISO-style document control format for structured legal
                    presentation. It does not represent certification under any ISO standard.
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="border-b border-[#d7e6f7] bg-slate-950 px-6 py-4 text-white sm:px-8">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                NEXQON HOLDINGS
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Affiliate + Marketplace POD
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Contact: {REFUND_POLICY_CONTACT_EMAIL}
              </span>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-b border-[#e6eef8] bg-[#f8fbff] px-6 py-6 lg:border-b-0 lg:border-r print:hidden">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                Sections
              </p>
              <ol className="mt-4 space-y-2">
                {REFUND_POLICY_SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white hover:text-[#039BE5]"
                    >
                      <span className="mr-2 font-bold text-slate-400">{index + 1}.</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="px-6 py-6 sm:px-8">
              {REFUND_POLICY_SECTIONS.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8 border-b border-[#edf2f7] py-6 last:border-b-0"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12315f] text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm leading-7 text-slate-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}

                    {section.bullets && (
                      <ul className="space-y-2 rounded-2xl border border-[#e5edf7] bg-[#fafcff] p-4">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#039BE5]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.callout && (
                      <div className={`rounded-2xl border p-4 ${toneClasses(section.callout.tone)}`}>
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-700">
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
                </section>
              ))}
            </div>
          </div>

          <footer className="border-t border-[#d7e6f7] bg-[#f8fbff] px-6 py-5 text-xs text-slate-500 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>
                © 2026 NEXQON HOLDINGS | CloudBasket | Policy reviewed {REFUND_POLICY_LAST_UPDATED}
              </p>
              <p>{REFUND_POLICY_DOCUMENT_ID}</p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  )
}
