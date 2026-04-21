import type { Metadata } from 'next'
import PrivacyPolicyClient from './PrivacyPolicyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy | CloudBasket Legal',
  description: 'How we handle your data at CloudBasket. Zero-account, zero-transaction platform committed to your privacy and DPDP Act 2023 compliance.',
  openGraph: {
    title: 'Privacy Policy | CloudBasket Legal',
    description: 'How we handle your data at CloudBasket. Zero-account, zero-transaction platform committed to your privacy and DPDP Act 2023 compliance.',
    url: 'https://cloudbasket.co/legal/privacy',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.co/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Privacy Policy',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | CloudBasket Legal',
    description: 'How we handle your data at CloudBasket. Zero-account, zero-transaction platform committed to your privacy and DPDP Act 2023 compliance.',
    images: ['https://cloudbasket.co/og-image.svg'],
  },
}

export default function PrivacyPage() {
  return <PrivacyPolicyClient />
}
