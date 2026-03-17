'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'cb_disclosure_dismissed'

export default function AffiliateDisclosureBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY)
      if (dismissed !== 'true') {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // sessionStorage unavailable — silently continue
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-4">
      <p className="text-xs font-medium text-amber-900 flex-1 text-center">
        This platform earns a small commission when you click and buy through our links — at no extra cost to you.{' '}
        <Link
          href="/affiliate-disclosure"
          className="underline underline-offset-2 font-bold hover:text-amber-700 transition-colors"
        >
          Read our disclosure.
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss disclosure banner"
        className="shrink-0 p-1 rounded-full text-amber-700 hover:bg-amber-100 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
