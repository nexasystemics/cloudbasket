import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | CloudBasket',
  description: 'Terms governing use of CloudBasket discovery and affiliate redirection platform.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By using CloudBasket, you agree to these Terms of Service and all applicable legal requirements. If you do not agree, discontinue use of the platform immediately.',
  },
  {
    title: '2. Nature of Service (Discovery Only)',
    content:
      'CloudBasket is a zero-checkout product discovery platform. We do not process payments, manage carts, or execute purchase transactions. All purchases are completed on third-party retailer websites.',
  },
  {
    title: '3. Affiliate Links Disclaimer',
    content:
      'CloudBasket uses affiliate links and may earn commission when users purchase through partner retailers. This relationship does not alter listed prices and is disclosed as required by FTC guidance.',
  },
  {
    title: '4. Limitation of Liability',
    content:
      'CloudBasket is not responsible for pricing changes, stock differences, delivery issues, warranties, or merchant conduct on external retail websites. Users should verify final terms before purchase.',
  },
  {
    title: '5. Governing Law (India, DPDPA 2023)',
    content:
      'These terms are governed by Indian law. Data handling and privacy commitments align with DPDPA 2023. Any disputes are subject to jurisdiction within India.',
  },
] as const

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <FileText size={40} className="text-skyline-primary" />
        <h1 className="mt-4 font-display text-3xl font-black text-[var(--cb-text-primary)]">Terms of Service</h1>
        <p className="mt-2 text-sm text-[var(--cb-text-muted)]">Last updated: March 2026</p>
        <div className="mt-8 border-t cb-border" />

        <section className="mt-8 space-y-10">
          {SECTIONS.map((section) => (
            <article key={section.title}>
              <h2 className="text-lg font-bold text-[var(--cb-text-primary)]">{section.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--cb-text-secondary)]">{section.content}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
