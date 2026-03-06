'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, Shield, TrendingDown, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/lib/constants'

type DemoColumn = {
  id: 'amazon' | 'flipkart' | 'cj'
  label: string
  price: string
  badge: string
  goId: string
  highlight: boolean
}

const DEMO_COLUMNS: readonly DemoColumn[] = [
  {
    id: 'amazon',
    label: 'Amazon',
    price: '₹32,999',
    badge: 'Free Delivery',
    goId: 'amazon-demo1',
    highlight: false,
  },
  {
    id: 'flipkart',
    label: 'Flipkart',
    price: '₹31,499',
    badge: '10% Bank Off',
    goId: 'flipkart-demo1',
    highlight: false,
  },
  {
    id: 'cj',
    label: 'CJ Global',
    price: '₹29,999',
    badge: 'Best Price',
    goId: 'cj-demo1',
    highlight: true,
  },
]

const TYPING_TEXT = '$500 smartphone'

export default function HeroSection() {
  const router = useRouter()
  const [phase, setPhase] = useState<number>(0)
  const [typedText, setTypedText] = useState<string>('')
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const [isRtl, setIsRtl] = useState<boolean>(false)

  const timeoutsRef = useRef<number[]>([])
  const typingIntervalRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutsRef.current = []
    if (typingIntervalRef.current !== null) {
      window.clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
  }, [])

  const startAnimationLoop = useCallback(() => {
    clearTimers()
    setIsLooping(true)
    setPhase(1)
    setTypedText('')

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setPhase(3)
      setTypedText(TYPING_TEXT)
      setIsLooping(false)
      return
    }

    const startTyping = window.setTimeout(() => {
      let currentIndex = 0
      setPhase(2)
      typingIntervalRef.current = window.setInterval(() => {
        currentIndex += 1
        setTypedText(TYPING_TEXT.slice(0, currentIndex))
        if (currentIndex >= TYPING_TEXT.length && typingIntervalRef.current !== null) {
          window.clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
        }
      }, 80)
    }, 800)

    const showResults = window.setTimeout(() => setPhase(3), 2600)
    const highlightBest = window.setTimeout(() => setPhase(4), 3400)
    const showCta = window.setTimeout(() => setPhase(5), 4200)
    const restart = window.setTimeout(() => {
      setPhase(0)
      setTypedText('')
      setIsLooping(false)
      startAnimationLoop()
    }, 7000)

    timeoutsRef.current = [startTyping, showResults, highlightBest, showCta, restart]
  }, [clearTimers])

  useEffect(() => {
    setIsRtl(document.documentElement.dir === 'rtl')
    startAnimationLoop()

    return () => {
      clearTimers()
    }
  }, [clearTimers, startAnimationLoop])

  const handleDealClick = useCallback(
    (goId: string) => {
      router.push(`/go/${goId}`)
    },
    [router],
  )

  return (
    <section className="bg-[var(--cb-surface)] px-6 py-24 dark:bg-[#09090B]">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 inline-flex"
        >
          <span className="cb-badge inline-flex items-center gap-1 border border-skyline-primary/20 bg-[var(--cb-primary-glow)] px-3 py-1 text-skyline-primary">
            <Zap size={12} />
            India&apos;s #1 Sovereign Price Aggregator
          </span>
        </motion.div>

        <div className="space-y-1">
          {['Everything', 'in One', 'Basket.'].map((line, index) => (
            <motion.h1
              key={line}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`font-display text-5xl font-black tracking-tighter sm:text-6xl lg:text-8xl ${
                line === 'Basket.' ? 'text-skyline-primary' : 'text-[var(--cb-text-primary)]'
              }`}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        <div className="mt-6 max-w-xl space-y-1 text-lg text-[var(--cb-text-secondary)]">
          <p>Compare prices across Amazon, Flipkart &amp; 50+ stores.</p>
          <p>Zero checkout. Pure discovery. Maximum savings.</p>
        </div>

        {phase >= 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 space-y-4"
          >
            <div
              className={`glass-panel flex h-12 items-center gap-3 rounded-card px-4 ${
                phase >= 2 ? 'ring-2 ring-skyline-primary' : ''
              } ${phase === 2 ? 'animate-pulse' : ''}`}
            >
              <Search size={18} className="text-[var(--cb-text-muted)]" />
              <span className="font-mono text-sm text-[var(--cb-text-primary)]">{typedText}</span>
            </div>

            <AnimatePresence>
              {phase >= 3 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35 }}
                  className={`grid gap-4 md:grid-cols-3 ${isRtl ? 'flex-row-reverse' : ''}`}
                  data-looping={isLooping}
                >
                  {DEMO_COLUMNS.map((column, index) => {
                    const isHighlighted = column.highlight && phase >= 4
                    return (
                      <motion.div
                        key={column.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`cb-card p-4 ${
                          isHighlighted ? 'border-2 border-[#F97316] shadow-[0_0_24px_rgba(249,115,22,0.2)]' : ''
                        }`}
                      >
                        <p className="font-mono text-[11px] font-black uppercase tracking-[0.08em] text-[var(--cb-text-muted)]">
                          {column.label}
                        </p>
                        <p className="mt-2 truncate text-[13px] font-bold text-[var(--cb-text-primary)]">Galaxy S25 Ultra</p>
                        <p
                          className={`mt-3 font-display text-2xl font-black ${
                            isHighlighted ? 'scale-110 text-[#F97316]' : 'text-[var(--cb-text-primary)]'
                          }`}
                        >
                          {column.price}
                        </p>
                        <span
                          className={`cb-badge mt-2 ${
                            isHighlighted
                              ? 'bg-[#F97316]/10 text-[#F97316]'
                              : 'bg-[var(--cb-primary-glow)] text-skyline-primary'
                          }`}
                        >
                          {column.badge}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDealClick(column.goId)}
                          className={`mt-4 w-full px-3 py-2 text-[11px] ${
                            isHighlighted ? 'cb-btn-primary bg-[#F97316] text-white hover:bg-[#EA580C]' : 'cb-btn-ghost'
                          }`}
                        >
                          View Deal
                        </button>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}

        <AnimatePresence>
          {phase >= 5 ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href={ROUTES.PRODUCTS} className="cb-btn-primary inline-flex items-center gap-2">
                Browse All Deals
                <ArrowRight size={14} />
              </Link>
              <Link href={ROUTES.COMPARE} className="cb-btn-ghost inline-flex items-center gap-2">
                Compare Products
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <Shield size={14} />
            <span>DPDPA 2023 Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <TrendingDown size={14} />
            <span>50+ Stores Compared</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <Zap size={14} />
            <span>Real-time Prices</span>
          </div>
        </div>
      </div>
    </section>
  )
}