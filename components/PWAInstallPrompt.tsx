'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault()
      setDeferredPrompt(event)
      try {
        const dismissed = localStorage.getItem('pwa-dismissed')
        if (!dismissed) setShow(true)
      } catch (error) {
        console.error('Failed to read from localStorage:', error)
        setShow(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  const dismiss = () => {
    setShow(false)
    try {
      localStorage.setItem('pwa-dismissed', '1')
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 cb-card border-[#039BE5]/40 bg-[#0F172A] p-4 shadow-2xl sm:left-auto sm:right-4 sm:w-80">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#039BE5] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            C
          </div>
          <div>
            <p className="font-bold text-sm">Install CloudBasket</p>
            <p className="text-xs text-muted mt-0.5">Get deal alerts & faster access</p>
          </div>
        </div>
        <button onClick={dismiss} className="text-muted hover:text-white" aria-label="Dismiss install prompt">
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={install} className="flex-1 cb-btn cb-btn-primary text-sm py-2 flex items-center justify-center gap-2">
          <Download size={14} /> Install App
        </button>
        <button onClick={dismiss} className="flex-1 cb-btn text-sm py-2 text-muted">
          Not now
        </button>
      </div>
    </div>
  )
}
