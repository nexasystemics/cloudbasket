// Estimated: ~110 lines
// Purpose: Displays a horizontally scrollable shelf of recently viewed products from localStorage.

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CATALOG_PRODUCTS, type CatalogProduct } from '@/lib/cloudbasket-data'

const STORAGE_KEY = 'cb_recently_viewed'
const MAX_RECENT = 10

/**
 * ProductViewTracker is a small client component that tracks the product ID.
 * It is meant to be mounted on the Product detail page.
 */
export function ProductViewTracker({ id }: { id: string }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let ids: string[] = []
      if (stored) {
        ids = JSON.parse(stored)
      }
      
      // Filter out current ID if it exists and push to front
      const updated = [id, ...ids.filter((existingId) => existingId !== id)].slice(0, MAX_RECENT)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to update cb_recently_viewed in localStorage', error)
    }
  }, [id])

  return null
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<CatalogProduct[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const ids: string[] = JSON.parse(stored)
      const foundProducts = ids
        .map((id) => CATALOG_PRODUCTS.find((p) => p.id === id))
        .filter((p): p is CatalogProduct => !!p)

      setProducts(foundProducts)
    } catch (error) {
      console.error('Failed to read cb_recently_viewed from localStorage', error)
      setProducts([])
    }
  }, [])

  if (products.length < 2) {
    return null
  }

  return (
    <div className="py-12 border-t border-zinc-100 dark:border-zinc-800">
      <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic mb-8">
        Recently Viewed
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex-shrink-0 w-48 group"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-shadow group-hover:shadow-lg">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="192px"
              />
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">
                {product.brand}
              </p>
              <h3 className="text-sm font-black text-zinc-900 dark:text-white truncate mt-0.5">
                {product.title}
              </h3>
              <p className="text-lg font-black text-skyline-primary mt-1">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
