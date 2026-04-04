// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/dmca/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import PrintButton from './PrintButton'

export const metadata: Metadata = {
  title: 'DMCA & IP Policy | CloudBasket',
  description:
    'CloudBasket DMCA and intellectual property policy covering copyright notices, trademark complaints, intermediary status, and takedown procedures.',
  alternates: {
    canonical: 'https://www.cloudbasket.co/legal/dmca',
  },
  robots: { index: true, follow: true },
}

const EFFECTIVE_DATE = '02 April 2026'
const VERSION = '1.0'
const DOCUMENT_ID = 'DMCA-IP-POLICY-FINAL'
const POLICY_URL = 'www.cloudbasket.co/legal/dmca'
const LEGAL_EMAIL = 'info@cloudbasket.co'
const GRIEVANCE_EMAIL = 'grievance@cloudbasket.co'
const DMCA_AGENT_NAME = 'IBF / NEXQON HOLDINGS'
const SUMMARY =
  'CloudBasket aggregates product listings and prices from Amazon, Flipkart, and other merchants via their official APIs. We respect intellectual property rights. If you believe your copyrighted work or trademark is being used without authorisation on our platform, this page explains how to notify us and what we will do. We act on valid notices within 36 hours.'

const LAWS_APPLIED = [
  'Copyright Act 1957 (India)',
  'IT Act 2000 s.79',
  'IT Rules 2021',
  'Trade Marks Act 1999',
  'DMCA 17 U.S.C. § 512',
] as const

type TableSection = {
  headers: readonly string[]
  rows: ReadonlyArray<readonly [string, string]>
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
  orderedBullets?: string[]
  table?: TableSection
  callout?: CalloutSection
}

