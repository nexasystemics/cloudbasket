import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import CategoriesHubClient from '@/components/CategoriesHubClient'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    absolute: 'All Categories | CloudBasket',
  },
  description:
    'Browse 20 categories — Electronics, Fashion, Finance, Travel and more. Best deals across every category.',
}

export default function CategoriesPage() {
  return (
    <div className={syne.className}>
      <CategoriesHubClient />
    </div>
  )
}
