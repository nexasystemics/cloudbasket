// Estimated: ~15 lines
// Purpose: Search results page entry with canonical metadata.

import type { Metadata } from 'next'
import SearchPageClient from './SearchPageClient'

export const metadata: Metadata = {
  title: 'Search Products and Deals | CloudBasket',
  description: 'Search CloudBasket products, brands, and categories to compare prices across verified affiliate storefronts.',
  alternates: {
    canonical: 'https://cloudbasket.in/search',
  },
}

export default function SearchPage() {
  return <SearchPageClient />
}
