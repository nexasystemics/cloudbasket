// Estimated: ~25 lines
// Purpose: All products catalog entry with canonical metadata.

import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductsPageClient from './products-page-client'

export const metadata: Metadata = {
  title: "All Products — 2,000+ Deals Tracked | CloudBasket",
  description:
    'Browse CloudBasket products across major categories, compare prices from trusted stores, and discover verified deals matched to your budget and needs.',
  alternates: {
    canonical: 'https://cloudbasket.co/products',
  },
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--cb-bg)]" />}>
      <ProductsPageClient />
    </Suspense>
  )
}
