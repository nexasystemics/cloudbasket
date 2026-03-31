'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Download, Copy, Check } from 'lucide-react'

const EFFECTIVE_DATE = '01 April 2026'
const LAST_UPDATED = '01 April 2026'
const VERSION = '2.0 — 2026 Compliance Final'

const SECTIONS = [
  { id: 's1', title: 'Section 1 — Introduction' },
  { id: 's2', title: 'Section 2 — Data Controller & Grievance Officer' },
  { id: 's3', title: 'Section 3 — Information We Collect' },
  { id: 's4', title: 'Section 4 — How We Use Your Information' },
  { id: 's5', title: 'Section 5 — Cookies and Tracking Technologies' },
  { id: 's6', title: 'Section 6 — Sharing Your Information' },
  { id: 's7', title: 'Section 7 — Affiliate Links — Third-Party Redirection Notice' },
  { id: 's8', title: 'Section 8 — Data Retention' },
  { id: 's9', title: 'Section 9 — Data Security' },
  { id: 's10', title: 'Section 10 — Children\'s Privacy' },
  { id: 's11', title: 'Section 11 — Your Rights as a Data Principal' },
  { id: 's12', title: 'Section 12 — International Data Transfers' },
  { id: 's13', title: 'Section 13 — Third-Party Links' },
  { id: 's14', title: 'Section 14 — Consent and Withdrawal' },
  { id: 's15', title: 'Section 15 — Data Breach Notification' },
  { id: 's16', title: 'Section 16 — Changes to This Policy' },
  { id: 's17', title: 'Section 17 — Contact, Grievance Redressal & Data Protection Board' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div id={id} className="border-b border-[var(--cb-border)] py-6">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <ChevronDown size={20} className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--cb-text-secondary)]">
          {children}
        </div>
      )}
    </div>
  )
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--cb-border)]">
      <table className="w-full text-xs">{children}</table>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-[var(--cb-surface-2)] px-4 py-2 text-left font-black">{children}</th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="border-t border-[var(--cb-border)] px-4 py-2 align-top">{children}</td>
}

