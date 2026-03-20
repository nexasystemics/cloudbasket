'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
  const [errorId] = useState(() => Math.random().toString(16).substring(2, 8).toUpperCase())

  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-zinc-50 dark:bg-zinc-950 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center py-20">
          {/* SVG Illustration */}
          <div className="mx-auto mb-8 w-32 h-32">
            <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="50" width="88" height="64" rx="8" fill="#1F4E79" opacity="0.15" />
              <rect x="28" y="58" width="72" height="48" rx="6" fill="#1F4E79" opacity="0.2" />
              <path d="M48 50 Q64 30 80 50" stroke="#1F4E79" strokeWidth="4" fill="none" strokeLinecap="round" />
              <circle cx="64" cy="80" r="12" fill="#F59E0B" />
              <path d="M64 72 L64 82" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="64" cy="87" r="1.5" fill="white" />
              <path d="M45 38 L52 45 M83 38 L76 45" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-black tracking-tighter mb-3">Something went wrong on our end.</h1>
          <p className="text-[var(--cb-text-muted)] mb-6">We're working to fix it. Try refreshing the page or come back later.</p>

          <div className="cb-card p-4 mb-8 text-left">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)] mb-1">Error ID</p>
            <p className="font-mono font-black text-skyline-primary">{errorId}</p>
            <p className="text-xs text-[var(--cb-text-muted)] mt-1">Mention this if contacting support at support@cloudbasket.in</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="cb-btn cb-btn-primary gap-2">
              <RefreshCw size={16} /> Refresh Page
            </button>
            <Link href="/" className="cb-btn cb-btn-ghost gap-2">
              <Home size={16} /> Go to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}