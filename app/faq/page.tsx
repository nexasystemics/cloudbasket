'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    question: 'How does CloudBasket make money?',
    answer:
      'CloudBasket earns affiliate commission when users click our /go links and complete purchases on partner platforms. This commission comes from retailers, not from users. Prices shown to users are not increased by this model.',
  },
  {
    question: 'Do I complete my purchase on CloudBasket?',
    answer:
      'No. CloudBasket is a zero-checkout discovery platform only. Every purchase is completed on the retailer website after secure redirect.',
  },
  {
    question: 'Are the prices shown real-time?',
    answer:
      'Prices are refreshed frequently but retailer pages remain the final source of truth. During high-traffic sale windows, a short delay can happen. Always verify final checkout pricing on the destination store.',
  },
  {
    question: 'How do I become a CloudBasket Associate?',
    answer:
      'You can apply through the Associates program page and submit basic profile details. Approved associates receive tracking-ready links and dashboard access. Most applications are reviewed within 48 hours.',
  },
  {
    question: 'Is my data safe with CloudBasket?',
    answer:
      'CloudBasket follows DPDPA 2023 and GDPR-aligned handling principles. We minimize personal data collection and never store payment credentials. Users can request deletion through privacy support channels.',
  },
  {
    question: 'What is the /go/ redirect link?',
    answer:
      'The /go path is CloudBasket\'s secure affiliate redirect layer. It routes users to partner listings while preserving attribution integrity. This improves link reliability and auditability across campaigns.',
  },
  {
    question: 'Which stores does CloudBasket compare?',
    answer:
      'CloudBasket currently covers major affiliate networks including Amazon, Flipkart and CJ Affiliate partners. Coverage continues to expand by category. Only verified sources are surfaced in core listings.',
  },
  {
    question: 'How do I report a wrong price?',
    answer:
      'If you notice a mismatch, use contact channels and share the product URL and timestamp. The team reviews and updates feed quality continuously. Critical pricing issues are prioritized for fast correction.',
  },
  {
    question: 'Is CloudBasket DPDPA 2023 compliant?',
    answer:
      'Yes. CloudBasket privacy and retention policy is aligned with DPDPA 2023 requirements. Users can request access, correction or deletion of personal data where applicable.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Send a deletion request through privacy support with your registered email. After verification, account-linked data is removed within policy timelines. Confirmation is provided once deletion is complete.',
  },
] as const

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number): void => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <header>
          <h1 className="flex items-center gap-2 font-display text-3xl font-black text-[var(--cb-text-primary)]">
            <HelpCircle size={30} className="text-skyline-primary" />
            Frequently Asked Questions
          </h1>
        </header>

        <section className="mt-10 space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <article key={item.question} className="cb-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-5 text-start"
                >
                  <span className="text-base font-bold text-[var(--cb-text-primary)]">{item.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[var(--cb-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t cb-border p-5 pt-4">
                    <p className="text-sm leading-relaxed text-[var(--cb-text-secondary)]">{item.answer}</p>
                  </div>
                )}
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}
