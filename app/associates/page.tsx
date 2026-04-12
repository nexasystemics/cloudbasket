import type { Metadata } from 'next'
import AssociatesPageClient from './AssociatesPageClient'

export const metadata: Metadata = {
  title: 'Associates Program — Earn with CloudBasket | Become a Partner',
  description: 'Join the CloudBasket Associates Program. Earn commission by sharing deals. Affiliate marketing India. Earn money blogging India. Price comparison affiliate program.',
  openGraph: {
    title: 'Associates Program — Earn with CloudBasket | Become a Partner',
    description: 'Join the CloudBasket Associates Program. Earn commission by sharing deals. Affiliate marketing India. Earn money blogging India. Price comparison affiliate program.',
    url: 'https://cloudbasket.in/associates',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.in/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Associates Program',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Associates Program — Earn with CloudBasket | Become a Partner',
    description: 'Join the CloudBasket Associates Program. Earn commission by sharing deals. Affiliate marketing India. Earn money blogging India. Price comparison affiliate program.',
    images: ['https://cloudbasket.in/og-image.svg'],
  },
}

export default function AssociatesPage() {
  return <AssociatesPageClient />
}