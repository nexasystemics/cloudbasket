'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Bell, ExternalLink } from 'lucide-react'

interface ProductDetailActionsProps {
  productId: string
  productName: string
  currentPrice: number
  dealPath: string
}

interface PriceAlertTriggerButtonProps {
  currentPrice: number
  productName: string
  className?: string
  children?: ReactNode
}

const SocialProofWidget = dynamic(() => import('@/components/SocialProof'), {
  ssr: false,
  loading: () => <div className="mt-4 min-h-20 rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

const PriceAlertModal = dynamic(() => import('@/components/PriceAlertModal'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" aria-hidden="true">
      <div className="cb-card min-h-[320px] w-full max-w-md bg-[var(--cb-surface)]" />
    </div>
  ),
})

export function PriceAlertTriggerButton({
  currentPrice,
  productName,
  className,
  children,
}: PriceAlertTriggerButtonProps) {
  const [showAlert, setShowAlert] = useState(false)

  return (
    <>
      <button type="button" className={className} onClick={() => setShowAlert(true)}>
        {children ?? 'Set Price Alert'}
      </button>
      {showAlert ? (
        <PriceAlertModal
          productName={productName}
          currentPrice={currentPrice}
          onClose={() => setShowAlert(false)}
        />
      ) : null}
    </>
  )
}

export default function ProductDetailActions({
  productId,
  productName,
  currentPrice,
  dealPath,
}: ProductDetailActionsProps) {
  const mainCtaRef = useRef<HTMLAnchorElement | null>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    if (mediaQuery.matches) {
      setShowStickyBar(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setShowStickyBar(!entry.isIntersecting)
    })

    if (mainCtaRef.current) {
      observer.observe(mainCtaRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="min-h-20">
        <SocialProofWidget productId={productId} className="mt-4" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          ref={mainCtaRef}
          href={dealPath}
          target="_blank"
          rel="noopener noreferrer"
          className="cb-btn-primary flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
        >
          View Deal
          <ExternalLink size={14} />
        </a>
        <PriceAlertTriggerButton
          productName={productName}
          currentPrice={currentPrice}
          className="cb-btn-ghost flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
        >
          <Bell size={14} />
          Set Price Alert
        </PriceAlertTriggerButton>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-100 bg-white/95 p-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 md:hidden ${
          prefersReducedMotion
            ? showStickyBar
              ? 'block'
              : 'hidden'
            : `transition-all duration-200 ${showStickyBar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current price</p>
            <p className="text-xl font-black text-zinc-900 dark:text-white">₹{currentPrice.toLocaleString('en-IN')}</p>
          </div>
          <a
            href={dealPath}
            target="_blank"
            rel="noopener noreferrer"
            className="cb-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >
            View Deal
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </>
  )
}
