'use client'

import React, { useState, useEffect } from 'react'
import { Shield, X, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cb-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cb-cookie-consent', 'accepted')
    setIsVisible(false)
    // Placeholder for Supabase logging
    console.log('[CONSENT] Logged to node')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-skyline-primary/10 rounded-2xl flex items-center justify-center text-skyline-primary">
            <Shield size={24} />
          </div>
          <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black tracking-tighter uppercase italic">Privacy Sync</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            We use essential identifiers to optimize the Global Scaling Engine and localized price rendering. 
            By continuing, you agree to our <Link href="/legal/privacy" className="text-skyline-primary hover:underline">Privacy Protocol</Link>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-skyline-primary dark:hover:bg-skyline-primary dark:hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={14} /> Accept Compliance
          </button>
          <Link 
            href="/legal/terms"
            className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors"
          >
            Review Terms
          </Link>
        </div>
      </div>
    </div>
  )
}
