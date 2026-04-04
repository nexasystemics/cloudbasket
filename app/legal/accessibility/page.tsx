// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/accessibility/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import PrintButton from './PrintButton'

export const metadata: Metadata = {
  title: 'Accessibility Statement | CloudBasket',
  description:
    'CloudBasket accessibility statement covering WCAG 2.1 AA targets, known limitations, testing, and accessibility feedback channels.',
  alternates: {
    canonical: 'https://www.cloudbasket.co/legal/accessibility',
  },
  robots: { index: true, follow: true },
}

const EFFECTIVE_DATE = '02 April 2026'
const VERSION = '1.0'
const DOCUMENT_ID = 'ACCESSIBILITY-STATEMENT-FINAL'
const STATEMENT_URL = 'www.cloudbasket.co/legal/accessibility'
const LEGAL_EMAIL = 'info@cloudbasket.co'
const SUMMARY =
  'CloudBasket is committed to making our website accessible to all users, including people with disabilities. We are working to meet WCAG 2.1 Level AA accessibility standards. If you encounter any difficulty using our site, please contact us and we will help you.'

const STANDARDS = [
  'WCAG 2.1 Level AA (target)',
  'IS 17802:2022 aligned',
] as const

const LAWS = [
  'Rights of Persons with Disabilities Act 2016',
  'IT Act 2000',
] as const

type TableSection = {
  headers: readonly string[]
  rows: ReadonlyArray<readonly string[]>
}

type CalloutSection = {
  title: string
  body: string
  tone: 'warning' | 'success' | 'neutral'
}

type ContentSection = {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
  table?: TableSection
  callout?: CalloutSection
}

