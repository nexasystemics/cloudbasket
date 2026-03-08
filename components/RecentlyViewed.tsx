'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ExternalLink } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export function trackProductView(id: string): void {
  try {
    const existing = JSON.parse(localStorage.getItem('cb-recently-viewed') ?? '[]') as string[]
    const updated = [id, ...existing.filter((item: string) => item !== id)].slice(0, 10)
    localStorage.setItem('cb-recently-viewed', JSON.stringify(updated))
  } catch {
    localStorage.setItem('cb-recently-viewed', JSON.stringify([id]))
  }
}

export function ProductViewTracker({ id }: { id: string }) {
  useEffect(() => {
    trackProductView(id)
  }, [id])

  return null
}

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<typeof MOCK_PRODUCTS>([])

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem('cb-recently-viewed') ?? '[]') as string[]
      const products = ids
        .map((id) => MOCK_PRODUCTS.find((product) => String(product.id) === id))
        .filter(Boolean)

      setRecentProducts(products.slice(0, 6) as typeof MOCK_PRODUCTS)
    } catch {
      setRecentProducts([])
    }
  }, [])

  if (recentProducts.length === 0) {
    return null
  }

  return (
    <section className="my-8">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-black tracking-tighter">
        <Clock size={18} className="text-[#039BE5]" />
        Recently Viewed
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {recentProducts.map((product) => (
          <article key={product.id} className="cb-card group w-40 flex-shrink-0 overflow-hidden">
            <div className="relative h-32">
              <Link href={`/product/${product.id}`}>
                <Image
                  fill
                  className="object-cover"
                  src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
                  alt={product.name}
                />
              </Link>
            </div>
            <div className="p-3">
              <Link href={`/product/${product.id}`} className="line-clamp-2 block text-xs font-bold">
                {product.name}
              </Link>
              <p className="price-current mt-1 text-xs">Rs{product.price.toLocaleString('en-IN')}</p>
              <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-primary mt-2 w-full py-1.5 text-xs">
                <ExternalLink size={10} />
                Deal
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
