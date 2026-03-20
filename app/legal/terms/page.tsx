'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown, Download, Copy, Check } from 'lucide-react'

const LAST_UPDATED = 'March 2026'

const SECTIONS = [
  { id: 'introduction', title: 'Introduction and Acceptance' },
  { id: 'description', title: 'Description of Service' },
  { id: 'eligibility', title: 'User Eligibility' },
  { id: 'affiliate', title: 'Affiliate Disclosure and Commission' },
  { id: 'pod', title: 'Print-on-Demand Terms' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'privacy', title: 'Privacy and Data' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'governing', title: 'Governing Law' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'contact', title: 'Contact for Legal Notices' },
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
        <ChevronDown size={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--cb-text-secondary)]">{children}</div>}
    </div>
  )
}

export default function TermsPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText('https://cloudbasket.in/legal/terms')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* no-op */ }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Terms of Service</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">Last Updated: {LAST_UPDATED}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.print()} className="cb-btn cb-btn-ghost gap-2 text-sm">
            <Download size={16} /> Download PDF
          </button>
          <button type="button" onClick={handleCopy} className="cb-btn cb-btn-ghost gap-2 text-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="cb-card mb-10 p-6 print:hidden">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Table of Contents</p>
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

      <Section id="introduction" title="1. Introduction and Acceptance">
        <p>Welcome to CloudBasket. By accessing or using this platform, you agree to these Terms of Service. CloudBasket operates as a price aggregation and comparison service. We do not sell products directly, process payments, or fulfil orders.</p>
        <p>Clicking an affiliate link transfers you to the respective partner platform where their terms and checkout process apply.</p>
      </Section>

      <Section id="description" title="2. Description of Service">
        <p><strong>2.1 Price Aggregation:</strong> We collect and display product prices from partner platforms for comparison purposes.</p>
        <p><strong>2.2 Affiliate Redirection:</strong> Deal links redirect to partner platforms. We earn a commission on qualifying purchases.</p>
        <p><strong>2.3 Print-on-Demand:</strong> Certain products are manufactured and fulfilled by third-party POD partners.</p>
        <p><strong>2.4 Price Alert Service:</strong> Email notifications when tracked product prices meet your target.</p>
        <p><strong>2.5 Display Advertising:</strong> We display ads via Google AdSense to support free platform access.</p>
      </Section>

      <Section id="eligibility" title="3. User Eligibility">
        <p>You must be 18 years or older, or have guardian consent to use this platform. You must be a resident of India or accessing the platform for personal use. Account registration is optional but required for price alerts and wishlist features.</p>
      </Section>

      <Section id="affiliate" title="4. Affiliate Disclosure and Commission">
        <p>CloudBasket earns commissions from affiliate partners including Amazon Associates India, Flipkart Affiliate Program, and Commission Junction network merchants. Prices shown are indicative and may differ on partner platforms. We are not responsible for price accuracy on partner sites.</p>
      </Section>

      <Section id="pod" title="5. Print-on-Demand Terms">
        <p>POD products are manufactured and fulfilled by third-party partners. Delivery estimates, quality standards, and return policies are governed by the fulfiller's policies. CloudBasket is the design creator, not the product seller. For POD enquiries contact support@cloudbasket.in.</p>
      </Section>

      <Section id="ip" title="6. Intellectual Property">
        <p>The CloudBasket name, logo, and platform design are proprietary to NEXQON HOLDINGS. Product names, images, and trademarks belong to their respective brand owners. User-submitted reviews grant CloudBasket a non-exclusive licence to display that content on the platform.</p>
      </Section>

      <Section id="privacy" title="7. Privacy and Data">
        <p>We collect email addresses for price alerts, search queries for relevance, and anonymous usage data for analytics. We do not collect payment data or checkout information. Refer to our <Link href="/legal/privacy" className="text-skyline-primary underline">Privacy Policy</Link> for full details.</p>
      </Section>

      <Section id="liability" title="8. Limitation of Liability">
        <p>CloudBasket is not liable for: price differences on partner platforms, product quality or availability, delivery failures, partner platform downtime, affiliate link failures, or any consequential damages arising from use of this platform.</p>
      </Section>

      <Section id="governing" title="9. Governing Law">
        <p>These terms are governed by Indian law. Disputes are subject to the jurisdiction of courts in India. Consumer protection rights are preserved under the Consumer Protection Act 2019.</p>
      </Section>

      <Section id="changes" title="10. Changes to Terms">
        <p>We reserve the right to modify these terms at any time. Continued use of the platform implies acceptance of updated terms. Material changes will be notified via email to registered users.</p>
      </Section>

      <Section id="contact" title="11. Contact for Legal Notices">
        <p>For legal enquiries and notices, contact us at: <a href="mailto:legal@cloudbasket.in" className="text-skyline-primary underline">legal@cloudbasket.in</a></p>
        <p>NEXQON HOLDINGS — cloudbasket.in</p>
      </Section>

      <div className="mt-10 flex justify-center gap-4 print:hidden">
        <button type="button" onClick={() => window.print()} className="cb-btn cb-btn-primary gap-2">
          <Download size={16} /> Download PDF
        </button>
      </div>
    </main>
  )
}