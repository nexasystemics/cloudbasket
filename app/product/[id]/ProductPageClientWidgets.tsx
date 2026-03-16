'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface ProductPageClientWidgetsProps {
  productId: string
  productName: string
  currentPrice: number
  affiliatePlatform: 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'
}

const SocialProofWidget = dynamic(() => import('@/components/SocialProof'), {
  ssr: false,
  loading: () => <div className="mt-4 min-h-20 rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

const ProductActions = dynamic(() => import('@/components/ProductActions'), {
  ssr: false,
  loading: () => <div className="min-h-10 min-w-32 rounded-full bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

export default function ProductPageClientWidgets({ 
  productId, 
  productName, 
  currentPrice,
  affiliatePlatform 
}: ProductPageClientWidgetsProps) {
  const [showSticky, setShowSticky] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const dealPath = `/go/${affiliatePlatform}-${productId}`

  return (
    <>
      <div className="min-h-20">
        <SocialProofWidget productId={productId} className="mt-4" />
      </div>
      <div ref={targetRef}>
        <ProductActions productName={productName} currentPrice={currentPrice} />
      </div>

      {/* Sticky Bottom Bar (Mobile Only) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 p-4 transition-all duration-500 lg:hidden transform ${
          showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } motion-reduce:transition-none`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate">{productName}</p>
            <p className="text-xl font-black text-zinc-900 dark:text-white">₹{currentPrice.toLocaleString('en-IN')}</p>
          </div>
          <Link 
            href={dealPath}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn-primary h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-skyline-primary/20"
          >
            View Deal <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}

