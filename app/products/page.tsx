import type { Metadata } from 'next'
import ProductsPageClient from './products-page-client'

export const metadata: Metadata = {
  title: "All Products — 2,000+ Deals Tracked",
  description: "Browse 2,000+ products tracked across Amazon, Flipkart and CJ Global.",
}
export default function ProductsPage() {
  return <ProductsPageClient />
}

