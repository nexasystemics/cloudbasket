import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductsPageClient from './products-page-client'

export const metadata: Metadata = {
  title: "All Products — 2,000+ Deals Tracked",
  description:
    'Browse CloudBasket products across major categories, compare prices from trusted stores, and discover verified deals matched to your budget and needs.',
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--cb-bg)]" />}>
      <ProductsPageClient />
    </Suspense>
  )
}
