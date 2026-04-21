'use client'
// components/ads/CJPixel.tsx
// CJ commission tracking pixel — renders 1x1 transparent img on conversion pages.

import { useEffect } from 'react'
import { env } from '@/lib/env'

interface CJPixelProps {
  orderId: string
  amount: number
  advertiserId: string
  currency?: string
}

export default function CJPixel({ orderId, amount, advertiserId, currency = 'INR' }: CJPixelProps) {
  useEffect(() => {
    if (!env.CJ_WEBSITE_ID || !advertiserId) return
    try {
      const img = document.createElement('img')
      img.src = `https://www.emjcd.com/tags/c?containerTagId=${env.CJ_WEBSITE_ID}&CID=${advertiserId}&OID=${orderId}&CURRENCY=${currency}&AMOUNT=${amount}&TYPE=471800`
      img.width = 1
      img.height = 1
      img.alt = ''
      img.style.position = 'absolute'
      img.style.visibility = 'hidden'
      document.body.appendChild(img)
      return () => { try { document.body.removeChild(img) } catch { /* no-op */ } }
    } catch { /* no-op */ }
  }, [orderId, amount, advertiserId, currency])

  return null
}
