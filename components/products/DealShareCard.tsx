'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

interface DealShareCardProps {
  productName: string
  price: number
  originalPrice: number
  productId: string
  badge?: string
}

export function DealShareCard({ productName, price, originalPrice, productId, badge }: DealShareCardProps) {
  const [copied, setCopied] = useState(false)
  const discount = Math.round((1 - price / originalPrice) * 100)
  const dealUrl = `https://cloudbasket.co/product/${productId}`

  const whatsappText = encodeURIComponent(
    `🔥 *${discount}% OFF — DEAL ALERT!*\n\n${productName}\n\nNow: ₹${price.toLocaleString('en-IN')}\n~~₹${originalPrice.toLocaleString('en-IN')}~~\n\n${badge ? `${badge}\n\n` : ''}Buy here: ${dealUrl}\n\n_via CloudBasket — India's Deal Engine_`,
  )

  const twitterText = encodeURIComponent(
    `🔥 ${discount}% OFF on ${productName}! Now ₹${price.toLocaleString('en-IN')} (was ₹${originalPrice.toLocaleString('en-IN')}) ${dealUrl} #deals #india #cloudbasket`,
  )

  const copyLink = async () => {
    await navigator.clipboard.writeText(dealUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        <Share2 size={14} className="text-[#039BE5]" />
        Share This Deal
      </p>

      <div className="cb-card p-4 border-[#F5C842]/30 bg-gradient-to-br from-[#F5C842]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">CloudBasket Deal Alert 🔥</p>
            <p className="font-bold text-sm mt-1 line-clamp-2">{productName}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-black text-xl text-[#039BE5]">₹{price.toLocaleString('en-IN')}</span>
              <span className="text-xs line-through text-muted">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="cb-badge bg-[#EF4444] text-white text-xs">{discount}% OFF</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#F5C842]/30">{discount}%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Link
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition"
        >
          <span>📱</span> WhatsApp
        </Link>
        <Link
          href={`https://twitter.com/intent/tweet?text=${twitterText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] text-sm font-semibold hover:bg-[#1DA1F2]/20 transition"
        >
          <span>🐦</span> Twitter
        </Link>
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[#10B981]" /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  )
}
