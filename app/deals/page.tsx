'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, ExternalLink, Tag, TrendingDown, Zap } from 'lucide-react'
import { DEALS, FLASH_DEALS } from '@/lib/deals-data'
import { PRODUCTS } from '@/lib/mock-data'
import { ROUTES } from '@/lib/constants'

type DealTab = 'all' | 'flash' | 'cj'

interface CountdownProps {
  expiresAt: string
}

const formatInr = (value: number): string => `₹${new Intl.NumberFormat('en-IN').format(value)}`

function Countdown({ expiresAt }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00')

  useEffect(() => {
    const calculate = (): string => {
      const now = Date.now()
      const target = new Date(expiresAt).getTime()
      const diff = Math.max(target - now, 0)
      const totalSeconds = Math.floor(diff / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':')
    }

    setTimeLeft(calculate())
    const timer = window.setInterval(() => setTimeLeft(calculate()), 1000)

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

export default function DealsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<DealTab>('all')

  const filteredDeals = useMemo(() => {
    if (activeTab === 'flash') {
      return FLASH_DEALS
    }
    if (activeTab === 'cj') {
      return DEALS.filter((deal) => deal.id.startsWith('cj'))
    }
    return DEALS
  }, [activeTab])

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <section className="bg-gradient-to-br from-[#09090B] to-[#0F172A] py-16 text-center text-white">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight">Today&apos;s Best Deals</h1>
        <p className="mt-2 text-base text-[var(--cb-text-muted)]">
          Verified deals from Amazon, Flipkart & CJ — updated hourly
        </p>
        <div className="mt-4 flex justify-center">
          <span className="cb-badge gap-1 bg-[#F97316]/20 text-[#F97316]">
            <Zap size={11} />
            Flash Sales Active
          </span>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl px-6">
        <div className="flex items-center gap-6 border-b cb-border">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2 text-sm font-bold transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-skyline-primary text-skyline-primary'
                : 'text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]'
            }`}
          >
            All Deals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flash')}
            className={`pb-2 text-sm font-bold transition-colors ${
              activeTab === 'flash'
                ? 'border-b-2 border-skyline-primary text-skyline-primary'
                : 'text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]'
            }`}
          >
            Flash Sales
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cj')}
            className={`pb-2 text-sm font-bold transition-colors ${
              activeTab === 'cj'
                ? 'border-b-2 border-skyline-primary text-skyline-primary'
                : 'text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]'
            }`}
          >
            CJ Exclusives
          </button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.map((deal) => {
          const product = PRODUCTS.find((item) => item.id === deal.productId)
          return (
            <article key={deal.id} className="cb-card cursor-pointer overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                {product ? (
                  <Image src={product.image} alt={deal.title} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-[var(--cb-surface-3)]" />
                )}
                <div className="absolute start-0 top-0 flex flex-col gap-1 p-2">
                  {deal.isFlash && (
                    <span className="cb-badge gap-1 bg-[#F97316] text-white">
                      <Zap size={11} />
                      Flash
                    </span>
                  )}
                  <span className="cb-badge gap-1 bg-status-success/90 text-white">
                    <TrendingDown size={11} />
                    -{deal.discount}%
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="line-clamp-2 text-[13px] font-bold text-[var(--cb-text-primary)]">{deal.title}</h2>
                <div className="mt-2">
                  <Countdown expiresAt={deal.expiresAt} />
                </div>

                {product && (
                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-display text-xl font-black text-[var(--cb-text-primary)]">
                      {formatInr(product.price)}
                    </span>
                    {product.originalPrice !== null && (
                      <span className="text-sm text-[var(--cb-text-muted)] line-through">
                        {formatInr(product.originalPrice)}
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => router.push('/go/amazon-' + String(deal.productId))}
                  className="cb-btn-primary mt-3 w-full justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  Grab This Deal
                </button>

                <div className="mt-2 flex items-center justify-between">
                  <span className="cb-badge gap-1 bg-skyline-glow text-skyline-primary">
                    <Tag size={11} />
                    {deal.badge ?? 'Deal'}
                  </span>
                  <Link href={`${ROUTES.DEALS}/${deal.id}`} className="text-xs text-[var(--cb-text-muted)] hover:text-skyline-primary">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
