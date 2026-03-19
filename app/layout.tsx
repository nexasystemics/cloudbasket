import BackToTop from '@/components/BackToTop'
import Analytics from '@/components/Analytics'
import type { Metadata, Viewport } from 'next'
import { ReactNode, Suspense } from 'react'
import Script from 'next/script'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LayoutBottomEnhancements from '@/components/LayoutBottomEnhancements'
import LayoutTopEnhancements from '@/components/LayoutTopEnhancements'
import FeedbackWidget from '@/components/FeedbackWidget'
import ErrorBoundary from '@/components/ErrorBoundary'
import SchemaMarkup from '@/components/SchemaMarkup'
import '@/lib/env'
import CBThemeProvider from '@/components/ThemeProvider'
import { GlobalProvider } from '@/context/GlobalContext'
import './globals.css'

function getSupabaseOrigin(): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null
  try {
    return new URL(supabaseUrl).origin
  } catch {
    return null
  }
}

export const viewport: Viewport = {
  themeColor: '#039BE5',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://cloudbasket.in'),
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
  authors: [{ name: 'NEXQON HOLDINGS', url: 'https://nexqon.com' }],
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
    url: 'https://cloudbasket.in',
    siteName: 'CloudBasket',
    title: "CloudBasket — India's Best Price Comparison",
    description: 'Compare prices across 50+ stores. Zero checkout.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'CloudBasket — Price Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "CloudBasket — India's Best Price Comparison",
    description: 'Compare prices across 50+ stores. Zero checkout.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: ['/brand/favicon.svg'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CloudBasket',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const supabaseOrigin = getSupabaseOrigin()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//www.amazon.in" />
        <link rel="dns-prefetch" href="//www.flipkart.com" />
        <link rel="dns-prefetch" href="//m.media-amazon.com" />
        <link rel="dns-prefetch" href="//rukminim2.flixcart.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        {supabaseOrigin ? <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" /> : null}
      </head>
      <body className="bg-[var(--cb-bg)] text-[var(--cb-text-primary)] font-sans antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-white">        <a
        
            href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-blue-900 focus:px-4 focus:py-2 focus:rounded focus:shadow-lg">Skip to main content
        </a>
        <GlobalProvider>
          <CBThemeProvider>
            <Analytics />
            <SchemaMarkup type="website" />
            <LayoutTopEnhancements />
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <BackToTop />
            <ErrorBoundary>
              <Suspense>
                <FeedbackWidget />
              </Suspense>
            </ErrorBoundary>
            <LayoutBottomEnhancements />
            <Script id="sw-register" strategy="afterInteractive">
              {`if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
              }`}
            </Script>
          </CBThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}


