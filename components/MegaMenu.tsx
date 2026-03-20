'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Smartphone, Laptop, Shirt, Home, Camera, Gamepad2, Zap, ShoppingBag } from 'lucide-react'

const CATEGORIES = [
  { label: 'Mobiles', slug: 'mobiles', icon: Smartphone },
  { label: 'Laptops', slug: 'laptops', icon: Laptop },
  { label: 'Fashion', slug: 'fashion', icon: Shirt },
  { label: 'Home', slug: 'home', icon: Home },
  { label: 'Cameras', slug: 'cameras', icon: Camera },
  { label: 'Gaming', slug: 'gaming', icon: Gamepad2 },
  { label: 'Electronics', slug: 'electronics', icon: Zap },
  { label: 'Beauty', slug: 'beauty', icon: ShoppingBag },
]

export default function MegaMenu() {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="flex items-center gap-1 text-sm font-bold hover:text-skyline-primary transition-colors">
        Categories <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[560px] rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-[var(--cb-border)] overflow-hidden">
          <div className="flex">
            <div className="w-44 border-r border-[var(--cb-border)] py-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${activeCategory.slug === cat.slug ? 'bg-skyline-primary/10 text-skyline-primary font-black' : 'hover:bg-[var(--cb-surface-2)]'}`}
                  onMouseEnter={() => setActiveCategory(cat)}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex-1 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)] mb-3">Top Deal in {activeCategory.label}</p>
              <div className="cb-card p-4">
                <div className="h-24 bg-[var(--cb-surface-2)] rounded-lg mb-3 flex items-center justify-center">
                  <activeCategory.icon size={40} className="text-[var(--cb-text-muted)]" />
                </div>
                <p className="text-sm font-black">Best {activeCategory.label} Deals</p>
                <p className="text-xs text-[var(--cb-text-muted)] mt-1">Compare prices across all platforms</p>
                <Link href={`/category/${activeCategory.slug}`} className="cb-btn cb-btn-primary mt-3 w-full text-xs">View Deals →</Link>
              </div>
              <Link href="/categories" className="block mt-3 text-xs text-skyline-primary underline text-center">View all categories →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}