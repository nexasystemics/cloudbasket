'use client'

import { useEffect } from 'react'

interface TrackBehaviorProps {
  category?: string
  productId?: string
  searchTerm?: string
  priceRange?: string
}

export default function TrackBehavior({ category, productId, searchTerm, priceRange }: TrackBehaviorProps) {
  useEffect(() => {
    if (category) {
      const cats = parseArray('cb_cats')
      if (!cats.includes(category)) {
        cats.unshift(category)
        writeArray('cb_cats', cats.slice(0, 10))
      }
    }

    if (productId) {
      const clicks = parseArray('cb_clicks')
      clicks.unshift(productId)
      writeArray('cb_clicks', clicks.slice(0, 20))
    }

    if (searchTerm) {
      const searches = parseArray('cb_search')
      if (!searches.includes(searchTerm)) {
        searches.unshift(searchTerm)
        writeArray('cb_search', searches.slice(0, 10))
      }
    }

    if (priceRange) {
      document.cookie = `cb_price=${priceRange}; max-age=31536000; path=/`
    }
  }, [category, productId, searchTerm, priceRange])

  return null
}

function parseArray(key: string): string[] {
  try {
    const match = document.cookie.match(new RegExp(`${key}=([^;]+)`))
    return match ? (JSON.parse(decodeURIComponent(match[1])) as string[]) : []
  } catch {
    return []
  }
}

function writeArray(key: string, arr: string[]) {
  document.cookie = `${key}=${encodeURIComponent(JSON.stringify(arr))}; max-age=31536000; path=/`
}
