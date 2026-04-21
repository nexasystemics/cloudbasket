import type { Metadata } from 'next'
import CareersPageClient from './CareersPageClient'

export const metadata: Metadata = {
  title: 'Join the Team | CloudBasket Careers',
  description: 'Help us build the future of smart shopping in India. Explore open positions in Engineering, Marketing, Design, and more at CloudBasket.',
  openGraph: {
    title: 'Join the Team | CloudBasket Careers',
    description: 'Help us build the future of smart shopping in India. Explore open positions in Engineering, Marketing, Design, and more at CloudBasket.',
    url: 'https://cloudbasket.co/careers',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.co/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Careers',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Team | CloudBasket Careers',
    description: 'Help us build the future of smart shopping in India. Explore open positions in Engineering, Marketing, Design, and more at CloudBasket.',
    images: ['https://cloudbasket.co/og-image.svg'],
  },
}

export default function CareersPage() {
  return <CareersPageClient />
}