const SECTIONS: readonly ContentSection[] = [
  {
    id: 'scope',
    title: 'Scope',
    paragraphs: [
      'This policy applies to all intellectual property claims relating to content displayed on CloudBasket (www.cloudbasket.co), operated by NEXQON HOLDINGS, Kadapa, Andhra Pradesh 516002, India.',
    ],
    bullets: [
      'Product images and descriptions fetched via Amazon PA-API and Flipkart Affiliate API',
      'Blog articles, buying guides, and editorial content',
      'Category images and UI assets',
      'Any future user-generated content such as reviews, ratings, or comments',
    ],
  },
  {
    id: 'how-we-use-content',
    title: 'How We Use Content — API and Affiliate Licences',
    paragraphs: [
      'Product images, titles, descriptions, and pricing data from Amazon are fetched dynamically via the Amazon Product Advertising API (PA-API). This use is authorised under the Amazon Associates Program Operating Agreement, which permits display of Product Images as provided for affiliate promotion purposes. CloudBasket does not download, store, or re-host Amazon product images locally.',
      'Product data from Flipkart is fetched via the Flipkart Affiliate API under the Flipkart Affiliate Program Agreement, which authorises display of affiliate data for promotional purposes. Dynamic fetching does not constitute copyright infringement where covered by programme terms.',
      'Blog and category images are sourced from Unsplash, Pexels, Pixabay, or commercial-rights AI tools. Attribution is provided where required.',
      'CloudBasket displays brand names and merchant logos only as necessary to identify products in listings. This is intended to align with nominative fair use principles and applicable programme trademark guidelines. No brand endorsement is implied.',
    ],
  },
  {
    id: 'intermediary-status',
    title: 'Intermediary Status — Indian Law (IT Act 2000, Section 79)',
    paragraphs: [
      'CloudBasket qualifies as an intermediary under Section 2(w) of the Information Technology Act, 2000. CloudBasket does not initiate, select beyond responding to user queries, or modify third-party product content. Accordingly, NEXQON HOLDINGS claims safe harbour protection under Section 79 from liability for third-party copyrighted content displayed via API feeds.',
      'Safe harbour is maintained by publishing this policy, appointing a grievance officer, and acting expeditiously on valid notices.',
    ],
    bullets: [
      'Publishing this IP Policy and acting on takedown notices expeditiously',
      'Appointing a Grievance Officer per IT Rules 2021 Rule 3(2)',
      'Removing or disabling infringing content within 36 hours of receiving a valid notice',
    ],
  },
  {
    id: 'dmca-safe-harbour',
    title: 'DMCA Safe Harbour — US Visitors (17 U.S.C. § 512)',
    paragraphs: [
      'CloudBasket is accessible to users in the United States and therefore maintains compliance with the Digital Millennium Copyright Act (DMCA), Section 512 to preserve safe harbour protection for US-origin copyright claims.',
      `${DMCA_AGENT_NAME}, NEXQON HOLDINGS, Kadapa, Andhra Pradesh – 516002, India. Email: ${LEGAL_EMAIL}.`,
      `DMCA notices should be sent to ${LEGAL_EMAIL}.`,
    ],
    orderedBullets: [
      'Your physical or electronic signature, or that of a person authorised to act on behalf of the copyright owner',
      'Identification of the copyrighted work claimed to have been infringed',
      'Identification of the material on CloudBasket claimed to be infringing, including the specific URL or URLs',
      'Your contact information including name, address, telephone number, and email address',
      'A statement that you have a good faith belief that use of the material is not authorised by the copyright owner, its agent, or the law',
      'A statement under penalty of perjury that the information in your notice is accurate and that you are the copyright owner or authorised to act on the owner behalf',
    ],
    callout: {
      title: 'Operational requirement',
      body: 'The designated DMCA agent should be registered at copyright.gov/dmca before go-live.',
      tone: 'warning',
    },
  },
  {
    id: 'counter-notice',
    title: 'Counter-Notice Procedure (DMCA Section 512(g))',
    paragraphs: [
      'If you believe your content was removed in error, you may submit a counter-notice. Upon receipt of a valid counter-notice, CloudBasket may forward it to the original complainant. If no lawsuit is filed within 10 to 14 business days, the content may be restored.',
    ],
    orderedBullets: [
      'Your physical or electronic signature',
      'Identification of the removed material and its location before removal',
      'A statement under penalty of perjury that you believe the material was removed by mistake or misidentification',
      'Your name, address, telephone number, and a statement consenting to the jurisdiction of US federal courts, or Indian courts for Indian residents',
    ],
  },
  {
    id: 'indian-copyright-takedown',
    title: 'Indian Copyright Takedown Procedure',
    paragraphs: [
      `For claims under the Copyright Act 1957 and IT Intermediary Guidelines 2021, submit your notice to ${LEGAL_EMAIL} or ${GRIEVANCE_EMAIL}.`,
      'A valid notice must identify the allegedly infringing content and explain your relationship to the original work.',
    ],
    bullets: [
      'Your name, contact details, and relationship to the work',
      'Identification of the allegedly infringing content with specific URLs',
      'Description of the original work you own or represent',
      'A statement that you have a good faith belief the use is infringing',
    ],
    callout: {
      title: 'Response timeline',
      body: 'Acknowledgement within 24 hours and removal or disablement within 36 hours of a valid notice.',
      tone: 'neutral',
    },
  },
  {
    id: 'trademark-policy',
    title: 'Trademark Policy',
    paragraphs: [
      'CloudBasket uses merchant and brand names solely to identify products in price-comparison listings. This is intended to constitute nominative fair use under Indian trademark law and applicable case law.',
      `If you are a trademark owner and believe your mark is being used in a way that causes consumer confusion or implies false endorsement, submit a notice to ${LEGAL_EMAIL}.`,
    ],
    bullets: [
      'Trademark registration details, including number and jurisdiction',
      'The specific URLs on CloudBasket where the alleged infringement occurs',
      'A description of the harm or confusion caused',
    ],
  },
  {
    id: 'repeat-infringer-policy',
    title: 'Repeat Infringer Policy',
    paragraphs: [
      'CloudBasket maintains a record of all IP notices received. In accordance with DMCA Section 512(i) and IT Rules 2021, CloudBasket may disable access to relevant content or data sources that are subject to repeated, valid infringement notices.',
    ],
  },
  {
    id: 'user-generated-content',
    title: 'User-Generated Content (Future Policy)',
    paragraphs: [
      'Should CloudBasket introduce user reviews, ratings, or comments in the future, users will be required to warrant that their content does not infringe third-party rights and to grant CloudBasket a non-exclusive licence to use and display that content for platform operation.',
      'Infringing user-generated content would be subject to the same 24-hour acknowledgement and 36-hour removal timeline. Records of moderation would be retained for 180 days per applicable intermediary rules.',
    ],
  },
  {
    id: 'penalties-for-infringement',
    title: 'Penalties for Infringement',
    paragraphs: [
      'The legal and regulatory exposure below summarises the consequences that may apply under different regimes.',
    ],
    table: {
      headers: ['Regime', 'Penalty'],
      rows: [
        ['Copyright Act 1957 (India) — Civil', 'Damages, injunction, account of profits (Section 55)'],
        ['Copyright Act 1957 (India) — Criminal', 'Up to 3 years imprisonment plus ₹2 lakh fine; enhanced for commercial scale'],
        ['IT Act 2000 — Loss of Safe Harbour', 'Full publisher liability; potential government blocking under Section 69A'],
        ['DMCA (US) — Statutory Damages', 'USD 750 to USD 30,000 per work; up to USD 150,000 for wilful infringement'],
      ],
    },
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    paragraphs: [
      'This policy is governed by the laws of India. Indian law is the primary governing framework. For US visitors, DMCA compliance is maintained to preserve safe harbour under 17 U.S.C. § 512.',
      'Any dispute shall be subject to the exclusive jurisdiction of courts in Kadapa, Andhra Pradesh, India.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    paragraphs: [
      'Grievance Officer / DMCA Agent: NEXQON HOLDINGS, Kadapa, Andhra Pradesh – 516002, India.',
      `IP / DMCA Email: ${LEGAL_EMAIL}`,
      `Grievance Email: ${GRIEVANCE_EMAIL}`,
      'Response: Acknowledged within 24 hours · Actioned within 36 hours',
    ],
    callout: {
      title: 'Primary contact channel',
      body: `${DMCA_AGENT_NAME} is listed here as the designated DMCA contact for CloudBasket.`,
      tone: 'success',
    },
  },
]

