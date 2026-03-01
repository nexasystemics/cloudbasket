import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { ThemeProvider } from '@/components/ThemeProvider'
import CartSuccessVideo from '@/components/CartSuccessVideo'

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Header />
            <CartDrawer />
            <CartSuccessVideo />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