export default function PrivacyPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    try {
      void navigator.clipboard.writeText('https://www.cloudbasket.co/legal/privacy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* no-op */
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
        <Link href="/" className="hover:text-skyline-primary hover:underline">Home</Link>
        <span>/</span>
        <Link href="/legal" className="hover:text-skyline-primary hover:underline">Legal</Link>
        <span>/</span>
        <span className="font-semibold text-[var(--cb-text-primary)]">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Effective Date: {EFFECTIVE_DATE} · Last Updated: {LAST_UPDATED} · Version: {VERSION}
          </p>
          <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
            Prepared in compliance with: DPDP Act 2023, DPDP Rules November 2025, IT Act 2000, IT (Intermediary
            Guidelines) Rules 2021, IT (SPDI) Rules 2011, Consumer Protection Act 2019, GDPR (EU visitors), Amazon
            Associates OA Oct 2025, Google AdSense Publisher Policies 2025, FTC 16 CFR Part 255.
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="cb-btn cb-btn-ghost gap-2 text-sm"
          >
            <Download size={16} /> Download PDF
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="cb-btn cb-btn-ghost gap-2 text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="cb-card mb-10 p-6 print:hidden" aria-label="Table of Contents">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Table of Contents
        </p>
        <ol className="space-y-1.5">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-sm text-skyline-primary hover:underline">
                {i + 1}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Section 1 */}
      <Section id="s1" title="Section 1 — Introduction">
        <p>
          <strong>NEXQON HOLDINGS</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates CloudBasket at{' '}
          <a href="https://www.cloudbasket.co" className="text-skyline-primary underline">www.cloudbasket.co</a>, an
          affiliate product discovery platform. CloudBasket is a <strong>zero-transaction, zero-account
          platform</strong> — we do not process payments, we do not require user registration, and we do not store
          user accounts.
        </p>

        <p className="font-black">1.1 Legal Framework</p>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Law / Regulation</Th>
              <Th>Applicability</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Digital Personal Data Protection Act, 2023 (DPDP Act)', 'Primary Indian data protection law'],
              ['Digital Personal Data Protection Rules, 2025 (notified 14 November 2025)', 'Rules implementing DPDP Act'],
              ['Information Technology Act, 2000 (IT Act)', 'Governing Indian cyberspace'],
              ['IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021', 'Intermediary obligations'],
              ['IT (Reasonable Security Practices and SPDI) Rules, 2011', 'Sensitive data obligations'],
              ['Consumer Protection Act, 2019', 'Consumer rights protection'],
              ['General Data Protection Regulation (GDPR)', 'For users accessing from the EEA'],
              ['Amazon Associates Operating Agreement, October 2025', 'Affiliate disclosure requirements'],
              ['Google AdSense Publisher Policies, 2025', 'Ad network obligations'],
              ['FTC 16 CFR Part 255, 2025', 'Endorsement and disclosure rules'],
            ].map(([law, applicability]) => (
              <tr key={law}>
                <Td>{law}</Td>
                <Td>{applicability}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>

        <p>
          <strong>1.2 Scope:</strong> This Policy applies to all visitors of{' '}
          <a href="https://www.cloudbasket.co" className="text-skyline-primary underline">www.cloudbasket.co</a>{' '}
          regardless of device or location. By continuing to use our Website, you acknowledge that you have read and
          understood this Policy.
        </p>
      </Section>

      {/* Section 2 */}
      <Section id="s2" title="Section 2 — Data Controller & Grievance Officer">
        <p>
          Under the DPDP Act 2023, NEXQON HOLDINGS is the <strong>Data Fiduciary</strong> responsible for your
          personal data.
        </p>

        <div className="rounded-xl bg-[var(--cb-surface-2)] p-4 space-y-1">
          <p className="font-black">Data Fiduciary / Data Controller</p>
          <p>NEXQON HOLDINGS, Kadapa, Andhra Pradesh – 516002, India</p>
          <p>
            Website:{' '}
            <a href="https://www.cloudbasket.co" className="text-skyline-primary underline">www.cloudbasket.co</a>
            {' '}| Email:{' '}
            <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
          </p>
        </div>

        <div className="rounded-xl bg-[var(--cb-surface-2)] p-4 space-y-1">
          <p className="font-black">Grievance Officer / Data Protection Contact</p>
          <p>Designation: Privacy &amp; Compliance Officer | Organisation: NEXQON HOLDINGS — IBF Document Division</p>
          <p>
            Email:{' '}
            <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
            {' '}| Response Time: Within 30 days
          </p>
        </div>

        <p>
          <strong>IT Rules 2021 Notice:</strong> In compliance with Rule 3(1)(c) of the IT (Intermediary Guidelines)
          Rules 2021, our Grievance Officer acknowledges complaints within <strong>24 hours</strong> and resolves them
          within <strong>15 days</strong> of receipt.
        </p>
      </Section>

      {/* Section 3 */}
      <Section id="s3" title="Section 3 — Information We Collect">
        <p>
          <strong>3.1 Platform Nature — Zero-Account, Zero-Transaction:</strong> CloudBasket does not require
          registration, login, or personal information to browse. We do not process payments or financial data.
        </p>

        <p className="font-black">3.2 Information You Voluntarily Provide</p>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Data Collected</Th>
              <Th>When Collected</Th>
              <Th>Purpose</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Name</Td>
              <Td>Contact form submission</Td>
              <Td>To address your inquiry</Td>
            </tr>
            <tr>
              <Td>Email Address</Td>
              <Td>Contact form / newsletter signup</Td>
              <Td>To respond or send updates</Td>
            </tr>
            <tr>
              <Td>Message Content</Td>
              <Td>Contact form</Td>
              <Td>To understand and resolve your query</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <p>
          Providing this information constitutes your free, specific, informed, and unambiguous consent under Section
          6 of the DPDP Act 2023 and Rule 4 of the DPDP Rules 2025.
        </p>

        <p className="font-black">3.3 Information Collected Automatically</p>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Data Type</Th>
              <Th>Purpose</Th>
              <Th>Legal Basis (DPDP)</Th>
              <Th>Legal Basis (GDPR)</Th>
              <Th>Retention</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['IP Address', 'Security, fraud prevention', 'Legitimate Use', 'Legitimate Interest', '30 days (anonymised after)'],
              ['Browser type and version', 'Site optimisation', 'Legitimate Use', 'Legitimate Interest', 'Aggregated only'],
              ['Pages visited, time on page', 'Analytics via GA4', 'Consent', 'Consent', '14 months (GA4 default)'],
              ['Referral URL', 'Traffic analysis', 'Legitimate Use', 'Legitimate Interest', '14 months'],
              ['Device type', 'Responsive optimisation', 'Legitimate Use', 'Legitimate Interest', 'Aggregated only'],
              ['Affiliate click-through data', 'Commission tracking', 'Legitimate Use', 'Legitimate Interest', 'Per affiliate program terms'],
              ['Cookie identifiers', 'See Section 5', 'Consent (non-essential)', 'Consent', 'See Cookie Policy'],
            ].map(([type, ...rest]) => (
              <tr key={type}>
                <Td>{type}</Td>
                {rest.map((cell, idx) => <Td key={idx}>{cell}</Td>)}
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <p>
          <strong>GA4 Notice:</strong> We use Google Analytics 4 under Google&apos;s Data Processing Amendment and
          standard contractual terms. GA4 automatically anonymises IP addresses. We have configured GA4 data
          retention to the minimum available period. Google Signals is disabled.
        </p>

        <p className="font-black">3.4 Information From Third Parties</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Google Analytics 4 (GA4) — aggregated website usage statistics</li>
          <li>Google AdSense — ad serving, performance data, and contextual targeting signals</li>
          <li>Amazon Associates — aggregated click and commission data (no personal user data shared with us)</li>
          <li>Flipkart Affiliate — aggregated click and commission data</li>
          <li>CJ Affiliate (Commission Junction) — aggregated click and commission data</li>
        </ul>
        <p>We do <strong>NOT</strong> purchase or process personal data from data brokers.</p>

        <p>
          <strong>3.5 Sensitive Personal Data or Information (SPDI):</strong> Under the IT (SPDI) Rules 2011,
          CloudBasket does <strong>NOT</strong> collect, process, or store any SPDI including passwords, financial
          information, biometric data, medical records, or sexual orientation data.
        </p>
      </Section>

      {/* Section 4 */}
      <Section id="s4" title="Section 4 — How We Use Your Information">
        <p>We use collected information only for the purposes specified below:</p>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Purpose</Th>
              <Th>Legal Basis (DPDP Act 2023)</Th>
              <Th>Legal Basis (GDPR)</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Operate and maintain the Website', 'Legitimate Use', 'Legitimate Interest'],
              ['Analyse and improve Website performance', 'Legitimate Use', 'Legitimate Interest'],
              ['Display contextual advertisements (AdSense)', 'Consent (via cookie banner)', 'Consent'],
              ['Track affiliate link performance (aggregated)', 'Legitimate Use', 'Legitimate Interest'],
              ['Respond to your contact form inquiries', 'Consent', 'Contract / Legitimate Interest'],
              ['Send newsletters or updates (if subscribed)', 'Consent', 'Consent'],
              ['Prevent fraud and ensure security', 'Legitimate Use', 'Legitimate Interest'],
              ['Comply with legal obligations', 'Legal Obligation', 'Legal Obligation'],
              ['Notify you of data breaches (if applicable)', 'Legal Obligation', 'Legal Obligation'],
            ].map(([purpose, dpdp, gdpr]) => (
              <tr key={purpose}>
                <Td>{purpose}</Td>
                <Td>{dpdp}</Td>
                <Td>{gdpr}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>

        <p className="font-black">4.1 What We Do NOT Do</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Sell, rent, or trade your personal data to any third party</li>
          <li>Use your data for automated decision-making with legal or similarly significant effects</li>
          <li>Build individual user profiles for behavioural advertising beyond standard AdSense contextual targeting</li>
          <li>Process any financial or payment data</li>
          <li>Share personal data with advertisers beyond what is technically required for ad serving</li>
        </ul>
      </Section>

      {/* Section 5 */}
      <Section id="s5" title="Section 5 — Cookies and Tracking Technologies">
        <p>
          We use cookies and similar tracking technologies. A full description is in our{' '}
          <Link href="/legal/privacy" className="text-skyline-primary underline">Cookie Policy</Link> at{' '}
          www.cloudbasket.co/cookies.
        </p>

        <p>
          <strong>5.1 Consent for Non-Essential Cookies:</strong> In compliance with Rule 4 of the DPDP Rules 2025,
          we obtain your explicit consent before placing any non-essential cookies (analytics, advertising). You may
          manage or withdraw cookie consent at any time through our cookie consent banner.
        </p>

        <p className="font-black">5.2 Consent Withdrawal</p>
        <p>You may withdraw consent by:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Using the &quot;Manage Preferences&quot; option in our cookie consent banner</li>
          <li>
            Emailing{' '}
            <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
            {' '}with subject &quot;Cookie Opt-Out&quot;
          </li>
        </ul>
        <p>Withdrawal does not affect the lawfulness of processing carried out before withdrawal.</p>
      </Section>

      {/* Section 6 */}
      <Section id="s6" title="Section 6 — Sharing Your Information">
        <p>
          We do not share your personal data except in the strictly limited circumstances below.
        </p>

        <p className="font-black">6.1 Service Providers (Data Processors)</p>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Service Provider</Th>
              <Th>Service</Th>
              <Th>Data Shared</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Google LLC', 'Analytics (GA4), AdSense', 'Anonymised usage data, ad signals', 'USA'],
              ['Vercel Inc.', 'Website hosting and deployment', 'Server access logs', 'USA'],
              ['Cloudflare Inc.', 'CDN, DDoS protection', 'IP address (anonymised)', 'USA'],
            ].map(([provider, service, data, location]) => (
              <tr key={provider}>
                <Td>{provider}</Td>
                <Td>{service}</Td>
                <Td>{data}</Td>
                <Td>{location}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <p>
          All service providers are contractually required to protect your data and use it only for the specified
          purpose.
        </p>

        <p>
          <strong>6.2 Affiliate Networks:</strong> When you click an affiliate link, you are redirected to the
          merchant&apos;s website (Amazon, Flipkart, CJ Affiliate). The merchant&apos;s own privacy policy governs
          all data collection after redirection. We receive only aggregated, non-personal click and conversion data.
        </p>
        <p>
          <strong>Amazon Associates Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases.
          We receive aggregated performance data only — Amazon does not share individual user data with us.
        </p>

        <p>
          <strong>6.3 Legal Requirements:</strong> We may disclose your information if required by a court order,
          government authority, the Data Protection Board of India (DPBI), or to protect rights, property, or safety.
        </p>

        <p>
          <strong>6.4 Business Transfer:</strong> In the event of a merger or acquisition, your data may be
          transferred. We will notify you via a prominent notice prior to any such transfer.
        </p>

        <p>
          <strong>6.5 Cross-Border Transfers:</strong> Some service providers (Google, Vercel, Cloudflare) are
          located outside India. Data transfers are conducted in accordance with Section 16 of the DPDP Act 2023 and
          Rule 15 of the DPDP Rules 2025. For EU users, transfers are governed by Google&apos;s Standard Contractual
          Clauses and applicable adequacy mechanisms under GDPR Article 46.
        </p>
      </Section>

      {/* Section 7 */}
      <Section id="s7" title="Section 7 — Affiliate Links — Third-Party Redirection Notice">
        <p>
          Our Website contains affiliate links to Amazon.in, Flipkart, and others. When you click these links:
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>You are redirected to the merchant&apos;s website</li>
          <li>The merchant&apos;s privacy policy and terms of service apply from that point</li>
          <li>We have no control over the merchant&apos;s data collection practices</li>
          <li>We may earn a commission if you make a purchase — at no additional cost to you</li>
        </ul>
        <p>
          <strong>Disclosure:</strong> In compliance with ASCI Guidelines (India) and FTC 16 CFR Part 255: links on
          this Website may be affiliate links. Our editorial content and product recommendations are independent and
          not influenced by affiliate commissions.
        </p>
        <div className="rounded-xl border border-[#F5C518]/40 bg-[#F5C518]/10 px-4 py-3">
          <p>
            <strong>Amazon Mandatory Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases.
          </p>
        </div>
      </Section>

      {/* Section 8 */}
      <Section id="s8" title="Section 8 — Data Retention">
        <TableWrapper>
          <thead>
            <tr>
              <Th>Data Category</Th>
              <Th>Retention Period</Th>
              <Th>Basis</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Contact form submissions', '2 years from submission date', 'Response and dispute resolution'],
              ['Newsletter subscriber email', 'Until unsubscription + 30 days', 'Consent-based'],
              ['Analytics data (GA4)', '14 months (GA4 configured minimum)', 'GA4 DPA / legitimate use'],
              ['Server / access logs', '30 days', 'Security and fraud prevention'],
              ['Affiliate click data', 'Per affiliate program terms (typically 90 days)', 'Affiliate agreement'],
              ['Cookie data', 'Per cookie type — see Cookie Policy', 'Consent'],
            ].map(([category, period, basis]) => (
              <tr key={category}>
                <Td>{category}</Td>
                <Td>{period}</Td>
                <Td>{basis}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
        <p>
          Upon expiry of the applicable retention period, data is securely deleted or anonymised. You may request
          early deletion — see Section 11.
        </p>
      </Section>

      {/* Section 9 */}
      <Section id="s9" title="Section 9 — Data Security">
        <p>
          We implement industry-standard technical and organisational security measures in compliance with Section
          8(4) of the DPDP Act 2023, Rule 6 of the DPDP Rules 2025, and Section 43A of the IT Act 2000.
        </p>

        <p className="font-black">9.1 Technical Measures</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>HTTPS / TLS encryption for all data in transit</li>
          <li>
            Secure HTTP headers: Content Security Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options
          </li>
          <li>DDoS protection and Web Application Firewall via Cloudflare</li>
          <li>Secure hosting environment via Vercel with access controls</li>
          <li>Regular security configuration reviews</li>
        </ul>

        <p className="font-black">9.2 Organisational Measures</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Access to collected data is restricted to authorised personnel only</li>
          <li>No personal data is stored in public repositories or unsecured locations</li>
          <li>Security practices aligned with ISO 27001-equivalent principles</li>
        </ul>

        <p>
          <strong>9.3 Limitations:</strong> No method of transmission over the internet is 100% secure. In the event
          of a data breach, we will follow the notification procedure outlined in Section 15.
        </p>
      </Section>

      {/* Section 10 */}
      <Section id="s10" title="Section 10 — Children's Privacy">
        <p>
          <strong>10.1 Age Threshold:</strong> Under Section 2(f) of the DPDP Act 2023, a &quot;child&quot; is a
          person who has not completed 18 years of age. CloudBasket is <strong>NOT directed at children under
          18</strong>. We do not knowingly collect personal data from children under 18.
        </p>

        <p>
          <strong>10.2 Parental Consent Obligation:</strong> Under Rule 10 of the DPDP Rules 2025, if we become
          aware a user is under 18, we are required to obtain verifiable parental/guardian consent before processing
          any personal data, and not conduct behavioural monitoring or targeted advertising directed at such user.
        </p>

        <p>
          <strong>10.3 Parental Action:</strong> If you are a parent or guardian and believe your child under 18
          has provided us with personal information, please contact us at{' '}
          <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
          {' '}with subject &quot;Child Data Deletion Request.&quot; We will delete such data promptly.
        </p>
      </Section>

      {/* Section 11 */}
      <Section id="s11" title="Section 11 — Your Rights as a Data Principal">
        <p className="font-black">11.1 Rights Under the DPDP Act 2023 and DPDP Rules 2025</p>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Right</Th>
              <Th>Description</Th>
              <Th>Rule Reference</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Right to Access', 'Request a summary of personal data we process and identities of Data Processors/Fiduciaries', 'Section 11, DPDP Act'],
              ['Right to Correction', 'Request correction of inaccurate, incomplete, or outdated personal data', 'Section 12, DPDP Act'],
              ['Right to Erasure', 'Request deletion of personal data no longer necessary for specified purpose', 'Section 12, DPDP Act'],
              ['Right to Grievance Redressal', 'File a complaint with our Grievance Officer and escalate to the DPBI', 'Section 13, DPDP Act'],
              ['Right to Nominate', 'Nominate a person to exercise your rights in case of death or incapacity', 'Section 14, DPDP Act'],
              ['Right to Withdraw Consent', 'Withdraw consent at any time for consent-based processing', 'Section 6(4), DPDP Act'],
            ].map(([right, description, ref]) => (
              <tr key={right}>
                <Td><strong>{right}</strong></Td>
                <Td>{description}</Td>
                <Td>{ref}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>

        <p className="font-black">11.2 Additional Rights for EU/EEA Users (GDPR)</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Right to Data Portability (Article 20, GDPR)</li>
          <li>Right to Object to processing based on legitimate interests (Article 21, GDPR)</li>
          <li>Right to Restriction of Processing (Article 18, GDPR)</li>
          <li>Right to lodge a complaint with your national supervisory authority (Article 77, GDPR)</li>
        </ul>

        <p>
          <strong>11.3 How to Exercise Your Rights:</strong> Email{' '}
          <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
          {' '}with subject &quot;Data Rights Request — [Right Type]&quot;. Response within 30 days. We may request
          verification of identity.
        </p>
      </Section>

      {/* Section 12 */}
      <Section id="s12" title="Section 12 — International Data Transfers">
        <p>
          Our Website is primarily intended for users in India. If you access from outside India, your data may be
          transferred to India or to countries where our service providers operate (primarily the United States).
        </p>

        <p>
          <strong>12.1 Transfers Under DPDP Rules 2025:</strong> All international data transfers are conducted in
          accordance with Section 16 of the DPDP Act 2023 and Rule 15 of the DPDP Rules 2025. We do not transfer
          personal data to any country notified as restricted by the Central Government of India.
        </p>

        <p>
          <strong>12.2 Transfers to EU/EEA Users:</strong> Data transferred to service providers in the USA is
          governed by Standard Contractual Clauses (SCCs) with Google LLC, Vercel Inc., and Cloudflare Inc., and
          Google&apos;s Data Processing Amendment under GDPR Article 28.
        </p>

        <div className="rounded-xl bg-[var(--cb-surface-2)] px-4 py-3">
          <p>
            <strong>Note:</strong> As of 2026, no formal adequacy decision exists between the EU and India under GDPR
            Article 45. Transfers from the EEA to India rely on SCCs or equivalent safeguards maintained by our
            service providers.
          </p>
        </div>
      </Section>

      {/* Section 13 */}
      <Section id="s13" title="Section 13 — Third-Party Links">
        <p>
          Our Website contains links to third-party websites, merchant platforms, and affiliate networks. We have no
          control over the content, privacy practices, or data collection policies of these third-party websites. We
          strongly encourage you to review the privacy policy of any third-party website you visit. Our Privacy
          Policy applies only to{' '}
          <a href="https://www.cloudbasket.co" className="text-skyline-primary underline">www.cloudbasket.co</a>.
        </p>
      </Section>

      {/* Section 14 */}
      <Section id="s14" title="Section 14 — Consent and Withdrawal">
        <p className="font-black">14.1 Basis of Consent</p>
        <p>Where we rely on your consent, such consent is:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><strong>Free</strong> — not bundled with access to content</li>
          <li><strong>Specific</strong> — collected for a named, specific purpose</li>
          <li><strong>Informed</strong> — clearly explained via our cookie banner and this Policy</li>
          <li>
            <strong>Unambiguous</strong> — obtained through a clear affirmative action (e.g., clicking
            &quot;Accept&quot;)
          </li>
        </ul>
        <p>
          Compliant with Section 6(1) of the DPDP Act 2023 and Rule 4 of the DPDP Rules 2025.
        </p>

        <p className="font-black">14.2 Withdrawing Consent</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            For cookies: Use the &quot;Manage Preferences&quot; option in our cookie consent banner
          </li>
          <li>
            For newsletters: Click &quot;Unsubscribe&quot; in any email we send you
          </li>
          <li>
            For all other processing: Email{' '}
            <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
            {' '}with subject &quot;Consent Withdrawal&quot;
          </li>
        </ul>
        <p>
          Withdrawal does not affect the lawfulness of any processing carried out prior to withdrawal.
        </p>
      </Section>

      {/* Section 15 */}
      <Section id="s15" title="Section 15 — Data Breach Notification">
        <p>
          In the event of a personal data breach likely to result in risk to your rights or interests, we will:
        </p>
        <ol className="ml-4 list-decimal space-y-2">
          <li>
            Notify the Data Protection Board of India (DPBI) as required under Section 8(6) of the DPDP Act 2023
            and Rule 7 of the DPDP Rules 2025
          </li>
          <li>
            Notify affected Data Principals via email or prominent website notice, within a reasonable time
          </li>
          <li>
            Take immediate remedial action to contain the breach and prevent further exposure
          </li>
        </ol>
        <p>
          Breach notifications will include: nature of the breach, data affected, likely consequences, and steps
          taken.
        </p>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p>
            Failure to notify carries a penalty of up to <strong>₹200 crore</strong> under the DPDP Act — we treat
            breach response as a <strong>Priority Zero</strong> obligation.
          </p>
        </div>
      </Section>

      {/* Section 16 */}
      <Section id="s16" title="Section 16 — Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in law, technology, or our
          practices.
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            We will notify you of significant changes by posting the updated Policy with a revised &quot;Last
            Updated&quot; date
          </li>
          <li>
            For material changes, we will display a prominent notice on our Website homepage for at least 30 days
          </li>
          <li>
            Continued use of the Website after the effective date constitutes your acknowledgment of the updated
            Policy
          </li>
        </ul>
      </Section>

      {/* Section 17 */}
      <Section id="s17" title="Section 17 — Contact, Grievance Redressal & Data Protection Board">
        <div className="rounded-xl bg-[var(--cb-surface-2)] p-4 space-y-1">
          <p className="font-black">17.1 Contact Us</p>
          <p>Privacy &amp; Compliance Officer, NEXQON HOLDINGS — IBF Document Division</p>
          <p>Kadapa, Andhra Pradesh – 516002, India</p>
          <p>
            Email:{' '}
            <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
            {' '}| Website:{' '}
            <a href="https://www.cloudbasket.co" className="text-skyline-primary underline">www.cloudbasket.co</a>
            {' '}| Response Time: Within 30 days
          </p>
        </div>

        <p className="font-black">17.2 Grievance Redressal — IT Rules 2021</p>
        <p>
          In compliance with Rule 3(1)(c) of the IT (Intermediary Guidelines) Rules 2021:
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Grievances acknowledged within 24 hours</li>
          <li>Grievances resolved within 15 days of receipt</li>
          <li>
            Submit to:{' '}
            <a href="mailto:info@cloudbasket.co" className="text-skyline-primary underline">info@cloudbasket.co</a>
            {' '}with subject &quot;Grievance — [Issue Description]&quot;
          </li>
        </ul>

        <p className="font-black">17.3 Data Protection Board of India (DPBI)</p>
        <p>
          If your grievance is not resolved, you may escalate to the Data Protection Board of India (DPBI),
          established under Section 18 of the DPDP Act 2023. The DPBI operates as a digital-first office.
        </p>
        <p>
          DPBI Official Website:{' '}
          <a
            href="https://www.meity.gov.in"
            className="text-skyline-primary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.meity.gov.in
          </a>
          {' '}(monitor for DPBI operational link)
        </p>

        <p>
          <strong>17.4 EU Supervisory Authority:</strong> EU/EEA users not satisfied with our response may lodge a
          complaint with the data protection supervisory authority in their country of residence or place of work.
        </p>
      </Section>

      {/* Bottom PDF button */}
      <div className="mt-10 flex justify-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="cb-btn cb-btn-primary gap-2"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>
    </main>
  )
}
