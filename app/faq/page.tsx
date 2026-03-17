// Estimated: ~120 lines
// Purpose: FAQ landing page with structured data (FAQPage).

import type { Metadata } from 'next'
import FAQPageClient from './FAQPageClient'

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | CloudBasket",
  description:
    'Read CloudBasket FAQs to understand price comparison, deal tracking, affiliate links, product discovery, alerts, privacy practices, and platform features.',
}

const FAQ_DATA = [
  {
    q: 'What is CloudBasket?',
    a: "CloudBasket is the world's smartest price comparison platform. We track prices across 50+ retailers including Amazon, Flipkart, and CJ Global to help you find the best deal. We never sell products directly — we only show you where to buy at the lowest price.",
  },
  {
    q: 'Is CloudBasket free to use?',
    a: '100% free for shoppers. Always. We earn through affiliate commissions when you click a deal link — at no extra cost to you.',
  },
  {
    q: 'How often are prices updated?',
    a: 'Prices are updated every hour from all 50+ partner stores. Flash deals are monitored in near real-time.',
  },
  {
    q: 'What data do you collect?',
    a: "We collect email (if you register), search queries, and click data for analytics. We comply fully with India's DPDPA 2023.",
  },
  {
    q: 'What is Print on Demand?',
    a: 'CloudBasket POD lets you buy custom-designed merchandise — t-shirts, mugs, phone cases — printed on demand with no inventory. Products ship within 5-7 business days.',
  },
]

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FAQPageClient />
    </>
  )
}
