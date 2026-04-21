import type { Metadata } from 'next'
import DealsPageClient from './DealsPageClient'

export const metadata: Metadata = {
  title: 'Today\'s Best Deals & Price Drops | CloudBasket',
  description: 'Discover the latest price drops and deals across Amazon, Flipkart, and more. Verified savings on electronics, fashion, home, and more updated in real-time.',
  openGraph: {
    title: 'Today\'s Best Deals & Price Drops | CloudBasket',
    description: 'Discover the latest price drops and deals across Amazon, Flipkart, and more. Verified savings on electronics, fashion, home, and more updated in real-time.',
    url: 'https://cloudbasket.co/deals',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.co/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Best Deals',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Today\'s Best Deals & Price Drops | CloudBasket',
    description: 'Discover the latest price drops and deals across Amazon, Flipkart, and more. Verified savings on electronics, fashion, home, and more updated in real-time.',
    images: ['https://cloudbasket.co/og-image.svg'],
  },
}

export default function DealsPage() {
  return <DealsPageClient />
}
