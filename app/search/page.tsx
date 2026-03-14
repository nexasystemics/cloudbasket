import type { Metadata } from 'next'
import SearchPageClient from './SearchPageClient'

export const metadata: Metadata = {
  title: 'Search Products and Deals',
  description: 'Search CloudBasket products, brands, and categories to compare prices across verified affiliate storefronts.',
}

export default function SearchPage() {
  return <SearchPageClient />
}
