'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Copy, Eye, EyeOff, Shield } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { AFFILIATE_TAGS, ROUTES } from '@/lib/constants'

const AFFILIATE_KEYS_DISPLAY = [
  { platform: 'Amazon PA-API', key: 'AMZN-****-****-2026', status: 'Active', tag: AFFILIATE_TAGS.AMAZON },
  { platform: 'Flipkart', key: 'FK-****-****-2026', status: 'Active', tag: AFFILIATE_TAGS.FLIPKART },
  { platform: 'CJ Affiliate', key: 'CJ-****-****-2026', status: 'Active', tag: AFFILIATE_TAGS.CJ },
] as const

export default function AffiliateKeysPage() {
  const { user } = useGlobal()
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  const toggleVisibility = useCallback((platform: string): void => {
    setShowKey((current) => ({ ...current, [platform]: !current[platform] }))
  }, [])

  const copyTag = useCallback(async (value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
  }, [])

  if (!user || user.role !== 'Admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
        <Shield size={48} className="text-status-error" />
        <h1 className="mt-3 font-display text-2xl font-black text-[var(--cb-text-primary)]">Admin Access Required</h1>
        <Link href={ROUTES.LOGIN} className="cb-btn-primary mt-4">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="flex items-center gap-2 font-display text-2xl font-black text-[var(--cb-text-primary)]">
          <Shield size={26} className="text-skyline-primary" />
          Affiliate Vault
        </h1>

        <div className="mt-4 rounded-card border border-status-warning/30 bg-status-warning/10 p-3 text-sm text-status-warning">
          Keys are stored in .env.local only. Never commit to source control.
        </div>

        <section className="mt-8 space-y-4">
          {AFFILIATE_KEYS_DISPLAY.map((item) => {
            const isVisible = showKey[item.platform] === true
            return (
              <article key={item.platform} className="cb-card p-5">
                <h2 className="font-bold text-[var(--cb-text-primary)]">{item.platform}</h2>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-sm text-[var(--cb-text-muted)]">{isVisible ? item.key : '****-****-****-****'}</span>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item.platform)}
                    className="cb-btn-ghost py-1 text-xs"
                    aria-label={isVisible ? 'Hide key' : 'Show key'}
                  >
                    {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="cb-badge bg-skyline-glow text-skyline-primary">{item.tag}</span>
                  <div className="flex items-center gap-2">
                    <span className="cb-badge bg-status-success/10 text-status-success">{item.status}</span>
                    <button
                      type="button"
                      onClick={() => {
                        void copyTag(item.tag)
                      }}
                      className="cb-btn-ghost py-1 text-xs"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}
