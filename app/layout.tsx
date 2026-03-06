import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import CookieConsent from '@/components/CookieConsent'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CBThemeProvider from '@/components/ThemeProvider'
import { GlobalProvider } from '@/context/GlobalContext'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CloudBasket — Everything in One Basket',
    template: '%s | CloudBasket',
  },
  description: SITE_DESCRIPTION,
  keywords: ['price comparison', 'deals', 'Amazon', 'Flipkart', 'India shopping', 'affiliate', 'CloudBasket'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'CloudBasket — Everything in One Basket',
    description: SITE_DESCRIPTION,
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudBasket',
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: { icon: '/brand/favicon.svg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--cb-surface)] font-sans text-[var(--cb-text-primary)] antialiased transition-colors duration-300">
        <GlobalProvider>
          <CBThemeProvider>
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
