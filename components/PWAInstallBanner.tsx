'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      try {
        const dismissed = localStorage.getItem('cb_pwa_dismissed')
        if (!dismissed) setShowBanner(true)
      } catch {
        setShowBanner(true)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt.current) return
    await deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    deferredPrompt.current = null
  }

  const handleDismiss = () => {
    setShowBanner(false)
    try { localStorage.setItem('cb_pwa_dismissed', '1') } catch { /* no-op */ }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="cb-card flex items-center gap-4 p-4 shadow-2xl border border-[var(--cb-border)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-skyline-primary/10 flex-shrink-0">
          <Download size={20} className="text-skyline-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black">Install CloudBasket</p>
          <p className="text-xs text-[var(--cb-text-muted)]">Add to home screen for faster access</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleInstall}
            className="cb-btn cb-btn-primary text-xs px-3 py-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="cb-btn cb-btn-ghost p-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}