const SECTIONS: readonly ContentSection[] = [
  {
    id: 'our-commitment',
    title: 'Our Commitment',
    paragraphs: [
      'NEXQON HOLDINGS is committed to ensuring that CloudBasket (www.cloudbasket.co) is accessible to people with disabilities in accordance with the Rights of Persons with Disabilities Act, 2016 and aligned with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.',
      'We believe accessible design benefits all users, not only those with disabilities, and we treat accessibility as an ongoing engineering and content priority rather than a one-time checkbox exercise.',
    ],
  },
  {
    id: 'conformance-status',
    title: 'Conformance Status',
    paragraphs: [
      'CloudBasket is currently partially conformant with our target accessibility benchmarks. Partially conformant means that some parts of the content do not yet fully conform to the relevant accessibility standard.',
    ],
    table: {
      headers: ['Standard', 'Target Level', 'Current Status'],
      rows: [
        ['WCAG 2.1', 'Level AA', 'Partially Conformant — remediation in progress'],
        ['WCAG 2.2', 'Level AA (new criteria)', 'Under review — target Q4 2026'],
        ['IS 17802:2022 (India)', 'WCAG-aligned', 'Partially Conformant'],
        ['EN 301 549 (EU reference)', 'WCAG 2.1 AA', 'Referenced — not mandated for Indian sites'],
      ],
    },
  },
  {
    id: 'measures-we-take',
    title: 'Measures We Take',
    paragraphs: [
      'CloudBasket uses a combination of technical, design, and content practices to improve accessibility across the site.',
    ],
    bullets: [
      'Semantic HTML with logical heading structures for screen-reader navigation',
      'Alt text on product images fetched through the integration layer',
      'Keyboard navigation support across core navigation, search, and product pages',
      'Colour contrast designed to meet WCAG 2.1 minimum contrast targets',
      'Visible focus indicators on interactive elements',
      'Structured price comparison tables with proper table markup',
      'Responsive layouts for mobile, tablet, and desktop',
      'No content with automatic time limits requiring user response',
    ],
  },
  {
    id: 'known-limitations',
    title: 'Known Limitations',
    paragraphs: [
      'The following limitations are known and are being addressed as part of the ongoing accessibility roadmap.',
    ],
    table: {
      headers: ['Area', 'Limitation', 'Planned Fix'],
      rows: [
        ['Hover-based comparison tooltips', 'No keyboard-dismiss mechanism', 'Q4 2026 — keyboard-dismiss remediation'],
        ['Filter and sort controls', 'ARIA-controls not fully implemented on all filter combinations', 'Q3 2026'],
        ['Product carousel and image galleries', 'Keyboard navigation improvement needed', 'Q3 2026'],
        ['Third-party content', 'Third-party accessibility is outside our direct control', 'Raise issues with merchant partners'],
        ['WCAG 2.2 new criteria', 'Not yet fully audited', 'Q4 2026 audit'],
      ],
    },
  },
  {
    id: 'wcag-key-criteria',
    title: 'WCAG 2.1 Level AA — Key Criteria Status',
    paragraphs: [
      'The table below summarises key accessibility success criteria and the current implementation status on CloudBasket.',
    ],
    table: {
      headers: ['SC', 'Criterion', 'Status', 'Notes'],
      rows: [
        ['1.1.1', 'Non-text content (alt text)', 'Partially Supports', 'Static images supported; API-fetched image handling in progress'],
        ['1.3.1', 'Info and relationships (semantic markup)', 'Supports', 'Semantic structure in use'],
        ['1.4.3', 'Contrast (minimum)', 'Supports', 'Design target exceeds minimum contrast ratio'],
        ['1.4.4', 'Resize text', 'Supports', 'Responsive design'],
        ['2.1.1', 'Keyboard accessible', 'Partially Supports', 'Core pages supported; filter work in progress'],
        ['2.1.2', 'No keyboard trap', 'Supports', 'No known traps'],
        ['2.4.1', 'Bypass blocks (skip nav)', 'Partially Supports', 'Skip-to-main link planned'],
        ['2.4.3', 'Focus order', 'Supports', 'No known issue'],
        ['2.4.6', 'Headings and labels', 'Supports', 'Structured labels and headings'],
        ['2.4.7', 'Focus visible', 'Supports', 'Visible focus indicators present'],
        ['3.1.1', 'Language of page', 'Supports', 'lang="en" declared'],
        ['3.3.1', 'Error identification', 'Supports', 'Form errors identified clearly'],
        ['4.1.2', 'Name, role, value', 'Partially Supports', 'ARIA improvements in progress'],
      ],
    },
  },
  {
    id: 'rpwd-act-statement',
    title: 'RPWD Act 2016 — Statement',
    paragraphs: [
      'CloudBasket, operated by NEXQON HOLDINGS, affirms its commitment to the Rights of Persons with Disabilities Act, 2016, including the principle of non-discrimination and reasonable accommodation in digital services.',
      'We treat WCAG 2.1-based conformance as our core benchmark for web accessibility under the RPwD framework. Accessibility-related complaints may be escalated to the relevant State Commissioner for Persons with Disabilities under Section 54 of the RPwD Act where appropriate.',
    ],
  },
  {
    id: 'testing-and-audit',
    title: 'Testing and Audit',
    paragraphs: [
      'CloudBasket uses a mix of automated and manual testing to monitor accessibility performance and remediation progress.',
    ],
    table: {
      headers: ['Method', 'Frequency', 'Owner'],
      rows: [
        ['Automated (Lighthouse / axe-core)', 'Every major release', 'E4 — Audit Engineer'],
        ['Manual keyboard-only testing', 'Quarterly', 'E5 — QA Engineer'],
        ['Screen reader testing (NVDA / VoiceOver)', 'Quarterly', 'E5 — QA Engineer'],
        ['Third-party accessibility audit', 'Annually from 2027', 'IBF commission'],
        ['WCAG 2.2 audit', 'Q4 2026', 'E4 + E5'],
      ],
    },
  },
  {
    id: 'feedback-and-contact',
    title: 'Feedback and Contact',
    paragraphs: [
      'We welcome feedback on the accessibility of CloudBasket. If you experience any barrier, please contact us using the accessibility channel below.',
      `Accessibility Contact: NEXQON HOLDINGS — CloudBasket. Email: ${LEGAL_EMAIL}. Website: www.cloudbasket.co.`,
      'We aim to respond to accessibility feedback within 5 business days and to resolve issues within 30 days where technically feasible.',
      'Unresolved accessibility complaints may also be raised with the Grievance Officer at grievance@cloudbasket.co.',
    ],
    callout: {
      title: 'Response target',
      body: 'Accessibility feedback is targeted for response within 5 business days and issue resolution within 30 days where technically feasible.',
      tone: 'success',
    },
  },
  {
    id: 'review-schedule',
    title: 'Review Schedule',
    paragraphs: [
      'Accessibility work is reviewed against a recurring schedule to ensure remediation and audits continue after launch.',
    ],
    table: {
      headers: ['Review', 'Date', 'Owner'],
      rows: [
        ['Next scheduled review', '02 April 2027', 'E2 + E4'],
        ['WCAG 2.2 audit', 'Q4 2026', 'E4 + E5'],
        ['Post-major-redesign review', 'As required', 'E4'],
      ],
    },
  },
]

