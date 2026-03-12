import { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductsPageClient from './products-page-client'

export const metadata: Metadata = {
  title: "All Products — 2,000+ Deals Tracked",
  description: "Browse 2,000+ products tracked across Amazon, Flipkart and CJ Global.",
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--cb-bg)]" />}>
      <ProductsPageClient />
    </Suspense>
  )
}
