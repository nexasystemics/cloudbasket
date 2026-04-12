// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/cookies/page.tsx
import type { Metadata } from 'next'
import CookiePolicyClient from './CookiePolicyClient'

export const metadata: Metadata = {
  title: 'Cookie Policy | CloudBasket Legal',
  description: 'Detailed disclosure of cookies and tracking technologies used on CloudBasket. Learn how we protect your privacy in compliance with DPDP Act 2023.',
  openGraph: {
    title: 'Cookie Policy | CloudBasket Legal',
    description: 'Detailed disclosure of cookies and tracking technologies used on CloudBasket. Learn how we protect your privacy in compliance with DPDP Act 2023.',
    url: 'https://cloudbasket.in/legal/cookies',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.in/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Cookie Policy',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | CloudBasket Legal',
    description: 'Detailed disclosure of cookies and tracking technologies used on CloudBasket. Learn how we protect your privacy in compliance with DPDP Act 2023.',
    images: ['https://cloudbasket.in/og-image.svg'],
  },
}

export default function CookiePolicyPage() {
  return <CookiePolicyClient />
}
