'use client'

import { useEffect, useMemo, useState } from 'react'

type TrustStat = {
  value: number
  label: string
  suffix: string
  icon: string
}

const STATS: TrustStat[] = [
  { value: 48293, label: 'Deals Tracked Today', suffix: '+', icon: '📊' },
  { value: 2000, label: 'Products Compared', suffix: '+', icon: '🛍️' },
  { value: 1247, label: 'Happy Users', suffix: '+', icon: '😊' },
  { value: 50, label: 'Stores Monitored', suffix: '+', icon: '🏬' },
]

export default function TrustScoreWidget() {
  const [counts, setCounts] = useState<number[]>(() => STATS.map(() => 0))

  useEffect(() => {
    const duration = 2000
    const tick = 40
    const steps = Math.floor(duration / tick)
    let currentStep = 0

    const interval = window.setInterval(() => {
      currentStep += 1
      setCounts(
        STATS.map((stat) => {
          const next = Math.round((stat.value * currentStep) / steps)
          return Math.min(next, stat.value)
        }),
      )

      if (currentStep >= steps) {
        window.clearInterval(interval)
      }
    }, tick)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  const formatted = useMemo(() => {
    return counts.map((count) => count.toLocaleString('en-IN'))
  }, [counts])

  return (
    <section className="bg-[var(--cb-surface-2)] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tighter">Trusted by Smart Indian Shoppers</h2>
          <p className="text-muted mt-2 text-sm">Real-time stats updated every hour</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="cb-card p-6 text-center">
              <p className="mb-1 text-3xl">{stat.icon}</p>
              <p className="text-3xl font-black text-[#039BE5]">
                {formatted[index]}
                {stat.suffix}
              </p>
              <p className="text-muted mt-1 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <p className="text-muted flex items-center gap-2 text-xs">✓ DPDPA 2023 Compliant</p>
          <p className="text-muted flex items-center gap-2 text-xs">✓ FTC Affiliate Disclosure</p>
          <p className="text-muted flex items-center gap-2 text-xs">✓ Zero Checkout Risk</p>
          <p className="text-muted flex items-center gap-2 text-xs">✓ Powered by NEXQON</p>
        </div>
      </div>
    </section>
  )
}
