'use client'
// components/ads/AdUnit.tsx
// Google AdSense ad unit with lazy loading, viewability tracking and consent check.

import { useEffect, useRef, useState } from 'react'
import { isAdSenseConfigured } from '@/lib/adsense/placement-engine'
import { env } from '@/lib/env'

interface AdUnitProps {
  slotId: string
  format?: string
  className?: string
}

function hasAdConsent(): boolean {
  try {
    const stored = localStorage.getItem('cb_cookie_consent')
    if (!stored) return false
    const prefs = JSON.parse(stored)
    return prefs.advertising === true
  } catch { return false }
}

function trackImpression(slotId: string): void {
  try {
    const key = 'cb_ad_impressions'
    const stored = localStorage.getItem(key)
    const impressions = stored ? JSON.parse(stored) : {}
    impressions[slotId] = (impressions[slotId] || 0) + 1
    localStorage.setItem(key, JSON.stringify(impressions))
  } catch { /* no-op */ }
}

export default function AdUnit({ slotId, format = 'auto', className = '' }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    setConsent(hasAdConsent())
  }, [])

  useEffect(() => {
    if (!consent || !isAdSenseConfigured()) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          trackImpression(slotId)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [consent, slotId])

  useEffect(() => {
    if (!visible || !consent || !isAdSenseConfigured()) return
    try {
      const w = window as any
      if (w.adsbygoogle) (w.adsbygoogle = w.adsbygoogle || []).push({})
    } catch { /* no-op */ }
  }, [visible, consent])

  if (!isAdSenseConfigured() || !consent) return null

  return (
    <div ref={containerRef} className={`adsense-container ${className}`}>
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  )
}