// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/terms/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | CloudBasket',
  description:
    'Read CloudBasket\'s Terms of Service. CloudBasket is an affiliate product discovery platform operated by NEXQON HOLDINGS.',
  alternates: {
    canonical: 'https://www.cloudbasket.co/legal/terms',
  },
  robots: { index: true, follow: true },
}

const TOC_SECTIONS = [
  { id: 'section-1', title: 'Acceptance of Terms' },
  { id: 'section-2', title: 'Nature of Service' },
  { id: 'section-3', title: 'Eligibility' },
  { id: 'section-4', title: 'Affiliate Relationships and Disclosure' },
  { id: 'section-5', title: 'Intermediary Compliance — IT Act 2000 / IT Rules 2021 & 2026' },
  { id: 'section-6', title: 'Data Protection and Privacy — DPDP Act 2023 Compliance' },
  { id: 'section-7', title: 'Intellectual Property' },
  { id: 'section-8', title: 'Accuracy of Information' },
  { id: 'section-9', title: 'User Conduct' },
  { id: 'section-10', title: 'Third-Party Links and Websites' },
  { id: 'section-11', title: 'Disclaimers' },
  { id: 'section-12', title: 'Limitation of Liability' },
  { id: 'section-13', title: 'Grievance Redressal' },
  { id: 'section-14', title: 'Indemnification' },
  { id: 'section-15', title: 'Governing Law and Jurisdiction' },
  { id: 'section-16', title: 'Changes to Terms' },
  { id: 'section-17', title: 'Termination' },
  { id: 'section-18', title: 'Severability' },
  { id: 'section-19', title: 'Entire Agreement' },
  { id: 'section-20', title: 'Contact' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service | CloudBasket',
  description:
    "CloudBasket's Terms of Service — an affiliate product discovery platform operated by NEXQON HOLDINGS.",
  url: 'https://www.cloudbasket.co/legal/terms',
  isPartOf: {
    '@type': 'WebSite',
    name: 'CloudBasket',
    url: 'https://www.cloudbasket.co',
  },
  dateModified: '2026-03-31',
  publisher: {
    '@type': 'Organization',
    name: 'NEXQON HOLDINGS',
    url: 'https://www.cloudbasket.co',
  },
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 2v8M5 7l3 3 3-3M3 13h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PdfButton({ position }: { position: 'top' | 'bottom' }) {
  return (
    <a
      href="/legal/terms-of-service.pdf"
      download="CloudBasket-Terms-of-Service-2026.pdf"
      className="inline-flex items-center gap-2 rounded-lg bg-[#039BE5] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 print:hidden"
      aria-label={`Download Terms of Service PDF (${position} button)`}
    >
      <DownloadIcon />
      Download PDF
    </a>
  )
}

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
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
          <span className="font-medium text-gray-900">Terms of Service</span>
        </nav>

        {/* Page header */}
        <header className="mb-6">
          <h1 className="mb-2 text-4xl font-black tracking-tight text-[#039BE5]">
            Terms of Service
          </h1>
          <p className="mb-3 text-sm text-gray-500">
            Effective 01 April 2026 | Version 2.0 | Last Updated: 31 March 2026
          </p>
          <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            Last Updated: 31 March 2026
          </span>
          <hr className="mt-4 border-gray-200" />
        </header>

        {/* PDF button — top */}
        <div className="mb-6 flex items-center gap-4 print:hidden">
          <PdfButton position="top" />
          <span className="text-xs text-gray-400">
            CloudBasket — A NEXQON HOLDINGS Platform
          </span>
        </div>

        {/* Affiliate banner */}
        <div className="mb-8 rounded-r-lg border-l-4 border-[#E65100] bg-[#FFF3E0] px-4 py-3 text-sm leading-relaxed text-gray-800">
          <strong className="text-[#E65100]">Affiliate Disclosure:</strong>{' '}
          As an Amazon Associate, CloudBasket earns from qualifying purchases. All product links
          on this site are affiliate links.{' '}
          <span className="font-bold">#affiliate</span>
        </div>

        {/* Table of Contents */}
        <nav
          className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-6 print:hidden"
          aria-label="Table of contents"
        >
          <p className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
            Table of Contents
          </p>
          <ol className="space-y-1.5">
            {TOC_SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-[#039BE5] hover:underline"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── ToS Content ── */}
        <div className="prose prose-sm max-w-none text-base leading-[1.7] text-gray-800">

          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-2">
            <h2 className="mb-4 text-xl font-black text-gray-900">1. ACCEPTANCE OF TERMS</h2>
            <p>
              By accessing or using CloudBasket (www.cloudbasket.co, hereinafter &ldquo;the
              Website&rdquo;, &ldquo;the Platform&rdquo;, &ldquo;CloudBasket&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you agree to be bound
              by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these
              Terms, you must not use the Website.
            </p>
            <p className="mt-3">
              CloudBasket is operated by <strong>NEXQON HOLDINGS</strong>, a sole proprietorship
              registered under the laws of India, located at Kadapa, Andhra Pradesh &ndash;
              516002, India.
            </p>
            <p className="mt-3">
              These Terms are a legally binding agreement between you (&ldquo;User&rdquo;,
              &ldquo;you&rdquo;) and NEXQON HOLDINGS and are governed by Indian law.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">2. NATURE OF SERVICE</h2>
            <p>
              CloudBasket is an <strong>affiliate product discovery and comparison platform</strong>.
              We do not:
            </p>
            <ul className="mt-3 space-y-1 pl-5">
              <li>Sell any products directly</li>
              <li>Accept payments or process transactions</li>
              <li>Operate a shopping cart or checkout system</li>
              <li>Hold inventory of any kind</li>
              <li>Act as a retailer, seller, or marketplace</li>
              <li>Represent or act as an agent for any merchant</li>
            </ul>
            <p className="mt-3">
              When you click on a product link on CloudBasket, you will be{' '}
              <strong>redirected to a third-party merchant website</strong> (such as Amazon.in,
              Flipkart.com, or other affiliate partner retailers) where the actual purchase
              transaction occurs. All purchases, payments, shipping, returns, and customer service
              are exclusively governed by the respective merchant&apos;s own terms and conditions.
            </p>
            <p className="mt-3">
              CloudBasket functions as an <strong>intermediary</strong> under the Information
              Technology Act, 2000 and exercises due diligence in accordance with the Information
              Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and
              amendments thereof.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">3. ELIGIBILITY</h2>
            <p>
              You must be at least <strong>18 years of age</strong> to use this Website
              independently. By using CloudBasket, you represent and warrant that you meet this
              age requirement.
            </p>
            <p className="mt-3">
              If you are under 18, you may only use the Website under the direct supervision of a
              parent or legal guardian who accepts these Terms on your behalf.
            </p>
            <p className="mt-3">
              We do not knowingly collect data from children under 13. If you are under 13,
              please do not use this Website.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">
              4. AFFILIATE RELATIONSHIPS AND DISCLOSURE
            </h2>
            <p>
              CloudBasket participates in affiliate marketing programs.{' '}
              <strong>Full disclosure:</strong>
            </p>
            <ul className="mt-3 space-y-2 pl-5">
              <li>
                We earn a commission when you click affiliate links on this Website and
                subsequently make a qualifying purchase on the merchant&apos;s website.
              </li>
              <li>
                <strong>Commissions are paid by merchants from their own marketing budgets.</strong>{' '}
                You pay the same price whether or not you use our affiliate links.
              </li>
              <li>
                Affiliate links are marked with <strong>#ad</strong> or &ldquo;Affiliate
                Link&rdquo; labeling in compliance with FTC Guidelines (16 CFR Part 255) and ASCI
                Guidelines, applicable to users from all regions including the United States,
                European Union, and India.
              </li>
            </ul>
            <p className="mt-4 font-semibold">Participating affiliate programs include:</p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>
                Amazon Associates India Program (Amazon Seller Services Pvt. Ltd.) &mdash;{' '}
                <em>
                  &ldquo;As an Amazon Associate, we earn from qualifying purchases.&rdquo;
                </em>
              </li>
              <li>Flipkart Affiliate Program (Flipkart Internet Pvt. Ltd.)</li>
              <li>Commission Junction / CJ Affiliate</li>
              <li>Google AdSense (advertising, not product affiliate)</li>
              <li>Other affiliate networks as applicable and disclosed</li>
            </ul>
            <p className="mt-4">
              <strong>Amazon Associates &mdash; Important Notice (effective October 15, 2025):</strong>{' '}
              Commissions from Amazon affiliate links qualify only when a product is purchased,
              shipped, and payment cleared within <strong>180 days</strong> of your click.
              Commissions apply to the exact product variant linked, not to other products in
              your Amazon session.
            </p>
            <p className="mt-3">
              A complete Affiliate Disclosure is available at:{' '}
              <Link
                href="/legal/affiliate-disclosure"
                className="text-[#039BE5] hover:underline"
              >
                www.cloudbasket.co/legal/affiliate-disclosure
              </Link>
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">
              5. INTERMEDIARY COMPLIANCE &mdash; IT ACT 2000 / IT RULES 2021 &amp; 2026
            </h2>
            <p>
              CloudBasket operates as an intermediary under the{' '}
              <strong>Information Technology Act, 2000</strong> and complies with:
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              5.1 IT (Intermediary Guidelines) Rules 2021
            </h3>
            <ul className="space-y-1 pl-5">
              <li>
                We publish these Terms of Service, Privacy Policy, and all required user policies
                prominently.
              </li>
              <li>
                We do not host user-generated content and therefore do not operate a user content
                moderation system. All product content is editorially curated by NEXQON HOLDINGS.
              </li>
              <li>
                We maintain a grievance redressal mechanism (see Section&nbsp;13).
              </li>
            </ul>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              5.2 IT Amendment Rules 2026 (effective February 20, 2026)
            </h3>
            <p>
              Where artificial intelligence (AI) tools are used to generate or assist in creating
              any content on this Website &mdash; including product descriptions, category text,
              or editorial copy &mdash; such content:
            </p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>
                Is reviewed and verified by a human editor before publication
              </li>
              <li>
                Is not presented as independently verified fact without human validation
              </li>
              <li>May be labeled &ldquo;AI-assisted&rdquo; where appropriate</li>
            </ul>
            <p className="mt-3">
              CloudBasket does not publish synthetic media (deepfakes) of any person.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              5.3 Consumer Protection (E-Commerce) Rules 2020
            </h3>
            <p>In compliance with these Rules:</p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>
                CloudBasket discloses its affiliate relationships prominently on every applicable
                page
              </li>
              <li>
                We do not favor any associated enterprise over others in product listings
              </li>
              <li>
                We do not manipulate search results to promote affiliated products deceptively
              </li>
              <li>
                Seller information for any product is available on the respective
                merchant&apos;s platform
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">
              6. DATA PROTECTION AND PRIVACY &mdash; DPDP ACT 2023 COMPLIANCE
            </h2>

            <h3 className="mb-2 mt-4 text-base font-bold text-gray-900">
              6.1 Data Fiduciary Status
            </h3>
            <p>
              NEXQON HOLDINGS (operating CloudBasket) is a{' '}
              <strong>Data Fiduciary</strong> under the{' '}
              <strong>Digital Personal Data Protection Act, 2023</strong> and the DPDP Rules
              notified on <strong>November 14, 2025</strong>. We process limited personal data
              (cookies, analytics identifiers, contact form data) for the purposes described in
              our Privacy Policy.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">6.2 Your Consent</h3>
            <p>
              Before any non-essential data processing begins, we obtain your{' '}
              <strong>explicit, informed, and specific consent</strong> through our cookie
              consent mechanism. You may withdraw consent at any time with the same ease as it
              was given. Withdrawal of consent does not affect processing carried out prior to
              withdrawal.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              6.3 Your Rights Under DPDP Act 2023
            </h3>
            <p>You have the right to:</p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>
                <strong>Access</strong> &mdash; know what personal data we hold
              </li>
              <li>
                <strong>Correction</strong> &mdash; correct inaccurate data
              </li>
              <li>
                <strong>Erasure</strong> &mdash; request deletion of your data post-purpose
              </li>
              <li>
                <strong>Grievance Redressal</strong> &mdash; complain to us or the Data Protection
                Board of India
              </li>
            </ul>
            <p className="mt-3">
              We will respond to data rights requests within{' '}
              <strong>90 days</strong> of receipt.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              6.4 Data Breach Notification
            </h3>
            <p>
              In the event of a personal data breach, we will notify affected users and the Data
              Protection Board of India within the timelines prescribed under DPDP Rules 2025
              (Rule 7), including details of the incident, impact, and mitigations taken.
            </p>
            <p className="mt-3">
              Full details are in our{' '}
              <strong>Privacy Policy</strong> at{' '}
              <Link href="/legal/privacy" className="text-[#039BE5] hover:underline">
                www.cloudbasket.co/legal/privacy
              </Link>
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">7. INTELLECTUAL PROPERTY</h2>

            <h3 className="mb-2 mt-4 text-base font-bold text-gray-900">7.1 Our Content</h3>
            <p>
              All original content on CloudBasket &mdash; text, graphics, logos, icons, data
              compilations, software, and editorial copy &mdash; is the property of NEXQON
              HOLDINGS, protected under the <strong>Indian Copyright Act, 1957</strong> and
              applicable international copyright laws.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">7.2 Trademarks</h3>
            <p>
              &ldquo;CloudBasket&rdquo; and &ldquo;NEXQON HOLDINGS&rdquo; and associated logos
              are trademarks of NEXQON HOLDINGS. Unauthorized use is prohibited.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              7.3 Third-Party Trademarks
            </h3>
            <p>
              Product names, brands, and trademarks (including &ldquo;Amazon&rdquo;,
              &ldquo;Flipkart&rdquo;) are the property of their respective owners. Their mention
              is for product identification only and does not imply endorsement, partnership, or
              sponsorship. CloudBasket is not an official partner of Amazon or Flipkart.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              7.4 No Amazon Trademark Misuse
            </h3>
            <p>
              In compliance with the Amazon Associates Operating Agreement (October 2025),
              CloudBasket does not use &ldquo;Amazon&rdquo; in its domain name, subdomain, or
              paid advertising in any way that violates Amazon&apos;s trademark guidelines.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">7.5 Product Images</h3>
            <p>
              Product images on CloudBasket are sourced from licensed stock image providers (not
              scraped from merchants). These are for illustrative purposes only.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">8. ACCURACY OF INFORMATION</h2>

            <h3 className="mb-2 mt-4 text-base font-bold text-gray-900">8.1 Pricing</h3>
            <p>
              Prices shown on CloudBasket are <strong>indicative only</strong>, sourced from
              affiliate feeds, and <strong>subject to change without notice</strong>. Always
              confirm the final price on the merchant&apos;s website before purchasing.
              CloudBasket is not liable for price discrepancies.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              8.2 Commission Eligibility
            </h3>
            <p>
              Due to the Amazon Associates 180-day rule (effective October 2025), commission
              eligibility depends on purchase completion within 180 days of your click.
              CloudBasket earns commissions only on <strong>qualifying purchases</strong> as
              defined by each affiliate program&apos;s operating agreement.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              8.3 Product Availability
            </h3>
            <p>
              Product availability shown on CloudBasket may not reflect real-time stock on
              merchant sites. Always verify on the merchant&apos;s website.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              8.4 Product Descriptions
            </h3>
            <p>
              Descriptions are for general reference. CloudBasket does not verify manufacturer
              claims. Refer to the merchant&apos;s product page and official manufacturer
              documentation for authoritative specifications.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">9. USER CONDUCT</h2>
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-2 pl-5">
              <li>
                Use the Website for any unlawful purpose or in violation of applicable Indian or
                international law
              </li>
              <li>
                Attempt unauthorized access to any part of the Website or its systems
              </li>
              <li>
                Use bots, scrapers, crawlers, or automated tools to extract data without written
                permission
              </li>
              <li>
                Reproduce, copy, sell, or exploit any portion of the Website without prior
                written consent
              </li>
              <li>
                Upload or transmit malicious code, viruses, or harmful content
              </li>
              <li>
                Interfere with the Website&apos;s performance or infrastructure
              </li>
              <li>
                Attempt to manipulate affiliate tracking or commission attribution fraudulently
              </li>
              <li>
                Click affiliate links with intent to generate commissions without genuine
                purchase intent (self-referral fraud)
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">
              10. THIRD-PARTY LINKS AND WEBSITES
            </h2>
            <p>
              All affiliate links redirect to third-party merchant websites. Once you leave
              CloudBasket:
            </p>
            <ul className="mt-3 space-y-1 pl-5">
              <li>
                You are subject to that merchant&apos;s Terms of Service and Privacy Policy
              </li>
              <li>
                CloudBasket has no control over, and accepts no responsibility for, third-party
                website content, availability, or practices
              </li>
              <li>
                Visiting any external website is entirely at your own risk
              </li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">11. DISCLAIMERS</h2>

            <h3 className="mb-2 mt-4 text-base font-bold text-gray-900">11.1 No Warranty</h3>
            <p className="text-xs uppercase leading-relaxed tracking-wide">
              THE WEBSITE AND ITS CONTENT ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">11.2 No Guarantee</h3>
            <p>
              We do not warrant that the Website will be uninterrupted or error-free, that
              affiliate links will always function, or that commission income will always be
              generated.
            </p>

            <h3 className="mb-2 mt-5 text-base font-bold text-gray-900">
              11.3 No Professional Advice
            </h3>
            <p>
              Nothing on CloudBasket constitutes financial, legal, medical, or professional
              advice of any kind.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">
              12. LIMITATION OF LIABILITY
            </h2>
            <p className="text-xs uppercase leading-relaxed tracking-wide">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXQON HOLDINGS SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
              ARISING FROM YOUR USE OF THE WEBSITE, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="mt-3 space-y-1 pl-5 text-xs uppercase tracking-wide">
              <li>Loss of profits or revenue</li>
              <li>Loss of data</li>
              <li>Reliance on information provided by the Website</li>
              <li>Purchases or disputes with third-party merchants</li>
            </ul>
            <p className="mt-4">
              <strong>Liability Cap:</strong> Our total cumulative liability to you for any
              claims shall not exceed the <strong>actual direct loss proven by you</strong>,
              subject to a maximum of{' '}
              <strong>INR 5,000 (Five Thousand Rupees)</strong>, except in cases of gross
              negligence, wilful misconduct, or fraud by NEXQON HOLDINGS, in which case this
              cap shall not apply. This cap applies because CloudBasket processes zero financial
              transactions and collects no payment data.
            </p>
            <blockquote className="mt-4 border-l-4 border-gray-200 pl-4 text-xs italic text-gray-500">
              Research note: The INR 500 cap in v1.0 was revised to INR 5,000 following legal
              research indicating courts may find very low caps unconscionable for intermediary
              platforms. The cap excludes gross negligence and fraud per Indian Contract Act,
              1872 enforceability standards.
            </blockquote>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">13. GRIEVANCE REDRESSAL</h2>
            <p>
              In compliance with the{' '}
              <strong>
                Information Technology (Intermediary Guidelines) Rules, 2021
              </strong>
              , Rule 3(2), and the <strong>DPDP Rules, 2025</strong>, Rule 14, we have designated
              a Grievance Officer:
            </p>
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <p className="font-bold">Grievance Officer:</p>
              <p>NEXQON HOLDINGS</p>
              <p>Kadapa, Andhra Pradesh &ndash; 516002, India</p>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:info@cloudbasket.co"
                  className="text-[#039BE5] hover:underline"
                >
                  info@cloudbasket.co
                </a>
              </p>
              <p className="mt-1">
                <strong>Response Time:</strong> Acknowledgement within 24 hours | Resolution
                within 30 days
              </p>
            </div>
            <p className="mt-4">You may submit complaints regarding:</p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>Content on the Website</li>
              <li>Privacy or data protection concerns</li>
              <li>Affiliate link issues</li>
              <li>Any violation of these Terms</li>
            </ul>
            <p className="mt-3">
              If your complaint is not resolved satisfactorily, you may approach the{' '}
              <strong>Data Protection Board of India</strong> (for data-related complaints) or
              the appropriate consumer forum.
            </p>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">14. INDEMNIFICATION</h2>
            <p>
              You agree to indemnify and hold harmless NEXQON HOLDINGS, its owners, agents, and
              representatives from any claims, damages, losses, liabilities, and expenses
              (including reasonable legal fees) arising from: (a) your use of the Website;
              (b) your violation of these Terms; or (c) your violation of any third
              party&apos;s rights.
            </p>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">
              15. GOVERNING LAW AND JURISDICTION
            </h2>
            <p>These Terms are governed by the laws of India, including:</p>
            <ul className="mt-3 space-y-1 pl-5">
              <li>Information Technology Act, 2000 and Rules thereunder</li>
              <li>Consumer Protection Act, 2019</li>
              <li>Digital Personal Data Protection Act, 2023</li>
              <li>Indian Contract Act, 1872</li>
            </ul>
            <p className="mt-4">
              <strong>Commercial disputes:</strong> Subject to the exclusive jurisdiction of
              courts in <strong>Kadapa, Andhra Pradesh, India</strong>.
            </p>
            <p className="mt-3">
              <strong>Consumer disputes:</strong> Nothing in these Terms limits your right to
              approach the appropriate Consumer Disputes Redressal Commission (District, State,
              or National) under the Consumer Protection Act, 2019. The venue for consumer
              disputes shall be determined per the provisions of that Act and is not restricted
              to Kadapa courts.
            </p>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">16. CHANGES TO TERMS</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on
              this page with an updated &ldquo;Last Updated&rdquo; date.{' '}
              <strong>Material changes</strong> will be notified via a banner on the Website.
              Continued use after posting constitutes acceptance. We recommend reviewing these
              Terms periodically.
            </p>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">17. TERMINATION</h2>
            <p>
              We reserve the right to block or restrict access to the Website at any time,
              without notice, for conduct that violates these Terms or applicable law, or for
              any reason at our sole discretion.
            </p>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">18. SEVERABILITY</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid by a court
              of competent jurisdiction, that provision shall be modified to the minimum extent
              necessary to make it enforceable, and the remaining provisions shall continue in
              full force and effect.
            </p>
          </section>

          {/* Section 19 */}
          <section id="section-19" className="scroll-mt-8 border-b border-gray-100 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">19. ENTIRE AGREEMENT</h2>
            <p>
              These Terms, together with our Privacy Policy, Cookie Policy, and Affiliate
              Disclosure, constitute the entire agreement between you and NEXQON HOLDINGS
              regarding your use of the Website.
            </p>
          </section>

          {/* Section 20 */}
          <section id="section-20" className="scroll-mt-8 pb-8 pt-8">
            <h2 className="mb-4 text-xl font-black text-gray-900">20. CONTACT</h2>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <p className="font-bold">NEXQON HOLDINGS</p>
              <p>Kadapa, Andhra Pradesh &ndash; 516002, India</p>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:info@cloudbasket.co"
                  className="text-[#039BE5] hover:underline"
                >
                  info@cloudbasket.co
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href="https://www.cloudbasket.co"
                  className="text-[#039BE5] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.cloudbasket.co
                </a>
              </p>
              <p className="mt-1">
                <strong>Grievance Response:</strong> Within 24 hours acknowledgement, 30 days
                resolution
              </p>
            </div>
          </section>

          {/* Change log */}
          <section className="mt-4 border-t border-gray-100 pt-8">
            <h2 className="mb-4 text-base font-bold text-gray-700">Change Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="pb-2 pr-6">Version</th>
                    <th className="pb-2 pr-6">Date</th>
                    <th className="pb-2">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                  <tr>
                    <td className="py-2 pr-6 font-mono">v1.0</td>
                    <td className="py-2 pr-6">31-Mar-2026</td>
                    <td className="py-2">Initial draft</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6 font-mono">v2.0</td>
                    <td className="py-2 pr-6">31-Mar-2026</td>
                    <td className="py-2">
                      Added: DPDP Rules Nov 2025, IT Amendment Rules Feb 2026, Amazon Oct 2025
                      changes, Grievance Officer section, AI content labeling, revised liability
                      cap, consumer forum jurisdiction carve-out, FTC #ad disclosure,
                      intermediary compliance section
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-xs italic text-gray-400">
              © 2026 NEXQON HOLDINGS | CloudBasket | www.cloudbasket.co | info@cloudbasket.co
              <br />
              As an Amazon Associate, we earn from qualifying purchases.
            </p>
          </section>
        </div>
        {/* ── End ToS Content ── */}

        {/* PDF button — bottom */}
        <div className="mt-10 flex items-center gap-4 print:hidden">
          <PdfButton position="bottom" />
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <Link href="/legal/privacy" className="hover:text-[#039BE5]">
              Privacy Policy
            </Link>
            <Link href="/legal/cookies" className="hover:text-[#039BE5]">
              Cookie Policy
            </Link>
            <Link href="/legal/affiliate-disclosure" className="hover:text-[#039BE5]">
              Affiliate Disclosure
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-[#039BE5]">
              Disclaimer
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
