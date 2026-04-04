// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/affiliate-disclosure/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

import PrintButton from './PrintButton'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | CloudBasket',
  description:
    'CloudBasket affiliate disclosure covering Amazon Associates, Flipkart, CJ Affiliate, Google AdSense, commercial relationships, and disclosure compliance.',
  alternates: {
    canonical: 'https://www.cloudbasket.co/legal/affiliate-disclosure',
  },
  robots: { index: true, follow: true },
}

const EFFECTIVE_DATE = '01 April 2026'
const LAST_UPDATED = '01 April 2026'
const VERSION = '1.0'
const DOCUMENT_ID = 'AFFILIATE-DISCLOSURE-FINAL'
const JURISDICTION = 'India (primary)'
const LEGAL_EMAIL = 'info@cloudbasket.co'
const AMAZON_TAG = 'cloudbasket-21'
const SUMMARY =
  'CloudBasket earns commissions when you click links on this site and make purchases on external platforms like Amazon and Flipkart. This costs you nothing extra. We disclose all affiliate relationships on this page as required by Indian law and partner program agreements. Our editorial decisions aim to serve your interests, not to push products purely for commission.'

const LAWS_APPLIED = [
  'Consumer Protection Act 2019',
  'E-Commerce Rules 2020',
  'IT Act 2000',
  'DPDP Act 2023 + Rules Nov 2025',
  'Amazon Associates OA Oct 2025',
  'ASCI Guidelines',
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
  table?: TableSection
  callout?: CalloutSection
}

