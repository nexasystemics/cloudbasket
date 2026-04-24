import type { Metadata } from 'next'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_LOCALE } from '@/lib/constants'
import PricingPageClient from './PricingPageClient'

const PRICING_TITLE = `Pricing — ${SITE_NAME}`

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: PRICING_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/pricing`,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: DEFAULT_LOCALE,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PRICING_TITLE,
    images: [`${SITE_URL}/og-image.png`],
  },
}

export default function PricingPage() {
  return <PricingPageClient />
}
