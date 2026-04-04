// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/disclaimer/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import {
  DISCLAIMER_DOCUMENT_ID,
  DISCLAIMER_EFFECTIVE_DATE,
  DISCLAIMER_LAST_UPDATED,
  DISCLAIMER_LAWS_APPLIED,
  DISCLAIMER_RELATED_LINKS,
  DISCLAIMER_SECTIONS,
  DISCLAIMER_SUMMARY,
  DISCLAIMER_URL,
  DISCLAIMER_VERSION,
  LEGAL_EMAIL,
} from './data'

export const metadata: Metadata = {
  title: 'Disclaimer | CloudBasket',
  description:
    'CloudBasket legal disclaimer covering pricing, availability, affiliate disclosures, warranties, intermediary status, and liability limits under Indian law.',
  alternates: {
    canonical: 'https://www.cloudbasket.co/legal/disclaimer',
  },
  robots: { index: true, follow: true },
}

function toneClasses(tone: 'warning' | 'success' | 'neutral') {
  if (tone === 'warning') {
    return 'border-amber-200 bg-amber-50 text-amber-950'
  }

  if (tone === 'success') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-950'
  }

  return 'border-sky-200 bg-sky-50 text-sky-950'
}

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-[var(--cb-text-muted)]"
      >
        <Link href="/" className="hover:text-skyline-primary hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/legal" className="hover:text-skyline-primary hover:underline">
          Legal
        </Link>
        <span>/</span>
        <span className="font-semibold text-[var(--cb-text-primary)]">Disclaimer</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Disclaimer</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Effective Date: {DISCLAIMER_EFFECTIVE_DATE} · Last Updated: {DISCLAIMER_LAST_UPDATED}
            {' '}· Version: {DISCLAIMER_VERSION}
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            Document ID: {DISCLAIMER_DOCUMENT_ID} · URL: {DISCLAIMER_URL}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <Link
            href="/legal/disclaimer/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn cb-btn-ghost gap-2 text-sm"
          >
            Download PDF
          </Link>
          <Link href="/" className="cb-btn cb-btn-ghost gap-2 text-sm">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-surface-2)] p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Laws Applied
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DISCLAIMER_LAWS_APPLIED.map((law) => (
            <span
              key={law}
              className="rounded-full border border-[var(--cb-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--cb-text-secondary)]"
            >
              {law}
            </span>
          ))}
        </div>
      </div>

      <section className="mb-8 rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[#c2410c]">
          Plain Language Summary
        </p>
        <p className="mt-3 text-sm leading-7 text-[var(--cb-text-secondary)]">
          {DISCLAIMER_SUMMARY}
        </p>
      </section>

      <nav className="cb-card mb-10 p-6 print:hidden" aria-label="Table of Contents">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Table of Contents
        </p>
        <ol className="space-y-1.5">
          {DISCLAIMER_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-sm text-skyline-primary hover:underline">
                {index + 1}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-8">
        {DISCLAIMER_SECTIONS.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-8 border-b border-[var(--cb-border)] pb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-skyline-primary text-sm font-black text-white">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black tracking-tight">{section.title}</h2>

                <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--cb-text-secondary)]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {section.bullets ? (
                    <ul className="ml-4 list-disc space-y-1.5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}

                  {section.callout ? (
                    <div
                      className={`rounded-xl border px-4 py-4 text-sm leading-6 ${toneClasses(section.callout.tone)}`}
                    >
                      <p className="text-xs font-black uppercase tracking-widest">
                        {section.callout.title}
                      </p>
                      <p className="mt-2">{section.callout.body}</p>
                    </div>
                  ) : null}

                  {section.legalBasis ? (
                    <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                      Legal basis: {section.legalBasis}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-surface-2)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
              Related Legal Documents
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {DISCLAIMER_RELATED_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-skyline-primary hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="max-w-sm text-sm text-[var(--cb-text-secondary)]">
            <p className="font-black text-[var(--cb-text-primary)]">Legal Contact</p>
            <p className="mt-2">NEXQON HOLDINGS</p>
            <p>Kadapa, Andhra Pradesh – 516002, India</p>
            <a href={`mailto:${LEGAL_EMAIL}`} className="text-skyline-primary hover:underline">
              {LEGAL_EMAIL}
            </a>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--cb-border)] bg-white p-5 print:hidden">
        <div>
          <p className="text-sm font-black text-[var(--cb-text-primary)]">
            Need a printable version or want to return to shopping?
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            This disclaimer is published for transparency, affiliate compliance, and legal notice.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/legal/disclaimer/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn cb-btn-primary gap-2"
          >
            Open PDF View
          </Link>
          <Link href="/" className="cb-btn cb-btn-ghost gap-2">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
