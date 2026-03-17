'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function CookieConsent() {
  const [mounted, setMounted] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') {
      return
    }

    try {
      const consent = window.localStorage.getItem('cb-cookie-consent')
      if (consent === null) {
        setVisible(true)
      }
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('cb-cookie-consent', 'accepted')
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    }
    setVisible(false)
  }

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('cb-cookie-consent', 'declined')
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    }
    setVisible(false)
  }

  if (!mounted || !visible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] px-4">
      <div className="glass-panel mx-auto mb-4 flex max-w-4xl flex-col items-start gap-4 rounded-card border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] text-[var(--cb-text-secondary)]">
            We use cookies to enhance your experience and comply with{' '}
            <Link href={ROUTES.PRIVACY} className="font-semibold text-skyline-primary">
              DPDPA 2023 &amp; GDPR
            </Link>{' '}
            privacy regulations.
          </p>
          <span className="cb-badge bg-[var(--cb-primary-glow)] text-skyline-primary">DPDPA 2023 Compliant</span>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={handleDecline} className="cb-btn-ghost px-3 py-2 text-[11px]">
            Decline
          </button>
          <button type="button" onClick={handleAccept} className="cb-btn-primary px-3 py-2 text-[11px]">
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
