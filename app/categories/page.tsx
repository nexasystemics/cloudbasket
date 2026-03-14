import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import CategoriesHubClient from '@/components/CategoriesHubClient'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'All Categories | CloudBasket',
  description:
    'Browse CloudBasket categories to compare prices across electronics, fashion, home, beauty, and more with faster access to the latest verified deals online.',
}

export default function CategoriesPage() {
  return (
    <div className={syne.className}>
      <CategoriesHubClient />
    </div>
  )
}



