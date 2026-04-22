// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/grievance-officer/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import PrintButton from './PrintButton'

export const metadata: Metadata = {
  title: 'Grievance Officer | CloudBasket',
  description:
    'CloudBasket grievance officer page covering officer details, legal basis, complaint responsibilities, and response timelines under Indian intermediary rules.',
  alternates: {
    canonical: 'https://www.cloudbasket.co/legal/grievance-officer',
  },
  robots: { index: true, follow: true },
}

const PAGE_TITLE = 'Grievance Officer — CloudBasket'
const DOCUMENT_ID = 'GRIEVANCE-OFFICER-PAGE-2026'
const PAGE_URL = 'www.cloudbasket.co/legal/grievance-officer'
const GRIEVANCE_OFFICER_NAME = 'S. Khaleel Ahmed'
const ORGANISATION = 'NEXQON HOLDINGS'
const ADDRESS = 'Kadapa, Andhra Pradesh 516002, India'
const EMAIL = 'grievance@cloudbasket.co'
const SUMMARY =
  'CloudBasket has appointed a Grievance Officer under Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. This page identifies the grievance contact channel, outlines complaint responsibilities, and states the response timelines applicable to CloudBasket.'

const LEGAL_BASIS = [
  'IT Act 2000',
  'IT Intermediary Guidelines 2021 Rule 3(2)',
  'DPDP Act 2023',
] as const

type CalloutSection = {
  title: string
  body: string
  tone: 'warning' | 'success' | 'neutral'
}

type TableSection = {
  headers: readonly string[]
  rows: ReadonlyArray<readonly [string, string]>
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
    id: 'appointment',
    title: 'Appointment',
    paragraphs: [
      'CloudBasket (www.cloudbasket.co), operated by NEXQON HOLDINGS, Kadapa, Andhra Pradesh 516002, India, has appointed a Grievance Officer under Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.',
    ],
  },
  {
    id: 'grievance-officer-details',
    title: 'Grievance Officer Details',
    paragraphs: [
      'The details below identify the grievance channel currently designated for CloudBasket.',
    ],
    table: {
      headers: ['Field', 'Details'],
      rows: [
        ['Name', GRIEVANCE_OFFICER_NAME],
        ['Organisation', ORGANISATION],
        ['Address', ADDRESS],
        ['Email', EMAIL],
      ],
    },
    callout: {
      title: 'IBF to confirm — name not yet finalised',
      body: 'The officer name shown is a placeholder. The actual grievance officer name must be confirmed by the IBF before this page goes live.',
      tone: 'warning',
    },
  },
  {
    id: 'responsibilities',
    title: 'Responsibilities',
    paragraphs: [
      'The Grievance Officer channel is intended to handle user complaints and regulatory-response obligations connected to CloudBasket operations.',
    ],
    bullets: [
      'Receiving complaints about objectionable, infringing, or unlawful content',
      'Addressing privacy and data protection grievances under the DPDP Act 2023',
      'Coordinating content removal under the IT Rules 2021',
    ],
  },
  {
    id: 'response-timelines',
    title: 'Response Timelines',
    paragraphs: [
      'CloudBasket applies the following response targets for grievances received through the designated grievance channel.',
    ],
    bullets: [
      'Acknowledgement: within 24 hours of receipt',
      'Action (removal or disablement): within 36 hours where applicable under IT Rules 2021, Rule 3(2)(c)',
    ],
    callout: {
      title: 'Operational target',
      body: 'These timelines apply to valid grievance notices and content-related complaints falling within the applicable intermediary rules.',
      tone: 'neutral',
    },
  },
  {
    id: 'legal-basis',
    title: 'Legal Basis',
    paragraphs: [
      'The grievance function described on this page is grounded in the following legal framework.',
    ],
    bullets: [
      'IT Act 2000',
      'IT Intermediary Guidelines 2021 Rule 3(2)',
      'DPDP Act 2023',
    ],
  },
]

const RELATED_LINKS = [
  { href: '/legal/dmca', label: 'DMCA & IP Policy' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/accessibility', label: 'Accessibility Statement' },
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
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t border-[var(--cb-border)]">
              <td className="px-4 py-3 font-semibold text-[var(--cb-text-primary)]">{label}</td>
              <td className="px-4 py-3 text-[var(--cb-text-secondary)]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function GrievanceOfficerPage() {
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
        <span className="font-semibold text-[var(--cb-text-primary)]">Grievance Officer</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">{PAGE_TITLE}</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Designated grievance contact and complaint-handling channel for CloudBasket.
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            Document ID: {DOCUMENT_ID} · URL: {PAGE_URL}
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
          Legal Basis
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEGAL_BASIS.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--cb-border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--cb-text-secondary)]"
            >
              {item}
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
            <p className="font-black text-[var(--cb-text-primary)]">Grievance Contact</p>
            <p className="mt-2">{GRIEVANCE_OFFICER_NAME}</p>
            <p>{ORGANISATION}</p>
            <p>{ADDRESS}</p>
            <a href={`mailto:${EMAIL}`} className="block text-skyline-primary hover:underline">
              {EMAIL}
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
            This page identifies the grievance channel, duties, and response timelines applicable to CloudBasket.
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
