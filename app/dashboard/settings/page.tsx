'use client'
import { useState } from 'react'
import { Save } from 'lucide-react'
const NOTIFICATION_PREFS = ['Price drops on wishlist', 'Flash deal alerts', 'Weekly digest email', 'Order updates via WhatsApp', 'SMS alerts for top deals']
export default function SettingsPage() {
  const [notifs, setNotifs] = useState<Record<string, boolean>>({})
  const [currency, setCurrency] = useState('INR')
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Settings</h1>
      <div className="space-y-6">
        <div className="cb-card p-6">
          <h2 className="font-black mb-4">Notification Preferences</h2>
          {NOTIFICATION_PREFS.map(pref => (
            <label key={pref} className="flex items-center justify-between py-2 border-b border-[var(--cb-border)] last:border-0 cursor-pointer">
              <span className="text-sm">{pref}</span>
              <input type="checkbox" checked={notifs[pref] ?? true} onChange={e => setNotifs(prev => ({ ...prev, [pref]: e.target.checked }))} className="rounded" />
            </label>
          ))}
        </div>
        <div className="cb-card p-6">
          <h2 className="font-black mb-4">Display</h2>
          <label className="block text-sm mb-2">Currency</label>
          <select className="cb-input w-full" value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="INR">₹ INR — Indian Rupee</option>
            <option value="USD">$ USD — US Dollar</option>
            <option value="GBP">£ GBP — British Pound</option>
          </select>
        </div>
        <button onClick={save} className="cb-btn cb-btn-primary w-full gap-2">
          <Save size={16} />{saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>
    </main>
  )
}