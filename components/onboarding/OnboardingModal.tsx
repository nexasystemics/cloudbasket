// © 2026 NEXQON HOLDINGS — CloudBasket OnboardingModal.tsx
// F23: Complete Onboarding Flow Modal
'use client'
import { useState, useEffect } from 'react'
import { ChevronRight, Check, X } from 'lucide-react'

const STEPS = [
  { id: 1, emoji: '🛒', title: 'Welcome to CloudBasket!', desc: 'Compare prices across Amazon, Flipkart, Croma and 50+ stores. Save up to 70% every day.' },
  { id: 2, emoji: '🎯', title: 'Personalise your feed', desc: 'Tell us what you shop for and we\'ll surface the best deals for you.' },
  { id: 3, emoji: '🔔', title: 'Never miss a deal', desc: 'Enable price alerts and get notified the moment prices drop on products you love.' },
  { id: 4, emoji: '🚀', title: 'You\'re all set!', desc: 'Start saving money. India\'s best prices, one click away.' },
]
const CATEGORIES = ['Mobile Phones', 'Laptops & Tablets', 'Fashion & Clothes', 'Home Appliances', 'Books', 'Sports & Fitness', 'Beauty & Skincare', 'Toys & Games', 'Groceries', 'Electronics']

const STORAGE_KEY = 'cb_onboarding_done'

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [interests, setInterests] = useState<string[]>([])
  const [notifEnabled, setNotifEnabled] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      setTimeout(() => setVisible(true), 1500)
    }
  }, [])

  const toggle = (cat: string) => setInterests(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat])

  const complete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1')
      if (interests.length > 0) localStorage.setItem('cb_interests', JSON.stringify(interests))
    }
    setVisible(false)
  }

  const enableNotifs = async () => {
    try {
      const perm = await Notification.requestPermission()
      setNotifEnabled(perm === 'granted')
    } catch { /* no-op */ }
    setStep(4)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex gap-1 p-6 pb-0">
          {STEPS.map(s => <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all ${s.id <= step ? 'bg-skyline-primary' : 'bg-zinc-200 dark:bg-zinc-700'}`} />)}
        </div>
        <div className="p-8">
          <button onClick={complete} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
          <div className="text-5xl mb-4 text-center">{STEPS[step - 1].emoji}</div>
          <h2 className="text-2xl font-black text-center mb-2">{STEPS[step - 1].title}</h2>
          <p className="text-[var(--cb-text-muted)] text-center mb-6">{STEPS[step - 1].desc}</p>

          {step === 2 && (
            <div className="grid grid-cols-2 gap-2 mb-6">
              {CATEGORIES.map(c => (
                <button key={c} type="button" onClick={() => toggle(c)} className={`text-xs py-2 px-3 rounded-xl border transition-all text-left ${interests.includes(c) ? 'bg-skyline-primary text-white border-skyline-primary' : 'border-zinc-200 dark:border-zinc-700 hover:border-skyline-primary'}`}>{c}</button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 mb-6">
              <button type="button" onClick={enableNotifs} className="cb-btn cb-btn-primary w-full gap-2">Enable Price Alerts</button>
              <button type="button" onClick={() => setStep(4)} className="cb-btn cb-btn-ghost w-full">Skip for now</button>
            </div>
          )}

          {step === 4 && (
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={32} className="text-white" />
              </div>
            </div>
          )}

          {step !== 3 && (
            <button type="button" onClick={() => step < 4 ? setStep(s => s + 1) : complete()} className="cb-btn cb-btn-primary w-full gap-2">
              {step === 4 ? 'Start Shopping' : 'Next'}<ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
