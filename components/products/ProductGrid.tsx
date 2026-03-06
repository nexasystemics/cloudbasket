'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  onReset: () => void
}

const CARD_TRANSITION = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
} as const

export default function ProductGrid({ products, onReset }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <PackageSearch size={48} className="text-[var(--cb-text-muted)]" />
        <h3 className="font-display text-xl font-black text-[var(--cb-text-primary)]">No products found</h3>
        <p className="text-sm text-[var(--cb-text-muted)]">Try adjusting your filters</p>
        <button type="button" onClick={onReset} className="cb-btn-primary">
          Reset Filters
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={CARD_TRANSITION}
            >
              <ProductCard product={product} variant="grid" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