const SECTIONS: readonly ContentSection[] = [
  {
    id: 'what-is-affiliate-marketing',
    title: 'What is Affiliate Marketing?',
    paragraphs: [
      'Affiliate marketing is a performance-based commercial arrangement where a website earns a commission by directing users to another company product or service. When you click a specially coded affiliate link on CloudBasket and subsequently make a purchase on the merchant website, CloudBasket may receive a commission from that merchant.',
    ],
    bullets: [
      'Affiliate commissions are paid by merchants from their own marketing budgets.',
      'You pay the exact same price whether or not you arrived via an affiliate link.',
      'CloudBasket commission does not affect the price you pay.',
    ],
  },
  {
    id: 'our-affiliate-relationships',
    title: 'Our Affiliate Relationships',
    paragraphs: [
      'CloudBasket participates in the affiliate and advertising programs listed below.',
    ],
  },
  {
    id: 'amazon-associates-program',
    title: 'Amazon Associates Program',
    paragraphs: [
      'CloudBasket is a participant in the Amazon Associates Program, an affiliate advertising program operated by Amazon India, designed to provide a means for websites to earn advertising fees by advertising and linking to Amazon.in and related Amazon properties.',
    ],
    table: {
      headers: ['Detail', 'Information'],
      rows: [
        ['Tracking Tag', AMAZON_TAG],
        ['Commission Range', 'Varies by product category (typically 0.2% to 9%)'],
        ['Cookie Duration', '24 hours from link click · 90 days if item added to cart'],
        ['Program Operator', 'Amazon India — Amazon Seller Services Private Limited'],
        ['Disclosure Requirement', 'Amazon Associates Operating Agreement, Section 13 (Oct 2025)'],
      ],
    },
    callout: {
      title: 'Mandatory Amazon Disclosure',
      body: 'As an Amazon Associate, CloudBasket earns from qualifying purchases.',
      tone: 'success',
    },
  },
  {
    id: 'flipkart-affiliate-program',
    title: 'Flipkart Affiliate Program',
    paragraphs: [
      'CloudBasket participates in the Flipkart Affiliate Program operated by Flipkart Internet Private Limited.',
    ],
    table: {
      headers: ['Detail', 'Information'],
      rows: [
        ['Commission', 'Varies by product category'],
        ['Cookie Duration', 'As per current Flipkart Affiliate Program terms'],
        ['Program Operator', 'Flipkart Internet Private Limited'],
      ],
    },
    callout: {
      title: 'Operational note',
      body: 'Confirm Flipkart cookie duration and current operating terms via the Flipkart Affiliate Portal before final legal sign-off.',
      tone: 'warning',
    },
  },
  {
    id: 'cj-affiliate',
    title: 'CJ Affiliate (Commission Junction)',
    paragraphs: [
      'CloudBasket participates in affiliate programs managed through CJ Affiliate. Various merchants may be represented through the CJ network depending on category and partner availability.',
    ],
    table: {
      headers: ['Detail', 'Information'],
      rows: [
        ['Merchants', 'Multiple — varies by category'],
        ['Commission Rates', 'Varies by merchant and program'],
        ['Cookie Durations', 'Varies by merchant'],
        ['Program Operator', 'CJ Affiliate (Publicis Groupe)'],
      ],
    },
    callout: {
      title: 'Operational note',
      body: 'Specific CJ merchants should be listed here when they are confirmed via the CJ Affiliate Portal.',
      tone: 'warning',
    },
  },
  {
    id: 'google-adsense',
    title: 'Google AdSense',
    paragraphs: [
      'CloudBasket displays contextual advertisements through Google AdSense, operated by Google LLC. While this is not an affiliate program in the traditional sense, CloudBasket earns revenue when visitors view or interact with eligible advertisements.',
    ],
    table: {
      headers: ['Detail', 'Information'],
      rows: [
        ['Revenue Model', 'CPM (impressions) and CPC (clicks)'],
        ['Ad Personalisation', 'Contextual · personalisation subject to your cookie consent choices'],
        ['Non-Personalised Ads', 'Shown to users who decline advertising cookies'],
        ['Program Operator', 'Google LLC'],
      ],
    },
  },
  {
    id: 'how-this-affects-you',
    title: 'How This Affects You',
    paragraphs: [
      'Affiliate commissions are paid exclusively by the merchant from their own marketing budget. The price you pay on the merchant website is intended to remain identical whether or not you arrived via a CloudBasket affiliate link. In some cases, CloudBasket may feature exclusive deals or discount codes that save you money.',
      'Prices displayed on CloudBasket are sourced from affiliate data feeds and partner APIs. These prices may not reflect real-time availability or pricing changes. Always confirm the final price on the merchant website before completing any purchase.',
      'CloudBasket aims to provide genuinely useful product information. Products featured on CloudBasket may be selected partly based on affiliate programme availability, and commission rates may influence which merchants or products are displayed prominently. We do not guarantee that featured products represent the best available option in every case.',
      'CloudBasket does not accept payment for specific product reviews, editorial placements, or rankings beyond the standard affiliate commissions disclosed in this document. Editorial decisions are intended to prioritise user value.',
    ],
  },
  {
    id: 'data-tracking-notice',
    title: 'Data and Tracking Notice (DPDP Act 2023 Compliance)',
    paragraphs: [
      'In accordance with the Digital Personal Data Protection Act 2023 and the DPDP Rules (November 2025), CloudBasket discloses the following regarding data processing associated with affiliate links.',
    ],
    bullets: [
      'Affiliate link tracking may place a tracking cookie on your device to attribute resulting purchases for commission purposes.',
      'Visit data is processed only to the extent required for commission attribution. CloudBasket does not collect, store, or further process your personal data solely through the act of clicking an affiliate link.',
      'CloudBasket is a zero-account platform. No user registration is required.',
      'You may withdraw consent at any time via the Cookie Settings link in the site footer. Withdrawing cookie consent will prevent affiliate tracking cookies from being placed on future visits.',
      'See our Privacy Policy and Cookie Policy for additional information about data processing on CloudBasket.',
    ],
  },
  {
    id: 'where-affiliate-links-appear',
    title: 'Where Affiliate Links Appear',
    paragraphs: [
      'Affiliate links may appear throughout CloudBasket, including but not limited to the following placements.',
      `Affiliate links are tracked through URL parameters appended to the destination URL. For example, Amazon links may contain tag=${AMAZON_TAG} in the URL. CloudBasket does not use link cloaking or masking intended to conceal the affiliate nature of a link.`,
    ],
    bullets: [
      'Product listing pages and search results',
      'Product detail and comparison pages',
      'Category pages and featured deals sections',
      'Promotional banners and curated content',
      'Comparison tables and buying guides',
    ],
  },
  {
    id: 'compliance-statements',
    title: 'Compliance Statements',
    paragraphs: [
      'The statements below summarise the primary legal and platform obligations that this disclosure is intended to satisfy.',
    ],
    bullets: [
      'Consumer Protection Act 2019 and Consumer Protection (E-Commerce) Rules 2020: CloudBasket discloses material commercial relationships, including affiliate and advertising relationships, and does not engage in misleading or deceptive advertising practices.',
      'IT Act 2000 and IT Intermediary Guidelines 2021: CloudBasket maintains a grievance contact channel for user concerns regarding commercial relationships and disclosure practices.',
      'DPDP Act 2023: This page is intended to satisfy transparency requirements relating to visit-data processing through affiliate tracking mechanisms.',
      'ASCI Guidelines: Affiliate and advertising relationships are identified clearly. Social or third-party content will use labels such as #Ad, #Sponsored, or #Affiliate where required.',
      'Amazon Associates Operating Agreement (Oct 2025): The mandatory Amazon disclosure is present on this page and at the bottom of this legal disclosure.',
      'FTC Guides 16 CFR Part 255 and ASA/CAP Code: This page also serves as informational transparency for visitors accessing CloudBasket from the United States or the United Kingdom.',
    ],
  },
  {
    id: 'contact-grievance',
    title: 'Contact and Grievance',
    paragraphs: [
      'For questions, concerns, or grievances relating to this Affiliate Disclosure or CloudBasket commercial relationships, please contact the legal and grievance channel below.',
      'Grievance Officer / Legal Contact: NEXQON HOLDINGS, Kadapa, Andhra Pradesh – 516002, India.',
      `Email: ${LEGAL_EMAIL}`,
      'Website: www.cloudbasket.co',
    ],
    callout: {
      title: 'Response timeline',
      body: 'Grievances will be acknowledged within 24 hours and resolved within 15 days as required under IT Intermediary Guidelines 2021, Rule 3(2)(c).',
      tone: 'neutral',
    },
  },
  {
    id: 'changes-to-disclosure',
    title: 'Changes to This Disclosure',
    paragraphs: [
      'CloudBasket reserves the right to update this Affiliate Disclosure at any time to reflect changes in affiliate partnerships, applicable law, or platform practices.',
      'The Last Updated date at the top of this document indicates when the most recent revision was made. Continued use of CloudBasket following any update constitutes acceptance of the revised disclosure.',
    ],
  },
]

const RELATED_LINKS = [
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/refund-policy', label: 'Refund & Returns Policy' },
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

export default function AffiliateDisclosurePage() {
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
        <span className="font-semibold text-[var(--cb-text-primary)]">Affiliate Disclosure</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Affiliate Disclosure</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Effective Date: {EFFECTIVE_DATE} · Last Updated: {LAST_UPDATED} · Version: {VERSION}
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            Document ID: {DOCUMENT_ID} · Jurisdiction: {JURISDICTION}
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
            This disclosure documents commercial relationships, affiliate tracking, and user-facing transparency obligations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrintButton className="cb-btn cb-btn-primary gap-2" label="Download PDF" />
          <Link href="/" className="cb-btn cb-btn-ghost gap-2">
            Back to Home
          </Link>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
        <p className="text-sm font-black text-emerald-950">
          As an Amazon Associate, CloudBasket earns from qualifying purchases.
        </p>
      </section>
    </main>
  )
}
