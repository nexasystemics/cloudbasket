// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/cookies/CookiePolicyClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Download, ChevronRight } from 'lucide-react'

const EFFECTIVE_DATE = '01 April 2026'
const LAST_UPDATED = '01 April 2026'
const VERSION = '2.0 — 2026 Compliance Final'

const TOC_ITEMS = [
  { id: 's1',  label: '1. What Are Cookies?' },
  { id: 's2',  label: '2. Tracking Technologies We Use' },
  { id: 's3',  label: '3. Cookies We Use — Full Technical Disclosure' },
  { id: 's4',  label: '4. Cookie Consent — Your Choices' },
  { id: 's5',  label: '5. Legal Basis for Cookie Processing' },
  { id: 's6',  label: '6. Third-Party Cookies and External Services' },
  { id: 's7',  label: '7. Do Not Track (DNT) and Global Privacy Control (GPC)' },
  { id: 's8',  label: '8. How to Control Cookies' },
  { id: 's9',  label: '9. Changes to This Policy' },
  { id: 's10', label: '10. Contact and Grievance Officer' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div id={id} className="border-b border-[var(--cb-border)] py-6 scroll-mt-24">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
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
  return <th className="bg-[var(--cb-surface-2)] px-4 py-2 text-left font-black">{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="border-t border-[var(--cb-border)] px-4 py-2 align-top">{children}</td>
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[var(--cb-surface-2)] px-1.5 py-0.5 font-mono text-[11px]">{children}</code>
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs dark:border-amber-900/40 dark:bg-amber-950/30">
      {children}
    </div>
  )
}

export default function CookiePolicyClient() {
  return (
    <article className="pb-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[var(--cb-text-muted)]">
        <Link href="/" className="hover:text-[#039BE5]">Home</Link>
        <ChevronRight size={12} />
        <Link href="/legal" className="hover:text-[#039BE5]">Legal</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-[var(--cb-text-primary)]">Cookie Policy</span>
      </nav>

      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#039BE5]">NEXQON HOLDINGS — CloudBasket</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Cookie Policy</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--cb-text-muted)]">
            <span><strong>Effective:</strong> {EFFECTIVE_DATE}</span>
            <span><strong>Updated:</strong> {LAST_UPDATED}</span>
            <span><strong>Version:</strong> {VERSION}</span>
          </div>
          <p className="mt-2 text-xs text-[var(--cb-text-muted)]">
            Drafted in compliance with DPDP Act 2023, DPDP Rules November 2025, IT Act 2000,
            ePrivacy Directive (EU), GDPR Article 6, Google AdSense Publisher Policies 2025,
            Amazon Associates OA October 2025, IAB TCF 2.2.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--cb-border)] px-4 py-2.5 text-xs font-bold text-[var(--cb-text-secondary)] transition-colors hover:bg-[var(--cb-surface-2)] print:hidden"
        >
          <Download size={14} />
          Download PDF
        </button>
      </div>

      {/* Table of Contents */}
      <div className="mb-10 rounded-2xl border border-[var(--cb-border)] bg-[var(--cb-surface-2)] p-6 print:hidden">
        <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Table of Contents</p>
        <ol className="space-y-2">
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm font-medium text-[#039BE5] hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Section 1 ── */}
      <Section id="s1" title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device (computer, smartphone, or tablet) when you visit a
          website. They allow the website to recognise your device, store your preferences, analyse how you use
          the site, and in some cases, deliver advertising.
        </p>
        <p>
          Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the{' '}
          <strong>DPDP Rules notified on 14 November 2025</strong>, cookies and similar tracking technologies
          that collect or process data linked to an identifiable individual constitute <strong>personal data</strong>.
          CloudBasket is committed to full compliance with all applicable laws governing cookie use.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">1.1 Types of Cookies by Duration</h3>
        <TableWrapper>
          <thead><tr><Th>Type</Th><Th>Description</Th></tr></thead>
          <tbody>
            <tr><Td><strong>Session Cookies</strong></Td><Td>Deleted automatically when you close your browser</Td></tr>
            <tr><Td><strong>Persistent Cookies</strong></Td><Td>Remain on your device for a defined period or until manually deleted</Td></tr>
          </tbody>
        </TableWrapper>

        <h3 className="font-black text-[var(--cb-text-primary)]">1.2 Types of Cookies by Origin</h3>
        <TableWrapper>
          <thead><tr><Th>Type</Th><Th>Description</Th></tr></thead>
          <tbody>
            <tr><Td><strong>First-Party Cookies</strong></Td><Td>Set directly by CloudBasket (cloudbasket.in)</Td></tr>
            <tr><Td><strong>Third-Party Cookies</strong></Td><Td>Set by external services we use (Google, Cloudflare, affiliate networks)</Td></tr>
          </tbody>
        </TableWrapper>
      </Section>

      {/* ── Section 2 ── */}
      <Section id="s2" title="2. Tracking Technologies We Use">
        <p>
          In addition to cookies, CloudBasket and its third-party service providers may use the following
          tracking technologies, all of which are governed by this Policy and subject to the same consent requirements:
        </p>
        <TableWrapper>
          <thead><tr><Th>Technology</Th><Th>Description</Th><Th>Consent Required</Th></tr></thead>
          <tbody>
            <tr><Td><strong>HTTP Cookies</strong></Td><Td>Standard browser cookies</Td><Td>Yes (non-essential)</Td></tr>
            <tr><Td><strong>localStorage</strong></Td><Td>Browser-based local storage used by Google Analytics 4 for session data</Td><Td>Yes (analytics)</Td></tr>
            <tr><Td><strong>sessionStorage</strong></Td><Td>Temporary session-based storage, cleared on browser close</Td><Td>Yes (analytics)</Td></tr>
            <tr><Td><strong>Tracking Pixels</strong></Td><Td>Tiny image files used for conversion tracking by affiliate networks</Td><Td>Yes (advertising)</Td></tr>
          </tbody>
        </TableWrapper>
        <Note>
          <strong>DPDP Rules 2025 Notice:</strong> MeitY guidance confirms that all tracking technologies —
          including cookies, localStorage, sessionStorage, and pixels — that collect personal data are covered
          by the DPDP Act 2023 and require consent where they process personal data for non-essential purposes.
        </Note>
      </Section>

      {/* ── Section 3 ── */}
      <Section id="s3" title="3. Cookies We Use — Full Technical Disclosure">
        <p>
          Cookies on CloudBasket fall into four categories. Below is a complete, technically accurate disclosure
          of all cookies currently in use.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">3.1 Strictly Necessary Cookies</h3>
        <p>
          These cookies are essential for the Website to function securely and correctly. They cannot be disabled.
          Under Indian law and the ePrivacy Directive, strictly necessary cookies are{' '}
          <strong>exempt from consent requirements</strong> as they serve a legitimate security and operational interest.
        </p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td><Code>__cf_bm</Code></Td><Td>Cloudflare</Td><Td>Bot management and automated traffic detection</Td><Td>30 minutes</Td></tr>
            <tr><Td><Code>cf_clearance</Code></Td><Td>Cloudflare</Td><Td>Security challenge clearance — confirms human visitor</Td><Td>30 days – 1 year</Td></tr>
            <tr><Td><Code>cf_chl</Code></Td><Td>Cloudflare</Td><Td>Challenge verification token</Td><Td>Session</Td></tr>
            <tr><Td><Code>cookieconsent_status</Code></Td><Td>CloudBasket</Td><Td>Stores your cookie consent choice</Td><Td>1 year</Td></tr>
          </tbody>
        </TableWrapper>
        <Note>
          <strong>Note on Cloudflare Cookies:</strong> Cloudflare is our CDN and DDoS protection provider.
          Its cookies (<Code>__cf_bm</Code>, <Code>cf_clearance</Code>, <Code>cf_chl</Code>) are strictly necessary
          for website security and are classified as exempt from consent under both Indian law and EU ePrivacy guidance.
          The legacy <Code>__cfduid</Code> cookie has been deprecated by Cloudflare and is no longer set.
        </Note>

        <h3 className="font-black text-[var(--cb-text-primary)]">3.2 Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our Website. All analytics data is aggregated
          and anonymised. We use <strong>Google Analytics 4 (GA4)</strong> as our analytics provider.
        </p>
        <p><strong>Legal basis:</strong> Your explicit consent (obtainable and withdrawable via our cookie consent banner).</p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td><Code>_ga</Code></Td><Td>Google Analytics 4</Td><Td>Assigns a unique client ID to distinguish users</Td><Td>2 years</Td></tr>
            <tr><Td><Code>_ga_[Property-ID]</Code></Td><Td>Google Analytics 4</Td><Td>Tracks session state and engagement for this GA4 property</Td><Td>2 years</Td></tr>
            <tr><Td><Code>_gid</Code></Td><Td>Google Analytics 4</Td><Td>Distinguishes users across sessions</Td><Td>24 hours</Td></tr>
            <tr><Td><Code>_gat</Code></Td><Td>Google Analytics 4</Td><Td>Throttles the request rate to Google Analytics servers</Td><Td>1 minute</Td></tr>
            <tr><Td><Code>_gcl_au</Code></Td><Td>Google (Conversion Linker)</Td><Td>Links advertising conversions across domains</Td><Td>90 days</Td></tr>
            <tr><Td><Code>_gl</Code></Td><Td>Google Analytics 4</Td><Td>Stores campaign parameters for attribution</Td><Td>90 days (session)</Td></tr>
          </tbody>
        </TableWrapper>
        <Note>
          <strong>Important — Discontinued Cookies:</strong> The <Code>__utmz</Code> and <Code>__utma</Code> cookies
          belong to Universal Analytics (UA), which was permanently discontinued by Google in July 2023. These cookies
          are <strong>no longer set</strong> by GA4 and have been removed from this Policy accordingly.
        </Note>
        <Note>
          <strong>GA4 and localStorage:</strong> In addition to cookies, GA4 may use browser{' '}
          <strong>localStorage</strong> and <strong>sessionStorage</strong> to store session identifiers (<Code>_ga</Code>,{' '}
          <Code>_gid</Code>). These are subject to the same consent requirements as analytics cookies.{' '}
          <strong>Google Signals</strong> is <strong>disabled</strong> on our GA4 property to minimise
          cross-device tracking and protect user privacy.
        </Note>

        <h3 className="font-black text-[var(--cb-text-primary)]">3.3 Advertising and Affiliate Cookies</h3>
        <p>
          These cookies are set by advertising networks and affiliate programs to track clicks, attribute conversions,
          and deliver or measure advertisements. They are placed only with your consent.
        </p>
        <p><strong>Legal basis:</strong> Your explicit consent.</p>

        <p className="font-bold text-[var(--cb-text-primary)]">Google AdSense Cookies</p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td><Code>IDE</Code></Td><Td>Google (DoubleClick)</Td><Td>Ad personalisation — stores user preferences for ad targeting</Td><Td>1 year</Td></tr>
            <tr><Td><Code>DSID</Code></Td><Td>Google</Td><Td>Ad serving — identifies signed-in Google users for ad delivery</Td><Td>1 year</Td></tr>
            <tr><Td><Code>NID</Code></Td><Td>Google</Td><Td>Stores user preferences and security tokens</Td><Td>6 months</Td></tr>
            <tr><Td><Code>1P_JAR</Code></Td><Td>Google</Td><Td>Ad personalisation based on recent searches and interactions</Td><Td>1 month</Td></tr>
            <tr><Td><Code>CONSENT</Code></Td><Td>Google</Td><Td>Stores user's consent status for Google services</Td><Td>2 years</Td></tr>
            <tr><Td><Code>ANID</Code></Td><Td>Google</Td><Td>Unique advertising ID for ad personalisation</Td><Td>13 months</Td></tr>
            <tr><Td><Code>test_cookie</Code></Td><Td>Google (DoubleClick)</Td><Td>Checks if the browser supports cookies</Td><Td>Session</Td></tr>
            <tr><Td><Code>gads</Code></Td><Td>Google</Td><Td>Frequency capping and ad performance measurement</Td><Td>90 days</Td></tr>
            <tr><Td><Code>GOOGLE</Code></Td><Td>Google</Td><Td>General Google session identifier</Td><Td>Session</Td></tr>
          </tbody>
        </TableWrapper>

        <p className="font-bold text-[var(--cb-text-primary)]">Amazon Associates Cookies</p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td><Code>tag</Code> (referral parameter)</Td><Td>Amazon Associates</Td><Td>Identifies our affiliate tag on click-through</Td><Td>24 hours</Td></tr>
            <tr><Td><Code>session-id</Code></Td><Td>Amazon</Td><Td>Tracks the user session on Amazon after click</Td><Td>Session</Td></tr>
            <tr><Td><Code>ubid-main</Code></Td><Td>Amazon</Td><Td>Persistent browsing identifier set on Amazon.in</Td><Td>Session / Persistent</Td></tr>
          </tbody>
        </TableWrapper>
        <Note>
          <strong>Amazon Cookie Duration Notice:</strong> When you click an Amazon affiliate link on our Website,
          Amazon sets a referral cookie valid for <strong>24 hours</strong>. If you add a product to your Amazon
          cart within 24 hours of clicking our link, the cookie may extend to <strong>90 days</strong>.{' '}
          <em>As an Amazon Associate, I earn from qualifying purchases.</em>
        </Note>

        <p className="font-bold text-[var(--cb-text-primary)]">Flipkart Affiliate Cookies</p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td>Affiliate referral tag</Td><Td>Flipkart</Td><Td>Identifies our affiliate referral on click-through</Td><Td>30 days</Td></tr>
            <tr><Td><Code>fli</Code></Td><Td>Flipkart</Td><Td>Tracks affiliate referral and conversion</Td><Td>30 days</Td></tr>
          </tbody>
        </TableWrapper>

        <p className="font-bold text-[var(--cb-text-primary)]">CJ Affiliate Cookies</p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td><Code>_cjuid</Code></Td><Td>CJ Affiliate (Commission Junction)</Td><Td>Assigns a unique identifier to track affiliate referrals</Td><Td>13 months</Td></tr>
            <tr><Td><Code>cjaid</Code></Td><Td>CJ Affiliate</Td><Td>Affiliate session and action identifier</Td><Td>Session</Td></tr>
            <tr><Td><Code>cjsid</Code></Td><Td>CJ Affiliate</Td><Td>CJ session tracking</Td><Td>Session</Td></tr>
          </tbody>
        </TableWrapper>

        <h3 className="font-black text-[var(--cb-text-primary)]">3.4 Functional Cookies</h3>
        <p><strong>Legal basis:</strong> Your explicit consent.</p>
        <TableWrapper>
          <thead><tr><Th>Cookie Name</Th><Th>Provider</Th><Th>Purpose</Th><Th>Duration</Th></tr></thead>
          <tbody>
            <tr><Td>Theme preference</Td><Td>CloudBasket</Td><Td>Stores your light/dark mode preference</Td><Td>1 year</Td></tr>
          </tbody>
        </TableWrapper>
        <Note>
          <strong>Note on localStorage for Search:</strong> Recent search terms may be stored in browser{' '}
          <strong>localStorage</strong> (not a cookie) on a session basis. This data never leaves your device
          and is not transmitted to our servers.
        </Note>
      </Section>

      {/* ── Section 4 ── */}
      <Section id="s4" title="4. Cookie Consent — Your Choices">
        <h3 className="font-black text-[var(--cb-text-primary)]">4.1 Our Cookie Consent Banner</h3>
        <p>
          When you first visit <strong>cloudbasket.in</strong>, a cookie consent banner will be displayed.
          In compliance with <strong>Rule 3(1) and Rule 4 of the DPDP Rules 2025</strong>, consent must be
          free, specific, informed, unconditional, and unambiguous.
        </p>
        <TableWrapper>
          <thead><tr><Th>Option</Th><Th>Effect</Th></tr></thead>
          <tbody>
            <tr><Td><strong>Accept All</strong></Td><Td>Enables all cookie categories including analytics, advertising, and functional cookies</Td></tr>
            <tr><Td><strong>Reject All</strong></Td><Td>Enables only strictly necessary cookies — all others are blocked</Td></tr>
            <tr><Td><strong>Manage Preferences</strong></Td><Td>Allows you to toggle individual cookie categories on or off</Td></tr>
          </tbody>
        </TableWrapper>

        <h3 className="font-black text-[var(--cb-text-primary)]">4.2 Changing Your Consent</h3>
        <p>
          You may change your cookie preferences at any time by clicking the{' '}
          <strong>&ldquo;Cookie Settings&rdquo;</strong> link in the website footer.
          This is available on every page of the Website.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">4.3 Withdrawing Consent</h3>
        <p>
          In compliance with <strong>Section 6(4) of the DPDP Act 2023</strong> and{' '}
          <strong>DPDP Rules 2025</strong>, withdrawal of consent is as easy as giving it. To withdraw:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click <strong>&ldquo;Cookie Settings&rdquo;</strong> in the footer → select <strong>&ldquo;Reject All&rdquo;</strong> or toggle off specific categories</li>
          <li>Email us at <a href="mailto:info@cloudbasket.co" className="text-[#039BE5] underline">info@cloudbasket.co</a> with subject: <strong>&ldquo;Cookie Consent Withdrawal&rdquo;</strong></li>
        </ul>
        <p>
          Withdrawal takes effect immediately. Non-essential cookies already set on your device will be blocked
          from firing on your next visit. You may need to clear existing cookies from your browser for immediate effect.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">4.4 Consent Management Platform</h3>
        <p>
          CloudBasket uses an in-built Consent Management Platform (CMP) compliant with DPDP Rules 2025,
          supporting granular consent categories and withdrawal options. For EU/EEA users, our CMP supports{' '}
          <strong>IAB Transparency and Consent Framework (TCF) 2.2</strong> and{' '}
          <strong>Google Consent Mode v2</strong>, ensuring AdSense compliance for European visitors.
        </p>
      </Section>

      {/* ── Section 5 ── */}
      <Section id="s5" title="5. Legal Basis for Cookie Processing">
        <TableWrapper>
          <thead><tr><Th>Cookie Category</Th><Th>Indian Law (DPDP Act 2023)</Th><Th>EU Law (GDPR / ePrivacy)</Th><Th>Consent Required</Th></tr></thead>
          <tbody>
            <tr><Td><strong>Strictly Necessary</strong></Td><Td>Legitimate Use — exempt</Td><Td>Legitimate Interest — exempt</Td><Td>No</Td></tr>
            <tr><Td><strong>Analytics</strong></Td><Td>Consent (Rule 4)</Td><Td>Consent (Article 6(1)(a) GDPR)</Td><Td>Yes</Td></tr>
            <tr><Td><strong>Advertising / Affiliate</strong></Td><Td>Consent (Rule 4)</Td><Td>Consent (Article 6(1)(a) GDPR)</Td><Td>Yes</Td></tr>
            <tr><Td><strong>Functional</strong></Td><Td>Consent (Rule 4)</Td><Td>Legitimate Interest / Consent</Td><Td>Yes</Td></tr>
          </tbody>
        </TableWrapper>

        <h3 className="font-black text-[var(--cb-text-primary)]">5.1 India — DPDP Act 2023</h3>
        <p>
          The DPDP Act 2023 and DPDP Rules (notified 14 November 2025) confirm that cookies and similar
          tracking technologies that process personal data require <strong>valid consent</strong> as defined
          under Rule 3(1). Strictly necessary cookies are exempt under the legitimate use provision.
          Non-compliance with consent requirements may attract penalties of up to{' '}
          <strong>₹250 crore</strong> under the DPDP Act.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">5.2 EU/EEA — ePrivacy Directive and GDPR</h3>
        <p>
          The ePrivacy Directive (2002/58/EC) — which remains in force as of 2026, the proposed ePrivacy
          Regulation not having been enacted — requires prior informed consent for non-essential cookies for
          EU/EEA users. CloudBasket implements GDPR-compliant consent mechanisms via Google Consent Mode v2
          for all EU/EEA visitors.
        </p>
      </Section>

      {/* ── Section 6 ── */}
      <Section id="s6" title="6. Third-Party Cookies and External Services">
        <p>
          When you visit CloudBasket, third-party services may also set cookies on your device. These third
          parties operate under their own privacy and cookie policies, which we encourage you to review:
        </p>
        <TableWrapper>
          <thead><tr><Th>Third Party</Th><Th>Cookie Policy / Opt-Out</Th></tr></thead>
          <tbody>
            <tr><Td>Google Analytics</Td><Td><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">policies.google.com/privacy</a></Td></tr>
            <tr><Td>Google AdSense</Td><Td><a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">policies.google.com/technologies/ads</a></Td></tr>
            <tr><Td>Cloudflare</Td><Td><a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">cloudflare.com/privacypolicy</a></Td></tr>
            <tr><Td>Amazon Associates</Td><Td><a href="https://www.amazon.in/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">Amazon Privacy Policy</a></Td></tr>
            <tr><Td>Flipkart Affiliate</Td><Td><a href="https://www.flipkart.com/pages/privacypolicy" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">Flipkart Privacy Policy</a></Td></tr>
            <tr><Td>CJ Affiliate</Td><Td><a href="https://www.conversantmedia.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">Conversant Privacy Policy</a></Td></tr>
          </tbody>
        </TableWrapper>
        <p>
          <strong>When you click an affiliate link,</strong> you are redirected to the merchant's website.
          From that point, the merchant's own cookie and privacy policy governs all data collection.
          We have no control over cookies set by merchant websites after redirection.
        </p>
      </Section>

      {/* ── Section 7 ── */}
      <Section id="s7" title="7. Do Not Track (DNT) and Global Privacy Control (GPC)">
        <h3 className="font-black text-[var(--cb-text-primary)]">7.1 Do Not Track (DNT)</h3>
        <p>
          Some browsers transmit a "Do Not Track" (DNT) signal to websites. As of 2026, DNT has{' '}
          <strong>no legal binding force</strong> in India, the EU, or the United States, and there is no
          requirement under the DPDP Rules 2025 to honour DNT signals. CloudBasket does not currently
          respond to DNT signals.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">7.2 Global Privacy Control (GPC)</h3>
        <p>
          Global Privacy Control (GPC) is a browser-level signal that indicates a user's preference to opt out
          of certain data processing. GPC is <strong>not legally mandated</strong> in India under the DPDP Act
          2023 or DPDP Rules 2025, and CloudBasket does not currently respond to GPC signals.
        </p>
        <p>
          <strong>To achieve the equivalent outcome</strong>, please use our{' '}
          <strong>Cookie Settings</strong> panel (available in the footer) to manage your preferences directly.
          We review our position on DNT and GPC periodically as the regulatory landscape evolves.
        </p>
      </Section>

      {/* ── Section 8 ── */}
      <Section id="s8" title="8. How to Control Cookies">
        <h3 className="font-black text-[var(--cb-text-primary)]">8.1 Via Our Cookie Consent Tool</h3>
        <p>
          The most effective way to control cookies on CloudBasket is through our{' '}
          <strong>Cookie Settings</strong> panel, accessible at any time from the footer of every page.
        </p>

        <h3 className="font-black text-[var(--cb-text-primary)]">8.2 Via Browser Settings</h3>
        <p>
          You may also control cookies through your browser settings. Note that disabling all cookies may
          affect Website functionality, including the ability to remember your consent choice.
        </p>
        <TableWrapper>
          <thead><tr><Th>Browser</Th><Th>Settings Path</Th></tr></thead>
          <tbody>
            <tr><Td><strong>Google Chrome</strong></Td><Td>Settings → Privacy and Security → Cookies and other site data</Td></tr>
            <tr><Td><strong>Mozilla Firefox</strong></Td><Td>Options → Privacy &amp; Security → Cookies and Site Data</Td></tr>
            <tr><Td><strong>Apple Safari</strong></Td><Td>Preferences → Privacy → Manage Website Data</Td></tr>
            <tr><Td><strong>Microsoft Edge</strong></Td><Td>Settings → Cookies and site permissions → Cookies and site data</Td></tr>
            <tr><Td><strong>Opera</strong></Td><Td>Settings → Advanced → Privacy &amp; security → Cookies</Td></tr>
          </tbody>
        </TableWrapper>

        <h3 className="font-black text-[var(--cb-text-primary)]">8.3 Opt-Out Links — Third-Party Services</h3>
        <TableWrapper>
          <thead><tr><Th>Service</Th><Th>Opt-Out Link</Th></tr></thead>
          <tbody>
            <tr><Td>Google Analytics</Td><Td><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">tools.google.com/dlpage/gaoptout</a></Td></tr>
            <tr><Td>Google Ads Settings</Td><Td><a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">adssettings.google.com</a></Td></tr>
            <tr><Td>Your Online Choices (EU)</Td><Td><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">youronlinechoices.com</a></Td></tr>
            <tr><Td>Network Advertising Initiative (US)</Td><Td><a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">optout.networkadvertising.org</a></Td></tr>
            <tr><Td>Digital Advertising Alliance</Td><Td><a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">optout.aboutads.info</a></Td></tr>
          </tbody>
        </TableWrapper>
      </Section>

      {/* ── Section 9 ── */}
      <Section id="s9" title="9. Changes to This Policy">
        <p>We may update this Cookie Policy periodically to reflect:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Changes in the cookies or tracking technologies we use</li>
          <li>Updates to applicable Indian or international law (including DPDP Rules updates)</li>
          <li>Changes in third-party cookie practices (Google, Amazon, Flipkart, CJ Affiliate)</li>
        </ul>
        <p>
          When we update this Policy, we will revise the <strong>&ldquo;Last Updated&rdquo;</strong> date at
          the top and increment the version number. For significant changes, we will display a notice on our
          Website for at least 30 days.
        </p>
        <p>
          Continued use of the Website after the effective date of any changes constitutes your acknowledgment
          of the updated Policy. We recommend reviewing this Policy periodically.
        </p>
      </Section>

      {/* ── Section 10 ── */}
      <Section id="s10" title="10. Contact and Grievance Officer">
        <div className="rounded-xl border border-[var(--cb-border)] bg-[var(--cb-surface-2)] p-5 font-mono text-xs leading-relaxed">
          <p className="font-bold not-italic">Privacy &amp; Compliance Officer</p>
          <p>NEXQON HOLDINGS — IBF Document Division</p>
          <p>Kadapa, Andhra Pradesh – 516002, India</p>
          <p>Email: <a href="mailto:info@cloudbasket.co" className="text-[#039BE5] underline">info@cloudbasket.co</a></p>
          <p>Website: <a href="https://cloudbasket.in/legal/cookies" className="text-[#039BE5] underline">cloudbasket.in/legal/cookies</a></p>
        </div>

        <h3 className="font-black text-[var(--cb-text-primary)]">Grievance Redressal (IT Rules 2021)</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Grievances acknowledged within <strong>24 hours</strong></li>
          <li>Grievances resolved within <strong>15 days</strong> of receipt</li>
          <li>Subject line: <strong>&ldquo;Cookie Policy Grievance — [Issue Description]&rdquo;</strong></li>
        </ul>

        <h3 className="font-black text-[var(--cb-text-primary)]">Data Protection Board of India (DPBI)</h3>
        <p>
          Unresolved complaints may be escalated to the DPBI, the statutory authority under Section 18 of
          the DPDP Act 2023. Official link:{' '}
          <a href="https://www.meity.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#039BE5] underline">
            meity.gov.in
          </a>
        </p>
      </Section>

      {/* Footer stamp */}
      <div className="mt-10 border-t border-[var(--cb-border)] pt-6 text-[10px] text-[var(--cb-text-muted)]">
        <p>© 2026 NEXQON HOLDINGS | CloudBasket | Cookie Policy Version {VERSION}</p>
        <p className="mt-1">Prepared by IBF Document Division | Chief Legal &amp; Compliance Architect | Classification: PUBLISH-READY</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/legal/privacy" className="text-[#039BE5] underline">Privacy Policy</Link>
          <Link href="/legal/terms" className="text-[#039BE5] underline">Terms of Service</Link>
          <Link href="/legal/affiliate-disclosure" className="text-[#039BE5] underline">Affiliate Disclosure</Link>
        </div>
      </div>
    </article>
  )
}
