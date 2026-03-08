import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import CookieConsent from '@/components/CookieConsent'
import FestivalBanner from '@/components/FestivalBanner'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SchemaMarkup from '@/components/SchemaMarkup'
import CBThemeProvider from '@/components/ThemeProvider'
import { GlobalProvider } from '@/context/GlobalContext'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://cloudbasket.vercel.app'),
  title: {
    default: "CloudBasket — India's Best Price Comparison",
    template: '%s | CloudBasket',
  },
  description:
    'Compare prices across Amazon, Flipkart & 50+ stores. Find the best deals on mobiles, laptops, fashion and more. Zero checkout. Pure discovery.',
  keywords: [
    'price comparison',
    'best deals india',
    'amazon flipkart compare',
    'lowest price',
    'cloudbasket',
    'deal finder india',
  ],
  authors: [{ name: 'NEXQON Engineering', url: 'https://nexqon.com' }],
  creator: 'NEXQON Holdings',
  publisher: 'CloudBasket',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://cloudbasket.vercel.app',
    siteName: 'CloudBasket',
    title: "CloudBasket — India's Best Price Comparison",
    description: 'Compare prices across 50+ stores. Zero checkout.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudBasket — Price Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "CloudBasket — India's Best Price Comparison",
    description: 'Compare prices across 50+ stores. Zero checkout.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/brand/favicon.svg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--cb-surface)] font-sans text-[var(--cb-text-primary)] antialiased transition-colors duration-300">
        <GlobalProvider>
          <CBThemeProvider>
            <SchemaMarkup type="website" data={{}} />
            <FestivalBanner />
            <Header />
            <main>{children}</main>
            <Footer />
            <CookieConsent />
          </CBThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