const RELATED_LINKS = [
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/legal/dmca', label: 'DMCA & IP Policy' },
] as const

function toneClasses(tone: 'warning' | 'success' | 'neutral') {
  if (tone === 'warning') {
    return 'border-amber-200 bg-amber-50 text-amber-950'
  }

  if (tone === 'success') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-950'
  }

  return 'border-sky-200 bg-sky-50 text-sky-950'
}

function TableBlock({ headers, rows }: TableSection) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--cb-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--cb-surface-2)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className="border-t border-[var(--cb-border)]">
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${index}`}
                  className={`px-4 py-3 ${
                    index === 0 ? 'font-semibold text-[var(--cb-text-primary)]' : 'text-[var(--cb-text-secondary)]'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AccessibilityPage() {
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
        <span className="font-semibold text-[var(--cb-text-primary)]">Accessibility Statement</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Accessibility Statement</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Effective Date: {EFFECTIVE_DATE} · Version: {VERSION}
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            Document ID: {DOCUMENT_ID} · URL: {STATEMENT_URL}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 print:hidden">
          <PrintButton className="cb-btn cb-btn-ghost gap-2 text-sm" label="Download PDF" />
          <Link href="/" className="cb-btn cb-btn-ghost gap-2 text-sm">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-surface-2)] p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Standards and Laws
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STANDARDS.map((standard) => (
            <span
              key={standard}
              className="rounded-full border border-[var(--cb-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--cb-text-secondary)]"
            >
              {standard}
            </span>
          ))}
          {LAWS.map((law) => (
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
        <p className="mt-3 text-sm leading-7 text-[var(--cb-text-secondary)]">{SUMMARY}</p>
      </section>

      <nav className="cb-card mb-10 p-6 print:hidden" aria-label="Table of Contents">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Table of Contents
        </p>
        <ol className="space-y-1.5">
          {SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-sm text-skyline-primary hover:underline">
                {index + 1}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-8">
        {SECTIONS.map((section, index) => (
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

                  {section.table ? <TableBlock {...section.table} /> : null}

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
              {RELATED_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-skyline-primary hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="max-w-sm text-sm text-[var(--cb-text-secondary)]">
            <p className="font-black text-[var(--cb-text-primary)]">Accessibility Contact</p>
            <p className="mt-2">NEXQON HOLDINGS — CloudBasket</p>
            <a href={`mailto:${LEGAL_EMAIL}`} className="block text-skyline-primary hover:underline">
              {LEGAL_EMAIL}
            </a>
            <p className="mt-1">www.cloudbasket.co</p>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--cb-border)] bg-white p-5 print:hidden">
        <div>
          <p className="text-sm font-black text-[var(--cb-text-primary)]">
            Need a printable version or want to return to shopping?
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            This statement explains accessibility targets, known limitations, audits, and feedback channels for CloudBasket.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrintButton className="cb-btn cb-btn-primary gap-2" label="Download PDF" />
          <Link href="/" className="cb-btn cb-btn-ghost gap-2">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
