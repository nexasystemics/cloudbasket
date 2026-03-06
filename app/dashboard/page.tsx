'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bell, ExternalLink, Heart, LogOut, Package, Settings, Star, TrendingDown } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'

export default function DashboardPage() {
  const { user } = useGlobal()

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
        <h1 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Sign in required</h1>
        <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
          You need an account to access your dashboard.
        </p>
        <Link href={ROUTES.LOGIN} className="cb-btn-primary mt-4">
          Go to login
        </Link>
      </div>
    )
  }

  const MOCK_WISHLIST = PRODUCTS.slice(0, 4)
  const MOCK_ALERTS = [
    { product: PRODUCTS[0], targetPrice: 25000, currentPrice: 32999 },
    { product: PRODUCTS[1], targetPrice: 45000, currentPrice: 51999 },
  ]

  const initials = user.email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <section className="cb-card mb-6 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-skyline-primary font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-[var(--cb-text-primary)]">{user.email}</h1>
              <p className="text-sm text-[var(--cb-text-muted)]">{user.email}</p>
            </div>
            <span
              className={`cb-badge ${
                user.role === 'Admin'
                  ? 'bg-status-error/10 text-status-error'
                  : user.role === 'Associate'
                    ? 'bg-[#F97316]/10 text-[#F97316]'
                    : 'bg-skyline-glow text-skyline-primary'
              }`}
            >
              {user.role}
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="cb-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text-primary)]">
              <Heart size={18} />
              Saved Items
            </h2>
            <div className="mt-3">
              {MOCK_WISHLIST.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 border-b cb-border py-3 last:border-b-0"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-badge">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <p className="flex-1 truncate text-[13px] font-bold text-[var(--cb-text-primary)]">{product.name}</p>
                  <p className="font-mono text-sm text-skyline-primary">
                    ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                  </p>
                  <Link
                    href={'/go/amazon-' + String(product.id)}
                    className="text-[var(--cb-text-muted)] hover:text-skyline-primary"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </article>

          <article className="cb-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--cb-text-primary)]">
              <Bell size={18} />
              Price Alerts
            </h2>
            <div className="mt-3">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.product.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-bold text-[var(--cb-text-primary)]">{alert.product.name}</p>
                    <p className="font-mono text-xs text-status-success">
                      Target: ₹{new Intl.NumberFormat('en-IN').format(alert.targetPrice)}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-[var(--cb-text-muted)] line-through">
                    ₹{new Intl.NumberFormat('en-IN').format(alert.currentPrice)}
                  </p>
                  <span className="cb-badge bg-skyline-glow text-skyline-primary">Watching</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="cb-card mt-6 p-6">
          <h2 className="mb-3 text-lg font-bold text-[var(--cb-text-primary)]">Quick Links</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href={ROUTES.LOGIN} className="cb-btn-ghost justify-center gap-2">
              <Settings size={14} />
              Settings
            </Link>
            <Link href={ROUTES.PRODUCTS} className="cb-btn-ghost justify-center gap-2">
              <Package size={14} />
              Browse
            </Link>
            <Link href={ROUTES.DEALS} className="cb-btn-ghost justify-center gap-2">
              <TrendingDown size={14} />
              Deals
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
            <Star size={12} />
            Dashboard actions preserve secure /go/[id] affiliate routing.
          </div>
          <div className="mt-2 text-xs text-[var(--cb-text-muted)]">
            <LogOut size={12} className="me-1 inline-block" />
            Logout is available from the global header.
          </div>
        </section>
      </div>
    </div>
  )
}
