'use client'
import { useEffect, useState } from 'react'

export default function StockIndicator({ productId, platform, defaultInStock = true }: { productId: string; platform: string; defaultInStock?: boolean }) {
  const [inStock, setInStock] = useState(defaultInStock)

  useEffect(() => {
    fetch(`/api/stock/${productId}`).then(r => r.json()).then(d => { if (d.inStock !== undefined) setInStock(d.inStock) }).catch(() => { /* no-op */ })
  }, [productId])

  if (inStock) return <span className="cb-badge cb-badge-green text-[10px]">✓ In Stock</span>
  return <span className="cb-badge bg-red-500/10 text-red-500 text-[10px]">Out of Stock</span>
}