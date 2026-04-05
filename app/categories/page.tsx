import type { Metadata } from 'next'
import CategoriesHubClient from '@/components/CategoriesHubClient'

export const metadata: Metadata = {
  title: 'All Categories | CloudBasket',
  description:
    'Browse CloudBasket categories to compare prices across electronics, fashion, home, beauty, and more with faster access to the latest verified deals online.',
}

export default function CategoriesPage() {
  return (
    <div className="font-sans">
      <CategoriesHubClient />
    </div>
  )
}



