'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Bell,
  ChevronRight,
  ExternalLink,
  Heart,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Star,
  TrendingDown,
  User,
} from 'lucide-react'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'

type TabKey = 'overview' | 'wishlist' | 'alerts' | 'earnings' | 'settings'

type PriceAlert = {
  product: string
  target: string
  current: string
  status: 'waiting' | 'triggered'
}

const MOCK_USER = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  joinDate: 'January 2026',
  accountType: 'Associate',
  earnings: '₹4,200',
  clicks: 847,
  conversions: 23,
} as const

const INITIAL_ALERTS: PriceAlert[] = [
  { product: 'Samsung Galaxy S25', target: '₹25,000', current: '₹29,999', status: 'waiting' },
  { product: 'MacBook Air M3', target: '₹80,000', current: '₹89,990', status: 'waiting' },
  { product: 'Sony WH-1000XM5', target: '₹15,000', current: '₹19,999', status: 'triggered' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [wishlist, setWishlist] = useState(() => MOCK_PRODUCTS.slice(0, 4))
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS)
  const [notify, setNotify] = useState({
    priceAlerts: true,
    dealAlerts: true,
    weeklyDigest: false,
    associateReports: true,
  })

  const recentWishlist = useMemo(() => wishlist.slice(0, 3), [wishlist])

  const removeWishlistItem = (id: number) => {
    setWishlist((current) => current.filter((item) => item.id !== id))
  }

  const removeAlert = (product: string) => {
    setAlerts((current) => current.filter((alert) => alert.product !== product))
  }

  const addAlert = () => {
    setAlerts((current) => [
      ...current,
      {
        product: 'iPhone 16 Pro',
        target: '₹99,000',
        current: '₹1,09,900',
        status: 'waiting',
      },
    ])
  }

  const tabs: ReadonlyArray<{ key: TabKey; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'alerts', label: 'Price Alerts' },
    { key: 'earnings', label: 'Earnings' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <main className="min-h-screen bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#039BE5] text-xl font-black text-white">
              R
            </div>
            <div>
              <h1 className="text-2xl font-black">{MOCK_USER.name}</h1>
              <p className="text-sm text-[var(--cb-text-muted)]">{MOCK_USER.email}</p>
              <span className="cb-badge cb-badge-green mt-1">{MOCK_USER.accountType}</span>
            </div>
          </div>

          <Link href="/login" className="cb-btn cb-btn-ghost gap-2">
            <LogOut size={16} />
            Sign Out
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap gap-2 border-b border-[var(--cb-border)] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={
                activeTab === tab.key ? 'cb-btn cb-btn-primary text-sm' : 'cb-btn cb-btn-ghost text-sm'
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        {activeTab === 'overview' ? (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { value: String(MOCK_USER.clicks), label: 'Total Clicks', icon: TrendingDown },
                { value: String(MOCK_USER.conversions), label: 'Conversions', icon: ShoppingBag },
                { value: MOCK_USER.earnings, label: 'Total Earned', icon: Star },
                { value: String(wishlist.length), label: 'Wishlist Items', icon: Heart },
              ].map((stat) => (
                <article key={stat.label} className="cb-card p-6 text-center">
                  <stat.icon size={16} className="mx-auto mb-2 text-[#039BE5]" />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">{stat.label}</p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="cb-card p-6">
                <h2 className="mb-4 text-lg font-black">Recent Wishlist</h2>
                {recentWishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-[var(--cb-border)] py-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="price-current text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <Link href={`/go/amazon-${item.id}`} className="cb-btn cb-btn-primary text-xs">
                      <ExternalLink size={12} />
                      View Deal
                    </Link>
                  </div>
                ))}
              </article>

              <article className="cb-card p-6">
                <h2 className="mb-4 text-lg font-black">Price Alerts</h2>
                {alerts.map((alert) => (
                  <div
                    key={alert.product}
                    className="flex items-center justify-between border-b border-[var(--cb-border)] py-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-bold">{alert.product}</p>
                      <p className="text-xs text-[var(--cb-text-muted)]">Target: {alert.target}</p>
                    </div>
                    <span className={alert.status === 'triggered' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>
                      {alert.status === 'triggered' ? 'Target Hit!' : 'Watching'}
                    </span>
                  </div>
                ))}
              </article>
            </div>
          </>
        ) : null}

        {activeTab === 'wishlist' ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {wishlist.map((item) => (
              <article key={item.id} className="cb-card overflow-hidden">
                <div className="relative h-40">
                  <Image src={resolveImageSource(item.image, IMAGE_ASSETS.noImage)} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-bold">{item.name}</p>
                  <p className="price-current mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/go/amazon-${item.id}`} className="cb-btn cb-btn-primary flex-1 text-xs">
                      View Deal
                    </Link>
                    <button
                      type="button"
                      className="cb-btn cb-btn-ghost p-2 text-xs"
                      onClick={() => removeWishlistItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Heart size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === 'alerts' ? (
          <article className="cb-card p-6">
            <h2 className="mb-6 text-xl font-black">Your Price Alerts</h2>
            {alerts.map((alert) => (
              <div key={alert.product} className="cb-card mb-3 flex items-center justify-between p-5">
                <div>
                  <p className="font-bold">{alert.product}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">Target: {alert.target}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">Current: {alert.current}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={alert.status === 'triggered' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>
                    {alert.status === 'triggered' ? 'Target Hit!' : 'Watching'}
                  </span>
                  <button
                    type="button"
                    className="cb-btn cb-btn-ghost text-xs"
                    onClick={() => removeAlert(alert.product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="cb-btn cb-btn-primary mt-4" onClick={addAlert}>
              <Bell size={16} />
              Add Price Alert
            </button>
          </article>
        ) : null}

        {activeTab === 'earnings' ? (
          <article className="cb-card p-8">
            <h2 className="mb-2 text-2xl font-black">Associate Earnings</h2>
            <p className="mb-8 text-[var(--cb-text-muted)]">Your commission dashboard</p>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { value: '₹4,200', label: 'Total Earned' },
                { value: '₹1,800', label: 'This Month' },
                { value: '₹2,400', label: 'Next Payout (15th March)' },
              ].map((item) => (
                <div key={item.label} className="cb-card p-6 text-center">
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-xs text-[var(--cb-text-muted)]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--cb-border)] text-left text-[var(--cb-text-muted)]">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Commission</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'March 7, 2026', product: 'Samsung Galaxy S25', commission: '₹750', status: 'Paid' },
                    { date: 'March 5, 2026', product: 'Nike Air Max 270', commission: '₹180', status: 'Paid' },
                    { date: 'March 3, 2026', product: 'MacBook Air M3', commission: '₹870', status: 'Processing' },
                  ].map((row) => (
                    <tr key={`${row.date}-${row.product}`} className="border-b border-[var(--cb-border)] last:border-0">
                      <td className="px-3 py-3">{row.date}</td>
                      <td className="px-3 py-3">{row.product}</td>
                      <td className="px-3 py-3 font-bold text-[#10B981]">{row.commission}</td>
                      <td className="px-3 py-3">
                        <span className={row.status === 'Paid' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {activeTab === 'settings' ? (
          <article className="cb-card p-8">
            <h2 className="mb-6 text-xl font-black">Account Settings</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-[var(--cb-text-muted)]">Name</label>
                <input className="cb-input w-full" value={MOCK_USER.name} readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--cb-text-muted)]">Email</label>
                <input className="cb-input w-full" value={MOCK_USER.email} readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--cb-text-muted)]">Phone</label>
                <input className="cb-input w-full" value="+91 98765 43210" readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--cb-text-muted)]">City</label>
                <input className="cb-input w-full" value="Mumbai" readOnly />
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-bold">Notifications</p>
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                {[
                  { key: 'priceAlerts', label: 'Price alerts' },
                  { key: 'dealAlerts', label: 'Deal alerts' },
                  { key: 'weeklyDigest', label: 'Weekly digest' },
                  { key: 'associateReports', label: 'Associate reports' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notify[item.key as keyof typeof notify]}
                      onChange={(event) =>
                        setNotify((current) => ({ ...current, [item.key]: event.target.checked }))
                      }
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="button" className="cb-btn cb-btn-primary mt-6 gap-2">
              <Settings size={16} />
              Save Settings
            </button>

            <article className="cb-card mt-6 border-red-500/20 p-6">
              <p className="font-black text-red-500">Delete Account</p>
              <p className="mt-1 text-xs text-[var(--cb-text-muted)]">
                Joined {MOCK_USER.joinDate} · Use support if you want permanent deletion.
              </p>
              <button type="button" className="cb-btn mt-3 border border-red-500/20 text-red-500">
                Delete Account
              </button>
            </article>
          </article>
        ) : null}
      </section>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-8 text-xs text-[var(--cb-text-muted)]">
        <p className="inline-flex items-center gap-1">
          <User size={12} /> Account ready
        </p>
        <p className="inline-flex items-center gap-1">
          <Package size={12} /> All purchases route through /go/[id]
        </p>
        <p className="inline-flex items-center gap-1">
          <ChevronRight size={12} /> NEXQON dashboard module
        </p>
      </div>
    </main>
  )
}
