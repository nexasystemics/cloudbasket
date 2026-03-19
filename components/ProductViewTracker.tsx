'use client'

import { useEffect } from 'react'
import { trackProductView } from '@/lib/analytics'

interface ProductViewTrackerProps {
  productId: string
  category: string
  price: number
}

export default function ProductViewTracker({ productId, category, price }: ProductViewTrackerProps) {
  useEffect(() => {
    if (!productId) return

    trackProductView(productId, category, price)
  }, [productId, category, price])

  return null
}
