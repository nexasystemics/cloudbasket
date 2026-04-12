'use client'

import { PackageSearch } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  onReset: () => void
}

export default function ProductGrid({ products, onReset }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <PackageSearch size={48} className="text-[var(--cb-text-muted)]" />
        <h3 className="font-display text-xl font-black text-[var(--cb-text-primary)]">No products found</h3>
        <p className="text-sm text-[var(--cb-text-muted)]">Try adjusting your filters</p>
        <button type="button" onClick={onReset} className="cb-btn-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
          Reset Filters
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} variant="grid" />
          </div>
        ))}
      </div>
    </div>
  )
}