const RELATED_LINKS = [
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/legal/terms', label: 'Terms of Service' },
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

export default function DmcaPage() {
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
        <span className="font-semibold text-[var(--cb-text-primary)]">DMCA &amp; IP Policy</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">DMCA &amp; Intellectual Property Policy</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Effective Date: {EFFECTIVE_DATE} · Version: {VERSION}
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            Document ID: {DOCUMENT_ID} · URL: {POLICY_URL}
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
          Laws Applied
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LAWS_APPLIED.map((law) => (
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

                  {section.orderedBullets ? (
                    <ol className="ml-4 list-decimal space-y-1.5">
                      {section.orderedBullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ol>
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
            <p className="font-black text-[var(--cb-text-primary)]">IP &amp; Grievance Contact</p>
            <p className="mt-2">{DMCA_AGENT_NAME}</p>
            <p>NEXQON HOLDINGS</p>
            <p>Kadapa, Andhra Pradesh – 516002, India</p>
            <a href={`mailto:${LEGAL_EMAIL}`} className="block text-skyline-primary hover:underline">
              {LEGAL_EMAIL}
            </a>
            <a href={`mailto:${GRIEVANCE_EMAIL}`} className="block text-skyline-primary hover:underline">
              {GRIEVANCE_EMAIL}
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
            This policy explains copyright, trademark, notice, and takedown procedures for CloudBasket.
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
