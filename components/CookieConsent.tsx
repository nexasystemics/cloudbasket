// © 2026 NEXQON HOLDINGS — CloudBasket CookieConsent.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Cookie, Shield, BarChart2, Megaphone } from 'lucide-react'

type ConsentPrefs = {
  essential: true
  analytics: boolean
  advertising: boolean
  timestamp: string
}

// ── Google Consent Mode v2 ────────────────────────────────────────────────────
declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

function pushConsentMode(analytics: boolean, advertising: boolean) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(['consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage:        advertising ? 'granted' : 'denied',
  }])
}

function pushConsentDefault() {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  // Block non-essential cookies by default before consent
  window.dataLayer.push(['consent', 'default', {
    analytics_storage: 'denied',
    ad_storage:        'denied',
    wait_for_update:   500,
  }])
}

// ── Persistence helpers ───────────────────────────────────────────────────────
function getStoredConsent(): ConsentPrefs | null {
  try {
    const raw = localStorage.getItem('cb_cookie_consent')
    return raw ? (JSON.parse(raw) as ConsentPrefs) : null
  } catch { return null }
}

function saveConsent(prefs: ConsentPrefs) {
  try { localStorage.setItem('cb_cookie_consent', JSON.stringify(prefs)) } catch { /* no-op */ }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CookieConsent() {
  const [show,      setShow]      = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analytics,   setAnalytics]   = useState(false)
  const [advertising, setAdvertising] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      // No consent on record — block non-essential cookies immediately
      pushConsentDefault()
      setShow(true)
    } else {
      // Restore Google Consent Mode to match stored prefs
      pushConsentMode(stored.analytics, stored.advertising)
    }

    // Allow footer "Cookie Settings" link to re-open this banner
    const handler = () => { setShow(true) }
    document.addEventListener('cb:open-cookie-settings', handler)
    return () => document.removeEventListener('cb:open-cookie-settings', handler)
  }, [])

  const acceptAll = () => {
    const prefs: ConsentPrefs = { essential: true, analytics: true, advertising: true, timestamp: new Date().toISOString() }
    saveConsent(prefs)
    pushConsentMode(true, true)
    setShow(false)
    setShowModal(false)
  }

  const rejectAll = () => {
    const prefs: ConsentPrefs = { essential: true, analytics: false, advertising: false, timestamp: new Date().toISOString() }
    saveConsent(prefs)
    pushConsentMode(false, false)
    setShow(false)
    setShowModal(false)
  }

  const savePreferences = () => {
    const prefs: ConsentPrefs = { essential: true, analytics, advertising, timestamp: new Date().toISOString() }
    saveConsent(prefs)
    pushConsentMode(analytics, advertising)
    setShow(false)
    setShowModal(false)
  }

  if (!show) return null

  return (
    <>
      {/* ── Banner ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--cb-border)] bg-white dark:bg-zinc-900 p-4 shadow-2xl md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-2xl md:border"
      >
        <div className="flex items-start gap-3">
          <Cookie size={20} className="mt-0.5 flex-shrink-0 text-skyline-primary" />
          <div className="flex-1">
            <p className="text-sm font-black">We use cookies</p>
            <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
              We use cookies to improve your experience, serve relevant ads, and analyse traffic.
              Essential cookies are always active.{' '}
              <Link href="/legal/cookies" className="text-skyline-primary underline">
                Learn more
              </Link>
            </p>
            <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
              Under India&apos;s <strong>DPDP Act 2023</strong>, you have the right to manage,
              withdraw, or modify your consent at any time.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={acceptAll}             className="cb-btn cb-btn-primary  text-xs px-4 py-2">Accept All</button>
              <button type="button" onClick={rejectAll}             className="cb-btn cb-btn-ghost    text-xs px-4 py-2">Reject All</button>
              <button type="button" onClick={() => setShowModal(true)} className="cb-btn cb-btn-ghost text-xs px-4 py-2">Manage Preferences</button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShow(false)}
            aria-label="Dismiss cookie banner"
            className="flex-shrink-0 text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Preferences Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black">Cookie Preferences</h2>
              <button type="button" onClick={() => setShowModal(false)} aria-label="Close preferences" className="text-[var(--cb-text-muted)]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Essential — always on */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-[var(--cb-surface-2)] p-4">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="mt-0.5 text-skyline-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-black">Essential <span className="ml-2 text-xs text-[var(--cb-text-muted)] font-normal">Always active</span></p>
                    <p className="mt-1 text-xs text-[var(--cb-text-muted)]">Required for the website to function. Cannot be disabled.</p>
                  </div>
                </div>
                <div className="h-5 w-9 rounded-full bg-skyline-primary flex-shrink-0 mt-0.5 opacity-60 cursor-not-allowed" aria-hidden="true" />
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--cb-border)] p-4">
                <div className="flex items-start gap-3">
                  <BarChart2 size={18} className="mt-0.5 text-[var(--cb-text-muted)] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-black">Analytics</p>
                    <p className="mt-1 text-xs text-[var(--cb-text-muted)]">Help us understand how you use the site. Google Analytics 4.</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`h-5 w-9 rounded-full transition-colors flex-shrink-0 mt-0.5 ${analytics ? 'bg-skyline-primary' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                  aria-label="Toggle analytics cookies"
                />
              </div>

              {/* Advertising */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--cb-border)] p-4">
                <div className="flex items-start gap-3">
                  <Megaphone size={18} className="mt-0.5 text-[var(--cb-text-muted)] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-black">Advertising</p>
                    <p className="mt-1 text-xs text-[var(--cb-text-muted)]">Allow personalised ads via Google AdSense and affiliate networks.</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={advertising}
                  onClick={() => setAdvertising(!advertising)}
                  className={`h-5 w-9 rounded-full transition-colors flex-shrink-0 mt-0.5 ${advertising ? 'bg-skyline-primary' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                  aria-label="Toggle advertising cookies"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={savePreferences} className="cb-btn cb-btn-primary flex-1">Save Preferences</button>
              <button type="button" onClick={rejectAll}       className="cb-btn cb-btn-ghost   flex-1">Reject All</button>
              <button type="button" onClick={acceptAll}       className="cb-btn cb-btn-ghost   flex-1">Accept All</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
