'use client'
// components/LiveActivityFeed.tsx
// Social proof — shows non-intrusive activity notifications.

import { useEffect, useState } from 'react'

const ACTIVITIES = [
  "Someone from Mumbai just saved ₹1,200 on a boAt earphone",
  "A shopper from Bangalore found iPhone 15 at lowest price",
  "User from Delhi saved 35% on a Prestige pressure cooker",
  "Someone from Hyderabad set a price alert for Samsung TV",
  "A buyer from Chennai just compared 5 mixer grinders",
  "User from Pune found a flash deal on Noise smartwatch",
  "Someone from Kolkata saved ₹800 on HUL products bundle",
  "A shopper from Ahmedabad just checked Flipkart vs Amazon prices",
  "User from Jaipur found realme phone ₹500 cheaper than retail",
  "Someone from Surat saved on Dabur hair care products",
  "A buyer from Lucknow compared prices across 4 platforms",
  "User from Kochi set price alerts for 3 products today",
  "Someone from Nagpur found Havells fan at best price",
  "A shopper from Indore saved ₹2,000 on a Bajaj appliance",
  "User from Bhopal just found a deal ending in 2 hours",
  "Someone from Visakhapatnam compared Puma shoes across sites",
  "A buyer from Coimbatore saved on ITC Sunfeast products",
  "User from Vadodara found lowest price for Philips iron",
  "Someone from Patna just discovered a 40% flash sale",
  "A shopper from Guwahati saved on Godrej home appliances",
]

export default function LiveActivityFeed() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try { if (sessionStorage.getItem('cb_activity_dismissed') === '1') { setDismissed(true); return } } catch { /* no-op */ }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIndex(i => (i + 1) % ACTIVITIES.length); setVisible(true) }, 400)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 max-w-xs transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => { setDismissed(true); try { sessionStorage.setItem('cb_activity_dismissed', '1') } catch { /* no-op */ } }}
    >
      <div className="cb-card p-3 shadow-lg cursor-pointer flex items-center gap-2 text-xs">
        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse" />
        <span className="text-[var(--cb-text-secondary)]">{ACTIVITIES[index]}</span>
      </div>
    </div>
  )
}
