'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Download, Copy, Check } from 'lucide-react'

const LAST_UPDATED = 'March 2026'

const SECTIONS = [
  { id: 'fiduciary', title: 'Data Fiduciary Identity' },
  { id: 'collected', title: 'What Personal Data We Collect' },
  { id: 'purpose', title: 'Purpose and Legal Basis for Processing' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'rights', title: 'Your Rights Under DPDP Act 2023' },
  { id: 'cookies', title: 'Cookies Policy' },
  { id: 'thirdparty', title: 'Third-Party Links and Affiliate Partners' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'security', title: 'Data Security' },
  { id: 'changes', title: 'Changes to This Policy' },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div id={id} className="border-b border-[var(--cb-border)] py-6">
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpen(!open)}>
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <ChevronDown size={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--cb-text-secondary)]">{children}</div>}
    </div>
  )
}

export default function PrivacyPage() {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    try { navigator.clipboard.writeText('https://cloudbasket.in/legal/privacy'); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* no-op */ }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">Last Updated: {LAST_UPDATED} · DPDP Act 2023 Compliant</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.print()} className="cb-btn cb-btn-ghost gap-2 text-sm"><Download size={16} /> Download PDF</button>
          <button type="button" onClick={handleCopy} className="cb-btn cb-btn-ghost gap-2 text-sm">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied!' : 'Copy Link'}</button>
        </div>
      </div>

      <nav className="cb-card mb-10 p-6 print:hidden">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Table of Contents</p>
        <ol className="space-y-1.5">
          {SECTIONS.map((s, i) => (
            <li key={s.id}><a href={`#${s.id}`} className="text-sm text-skyline-primary hover:underline">{i + 1}. {s.title}</a></li>
          ))}
        </ol>
      </nav>

      <Section id="fiduciary" title="1. Data Fiduciary Identity">
        <p><strong>Platform:</strong> CloudBasket — operated by NEXQON HOLDINGS</p>
        <p><strong>Privacy Contact:</strong> <a href="mailto:privacy@cloudbasket.in" className="text-skyline-primary underline">privacy@cloudbasket.in</a></p>
        <p><strong>Grievance Officer:</strong> Contact privacy@cloudbasket.in — responses within 48 hours as required under DPDP Act 2023.</p>
      </Section>

      <Section id="collected" title="2. What Personal Data We Collect">
        <p><strong>2.1 Data you provide:</strong> Email address (for price alerts and newsletter), Name (optional, for account), Phone (optional, for WhatsApp alerts).</p>
        <p><strong>2.2 Data collected automatically:</strong> Pages visited, products viewed, search queries, affiliate link clicks, device type, browser type, approximate city-level location from IP address.</p>
        <p><strong>2.3 Browser-only data (never transmitted):</strong> Wishlist, recently viewed products, compare list, and feedback — stored in your browser localStorage only.</p>
        <p><strong>2.4 Third-party data:</strong> Google Analytics anonymous usage data, Google AdSense interaction data.</p>
      </Section>

      <Section id="purpose" title="3. Purpose and Legal Basis for Processing">
        <p><strong>Price alert emails:</strong> Consent-based — you opt in when setting an alert.</p>
        <p><strong>Analytics:</strong> Legitimate interest — to improve platform performance.</p>
        <p><strong>Advertising:</strong> Consent-based — managed via our cookie consent banner.</p>
        <p>We do not sell your data to third parties. We do not use your data for profiling for financial or insurance decisions.</p>
      </Section>

      <Section id="retention" title="4. Data Retention">
        <p><strong>Email and alert preferences:</strong> Until you withdraw consent or request deletion.</p>
        <p><strong>Analytics data:</strong> 26 months (Google Analytics default retention).</p>
        <p><strong>Browser-stored data:</strong> Under your control — clear your browser storage to delete.</p>
      </Section>

      <Section id="rights" title="5. Your Rights Under DPDP Act 2023">
        <p>Under India's Digital Personal Data Protection Act 2023, you have the right to:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Access your personal data</li>
          <li>Correction of inaccurate data</li>
          <li>Erasure of your data</li>
          <li>Grievance redressal</li>
          <li>Nominate a representative (in case of death or incapacity)</li>
        </ul>
        <p>Submit requests to: <a href="mailto:privacy@cloudbasket.in" className="text-skyline-primary underline">privacy@cloudbasket.in</a>. We will respond within 30 days.</p>
      </Section>

      <Section id="cookies" title="6. Cookies Policy">
        <p>We use essential cookies for session management, optional analytics cookies (Google Analytics 4), and optional advertising cookies (Google AdSense). Manage your preferences via our cookie consent banner or visit our <Link href="/cookies" className="text-skyline-primary underline">Cookie Policy page</Link>.</p>
      </Section>

      <Section id="thirdparty" title="7. Third-Party Links and Affiliate Partners">
        <p>Clicking affiliate links transfers you to partner platforms (Amazon, Flipkart, etc.). Their privacy policies apply from that point. CloudBasket is not responsible for partner data practices.</p>
      </Section>

      <Section id="children" title="8. Children's Privacy">
        <p>This service is not directed at users under 18 years of age. We do not knowingly collect personal data from minors. If you believe a minor has submitted data, contact privacy@cloudbasket.in immediately.</p>
      </Section>

      <Section id="security" title="9. Data Security">
        <p>We implement HTTPS across all pages, Supabase Row Level Security for database access, and do not store any payment data. We conduct regular security reviews. No system is 100% secure — please use strong passwords and notify us of any suspected breach.</p>
      </Section>

      <Section id="changes" title="10. Changes to This Policy">
        <p>We may update this policy periodically. Registered users will be notified by email of material changes. Continued use of the platform implies acceptance of the updated policy.</p>
      </Section>

      <div className="mt-10 flex justify-center print:hidden">
        <button type="button" onClick={() => window.print()} className="cb-btn cb-btn-primary gap-2"><Download size={16} /> Download PDF</button>
      </div>
    </main>
  )
}