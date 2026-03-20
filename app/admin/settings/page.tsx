'use client'
import { useState, useEffect } from 'react'
import type { Metadata } from 'next'

type FeatureFlags = {
  adsenseEnabled: boolean
  podOrderingEnabled: boolean
  userRegistrationEnabled: boolean
  priceAlertsEnabled: boolean
  maintenanceMode: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  adsenseEnabled: false,
  podOrderingEnabled: true,
  userRegistrationEnabled: true,
  priceAlertsEnabled: true,
  maintenanceMode: false,
}

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cb_admin_flags')
      if (stored) setFlags(JSON.parse(stored))
    } catch { /* no-op */ }
  }, [])

  const saveFlags = () => {
    try { localStorage.setItem('cb_admin_flags', JSON.stringify(flags)); setSaved(true); setTimeout(() => setSaved(false), 2000) } catch { /* no-op */ }
  }

  const FLAG_LABELS: { key: keyof FeatureFlags; label: string; desc: string; danger?: boolean }[] = [
    { key: 'adsenseEnabled', label: 'Google AdSense', desc: 'Enable display advertising via Google AdSense' },
    { key: 'podOrderingEnabled', label: 'POD Ordering', desc: 'Allow users to place Print-on-Demand orders' },
    { key: 'userRegistrationEnabled', label: 'User Registration', desc: 'Allow new users to register accounts' },
    { key: 'priceAlertsEnabled', label: 'Price Alerts', desc: 'Allow users to set and receive price alerts' },
    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance banner across all pages', danger: true },
  ]

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Site Settings</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Feature flags stored locally. Changes take effect immediately.</p>

      <div className="cb-card p-6 mb-6">
        <h2 className="font-black mb-1">Site Information</h2>
        <p className="text-xs text-[var(--cb-text-muted)] mb-4">Managed via environment variables in .env.local</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-[var(--cb-text-muted)]">Site Name</span><span className="font-bold">CloudBasket</span></div>
          <div className="flex justify-between"><span className="text-[var(--cb-text-muted)]">Support Email</span><span className="font-bold">support@cloudbasket.in</span></div>
          <div className="flex justify-between"><span className="text-[var(--cb-text-muted)]">Version</span><span className="font-bold">v2.0.0</span></div>
        </div>
      </div>

      <div className="cb-card p-6">
        <h2 className="font-black mb-6">Feature Flags</h2>
        <div className="space-y-4">
          {FLAG_LABELS.map((item) => (
            <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl ${item.danger && flags[item.key] ? 'bg-red-500/5 border border-red-500/20' : 'bg-[var(--cb-surface-2)]'}`}>
              <div>
                <p className={`font-black text-sm ${item.danger ? 'text-red-500' : ''}`}>{item.label}</p>
                <p className="text-xs text-[var(--cb-text-muted)]">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setFlags((f) => ({ ...f, [item.key]: !f[item.key] }))}
                className={`w-12 h-6 rounded-full transition-colors ${flags[item.key] ? (item.danger ? 'bg-red-500' : 'bg-skyline-primary') : 'bg-zinc-300 dark:bg-zinc-600'}`}
                aria-label={`Toggle ${item.label}`}
              >
                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${flags[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={saveFlags} className="cb-btn cb-btn-primary mt-6 w-full">
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </main>
  )
}