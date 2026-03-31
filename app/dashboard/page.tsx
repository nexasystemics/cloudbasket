// © 2026 NEXQON HOLDINGS — CloudBasket page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Package, Heart, Bell, Settings, Star, TrendingUp } from 'lucide-react'
export const metadata: Metadata = { title: 'My Dashboard — CloudBasket', description: 'Manage your CloudBasket account, orders, wishlist and preferences.' }
const MENU = [
  { href: '/dashboard/orders', icon: Package, label: 'My Orders', desc: 'Track and manage orders' },
  { href: '/dashboard/wishlist', icon: Heart, label: 'Wishlist', desc: 'Saved products' },
  { href: '/dashboard/alerts', icon: Bell, label: 'Price Alerts', desc: 'Deal notifications' },
  { href: '/dashboard/reviews', icon: Star, label: 'My Reviews', desc: 'Products you reviewed' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings', desc: 'Account preferences' },
  { href: '/dashboard/referrals', icon: TrendingUp, label: 'Referrals', desc: 'Earn with CloudBasket' },
]
export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">My Dashboard</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Manage your account, orders and preferences.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {MENU.map(item => (
          <Link key={item.href} href={item.href} className="cb-card p-5 hover:border-skyline-primary transition-colors group">
            <item.icon size={22} className="text-skyline-primary mb-3" />
            <p className="font-black text-sm">{item.label}</p>
            <p className="text-xs text-[var(--cb-text-muted)] mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
