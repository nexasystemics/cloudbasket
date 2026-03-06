'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Clock, Zap } from 'lucide-react'
import { FLASH_DEALS } from '@/lib/deals-data'
import { PRODUCTS } from '@/lib/mock-data'

interface CountdownProps {
  expiresAt: string
}

function Countdown({ expiresAt }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00')

  useEffect(() => {
    const update = (): string => {
      const diff = Math.max(new Date(expiresAt).getTime() - Date.now(), 0)
      const seconds = Math.floor(diff / 1000)
      const hh = Math.floor(seconds / 3600)
      const mm = Math.floor((seconds % 3600) / 60)
      const ss = seconds % 60
      return [hh, mm, ss].map((unit) => String(unit).padStart(2, '0')).join(':')
    }

    setTimeLeft(update())
    const timer = window.setInterval(() => setTimeLeft(update()), 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [expiresAt])

  return (
    <span className="flex items-center gap-1 font-mono text-xs text-status-warning">
      <Clock size={12} />
      {timeLeft}
    </span>
  )
}

export default function FlashPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <header className="border-b border-[#F97316]/20 bg-[#F97316]/5 py-12 text-center">
        <Zap size={32} className="mx-auto text-[#F97316]" />
        <h1 className="mt-3 font-display text-3xl font-black text-[var(--cb-text-primary)]">Flash Sales</h1>
        <p className="mt-1 text-sm text-[var(--cb-text-muted)]">Limited time. Maximum savings. All verified.</p>
        <div className="mt-3">
          <span className="cb-badge bg-[#F97316]/20 text-[#F97316]">{FLASH_DEALS.length} active deals</span>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {FLASH_DEALS.map((deal) => {
          const product = PRODUCTS.find((item) => item.id === deal.productId)
          return (
            <article
              key={deal.id}
              className="cb-card cursor-pointer border-[#F97316]/30 p-4 transition-colors hover:border-[#F97316]"
            >
              <div className="relative h-40 overflow-hidden rounded-card">
                {product ? (
                  <Image src={product.image} alt={deal.title} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-[var(--cb-surface-3)]" />
                )}
              </div>
              <h2 className="mt-3 line-clamp-2 text-[13px] font-bold text-[var(--cb-text-primary)]">{deal.title}</h2>
              <div className="mt-2 flex items-center justify-between">
                <span className="cb-badge bg-status-success/10 text-status-success">-{deal.discount}%</span>
                <Countdown expiresAt={deal.expiresAt} />
              </div>
              <button
                type="button"
                onClick={() => router.push('/go/amazon-' + String(deal.productId))}
                className="cb-btn-primary mt-3 w-full justify-center"
              >
                Grab Deal
              </button>
            </article>
          )
        })}
      </section>
    </div>
  )
}
