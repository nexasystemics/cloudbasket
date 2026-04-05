// app/admin/settings/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlatformSettings {
  site_name: string
  site_tagline: string
  support_email: string
  support_phone: string
  min_order_value: number
  free_shipping_threshold: number
  cod_charge: number
  default_currency: string
  default_gst_rate: number
  max_return_days: number
  max_cancellation_hours: number
  referral_bonus_amount: number
  review_reward_points: number
  points_to_inr_ratio: number
  maintenance_mode: boolean
  new_user_trial_days: number
}

type SettingKey = keyof PlatformSettings
type Tab = 'general' | 'commerce' | 'loyalty' | 'system'

// ─── Supabase Client ─────────────────────────────────────────────────────────

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// ─── Field Components ─────────────────────────────────────────────────────────

function TextInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  description?: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-400">{description}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  description,
  min = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  description?: string
  min?: number
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-400">{description}</p>}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
        {prefix && <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">{prefix}</span>}
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 px-3 py-2 text-sm focus:outline-none"
        />
        {suffix && <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">{suffix}</span>}
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  description,
  danger,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
  danger?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <p className={`text-sm font-medium ${danger ? 'text-red-700' : 'text-gray-700'}`}>{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          checked ? (danger ? 'bg-red-500' : 'bg-blue-600') : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

// ─── Default Settings ─────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: PlatformSettings = {
  site_name: 'CloudBasket',
  site_tagline: "India's Smartest Price Comparison Platform",
  support_email: 'support@cloudbasket.in',
  support_phone: '+91 9999999999',
  min_order_value: 199,
  free_shipping_threshold: 499,
  cod_charge: 49,
  default_currency: 'INR',
  default_gst_rate: 18,
  max_return_days: 10,
  max_cancellation_hours: 24,
  referral_bonus_amount: 100,
  review_reward_points: 50,
  points_to_inr_ratio: 0.1,
  maintenance_mode: false,
  new_user_trial_days: 14,
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS)
  const [originalSettings, setOriginalSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDirty = JSON.stringify(settings) !== JSON.stringify(originalSettings)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    const sb = getClient()
    if (!sb) { setLoading(false); return }

    try {
      const { data, error } = await sb.from('platform_settings').select('*').single()
      if (error) throw error
      if (data) {
        setSettings(data as PlatformSettings)
        setOriginalSettings(data as PlatformSettings)
      }
    } catch (err) {
      console.warn('[SettingsPage] loadSettings error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSettings() }, [loadSettings])

  function update<K extends SettingKey>(key: K, value: PlatformSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const sb = getClient()

    if (!sb) {
      setError('Database not configured.')
      setSaving(false)
      return
    }

    try {
      const { error } = await sb.from('platform_settings').upsert(settings)
      if (error) throw error
      setOriginalSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.warn('[SettingsPage] handleSave error:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setSettings(originalSettings)
    setSaved(false)
    setError(null)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'commerce', label: 'Commerce' },
    { id: 'loyalty', label: 'Loyalty' },
    { id: 'system', label: 'System' },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure global platform behaviour</p>
        </div>
        <div className="flex gap-2 items-center">
          {isDirty && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              <SettingsSection title="Brand">
                <TextInput label="Site Name" value={settings.site_name} onChange={(v) => update('site_name', v)} />
                <TextInput label="Tagline" value={settings.site_tagline} onChange={(v) => update('site_tagline', v)} />
              </SettingsSection>
              <SettingsSection title="Contact">
                <TextInput label="Support Email" value={settings.support_email} onChange={(v) => update('support_email', v)} description="Displayed on contact pages and emails" />
                <TextInput label="Support Phone" value={settings.support_phone} onChange={(v) => update('support_phone', v)} />
              </SettingsSection>
            </>
          )}

          {/* Commerce Tab */}
          {activeTab === 'commerce' && (
            <>
              <SettingsSection title="Orders">
                <NumberInput label="Minimum Order Value" value={settings.min_order_value} onChange={(v) => update('min_order_value', v)} prefix="₹" description="Orders below this amount cannot be placed" />
                <NumberInput label="Free Shipping Threshold" value={settings.free_shipping_threshold} onChange={(v) => update('free_shipping_threshold', v)} prefix="₹" />
                <NumberInput label="COD Charge" value={settings.cod_charge} onChange={(v) => update('cod_charge', v)} prefix="₹" description="Extra charge for cash on delivery orders" />
              </SettingsSection>
              <SettingsSection title="Tax">
                <NumberInput label="Default GST Rate" value={settings.default_gst_rate} onChange={(v) => update('default_gst_rate', v)} suffix="%" description="Used when HSN/category mapping not found" />
              </SettingsSection>
              <SettingsSection title="Returns & Cancellations">
                <NumberInput label="Return Window" value={settings.max_return_days} onChange={(v) => update('max_return_days', v)} suffix="days" />
                <NumberInput label="Cancellation Window" value={settings.max_cancellation_hours} onChange={(v) => update('max_cancellation_hours', v)} suffix="hours" />
              </SettingsSection>
            </>
          )}

          {/* Loyalty Tab */}
          {activeTab === 'loyalty' && (
            <>
              <SettingsSection title="Referrals">
                <NumberInput label="Referral Bonus" value={settings.referral_bonus_amount} onChange={(v) => update('referral_bonus_amount', v)} prefix="₹" description="Credited to both referrer and referee" />
              </SettingsSection>
              <SettingsSection title="Review Rewards">
                <NumberInput label="Base Review Points" value={settings.review_reward_points} onChange={(v) => update('review_reward_points', v)} suffix="pts" />
                <NumberInput label="Points to ₹ Ratio" value={settings.points_to_inr_ratio} onChange={(v) => update('points_to_inr_ratio', v)} prefix="1 pt =" suffix="₹" description="How much each point is worth in rupees" />
              </SettingsSection>
              <SettingsSection title="Subscriptions">
                <NumberInput label="New User Free Trial" value={settings.new_user_trial_days} onChange={(v) => update('new_user_trial_days', v)} suffix="days" />
              </SettingsSection>
            </>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <SettingsSection title="System Controls">
              <Toggle
                label="Maintenance Mode"
                checked={settings.maintenance_mode}
                onChange={(v) => update('maintenance_mode', v)}
                description="Puts the site in maintenance mode — only admins can access"
                danger
              />
            </SettingsSection>
          )}
        </div>
      )}
    </div>
  )
}
