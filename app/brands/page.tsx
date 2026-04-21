import type { Metadata } from 'next'
import BrandsPageClient from './BrandsPageClient'

export const metadata: Metadata = {
  title: 'Brand Directory | CloudBasket',
  description: 'Explore the full list of brands available on CloudBasket. Discover products and compare prices from Amazon, Flipkart, and more across all top brands.',
  openGraph: {
    title: 'Brand Directory | CloudBasket',
    description: 'Explore the full list of brands available on CloudBasket. Discover products and compare prices from Amazon, Flipkart, and more across all top brands.',
    url: 'https://cloudbasket.co/brands',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.co/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Brand Directory',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Directory | CloudBasket',
    description: 'Explore the full list of brands available on CloudBasket. Discover products and compare prices from Amazon, Flipkart, and more across all top brands.',
    images: ['https://cloudbasket.co/og-image.svg'],
  },
}

export default function BrandsPage() {
  return <BrandsPageClient />
}
