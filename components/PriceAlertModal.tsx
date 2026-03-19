'use client'

import { useState } from 'react'
import { Bell, X, CheckCircle, TrendingDown } from 'lucide-react'
import { trackPriceAlertSet } from '@/lib/analytics'

interface PriceAlertModalProps {
  productName: string
  currentPrice: number
  onClose: () => void
}

export default function PriceAlertModal({ productName, currentPrice, onClose }: PriceAlertModalProps) {
  const [email, setEmail] = useState<string>('')
  const [targetPrice, setTargetPrice] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = () => {
    if (!email || !targetPrice) {
      return
    }
    try {
      trackPriceAlertSet(productName, Number(targetPrice))
    } catch {
      // ignore tracking errors
    }
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="cb-card relative w-full max-w-md p-8" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="cb-btn cb-btn-ghost absolute right-4 top-4 p-2" onClick={onClose}>
          <X size={16} />
        </button>

        {!submitted ? (
          <>
            <Bell size={32} className="mb-4 text-[#039BE5]" />
            <h2 className="text-xl font-black">Set Price Alert</h2>
            <p className="text-muted mt-1 text-sm">
              Get notified when {productName} drops to your target price
            </p>

            <div className="cb-card mb-6 mt-6 flex items-center justify-between border-[#039BE5]/20 bg-[#039BE5]/5 p-4">
              <p className="text-muted text-sm">Current Price</p>
              <p className="price-current">Rs{currentPrice.toLocaleString('en-IN')}</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest">Your Email</label>
              <input
                type="email"
                className="cb-input w-full"
                placeholder="you@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <div className="mt-4">
                <label className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                  <TrendingDown size={12} />
                  Alert me when price drops to
                </label>
                <div className="relative">
                  <span className="text-muted absolute left-3 top-1/2 -translate-y-1/2 text-sm">Rs</span>
                  <input
                    type="number"
                    className="cb-input w-full pl-8"
                    placeholder={String(Math.floor(currentPrice * 0.85))}
                    value={targetPrice}
                    onChange={(event) => setTargetPrice(event.target.value)}
                  />
                </div>
              </div>

              <button type="button" className="cb-btn cb-btn-primary mt-6 w-full gap-2" onClick={handleSubmit}>
                <Bell size={16} />
                Set Alert
              </button>
            </div>

            <p className="text-muted mt-4 text-center text-xs">We&apos;ll email you once. No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <div className="py-4 text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-[#10B981]" />
            <h2 className="text-xl font-black">Alert Set!</h2>
            <p className="text-muted mt-2">
              We&apos;ll notify {email} when {productName} drops below Rs{targetPrice}
            </p>
            <button type="button" className="cb-btn cb-btn-primary mt-6 w-full" onClick={onClose}>
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
