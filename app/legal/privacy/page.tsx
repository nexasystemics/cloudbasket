import type { Metadata } from 'next'
import { FileText, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | CloudBasket',
  description: 'CloudBasket privacy policy. DPDPA 2023 and GDPR compliant data handling.',
}

const SECTIONS = [
  {
    title: '1. Data We Collect',
    content:
      'We collect minimal data required to operate the service. For non-authenticated users, we collect no personally identifiable information. For registered users, we collect email address and usage preferences only. We do not collect financial data of any kind.',
  },
  {
    title: '2. How We Use Your Data',
    content:
      'Your data is used solely to personalize your experience, maintain your preferences (currency, language, wishlist) and send you deal alerts you have explicitly opted into. We never sell your data to third parties.',
  },
  {
    title: '3. Affiliate Disclosure',
    content:
      'CloudBasket earns commission from affiliate partners (Amazon, Flipkart, CJ Affiliate) when you click through and make a purchase. This does not affect the prices you pay. All affiliate relationships are disclosed in compliance with FTC guidelines.',
  },
  {
    title: '4. DPDPA 2023 Compliance',
    content:
      'CloudBasket complies fully with the Digital Personal Data Protection Act 2023 of India. You have the right to access, correct and delete your personal data at any time. Contact us at privacy@cloudbasket.in to exercise these rights.',
  },
  {
    title: '5. GDPR Rights (EU Users)',
    content:
      'EU users have full GDPR rights including the right to erasure, data portability and restriction of processing. We maintain data processing records and appoint a data protection representative for EU users.',
  },
  {
    title: '6. Cookies',
    content:
      'We use essential cookies for authentication and preferences. Analytics cookies require your explicit consent via our cookie banner. You may withdraw consent at any time.',
  },
  {
    title: '7. Contact',
    content:
      'For privacy inquiries: privacy@cloudbasket.in. For data deletion requests, we respond within 30 days as required by DPDPA 2023.',
  },
] as const

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <Shield size={40} className="text-skyline-primary" />
        <h1 className="mt-4 font-display text-3xl font-black text-[var(--cb-text-primary)]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
          Last updated: March 2026 · DPDPA 2023 & GDPR Compliant
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="cb-badge bg-skyline-glow text-skyline-primary">DPDPA 2023</span>
          <span className="cb-badge bg-skyline-glow text-skyline-primary">GDPR</span>
          <span className="cb-badge bg-skyline-glow text-skyline-primary">FTC</span>
        </div>

        <div className="mt-8 border-t cb-border" />

        <section className="mt-8 space-y-10">
          {SECTIONS.map((section) => (
            <article key={section.title}>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text-primary)]">
                <FileText size={16} className="text-[var(--cb-text-muted)]" />
                {section.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--cb-text-secondary)]">{section.content}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
