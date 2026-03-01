import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { GlobalProvider } from '@/context/GlobalContext'

export const metadata: Metadata = { 
  title: 'CloudBasket - Everything in One Basket', 
  description: 'Compare prices, track deals, discover POD designs and earn affiliate commissions.',
  icons: {
    icon: '/brand/favicon.svg',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning dir="ltr">
      <body className="antialiased bg-white dark:bg-[#1D1D1F] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <GlobalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
