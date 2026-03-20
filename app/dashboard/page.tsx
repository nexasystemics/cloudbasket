'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Bell, ChevronRight, ExternalLink, Heart, LogOut, Package,
  Settings, ShoppingBag, Star, TrendingDown, User, GitCompare,
  Clock, Gift, BarChart2, Download, Trash2
} from 'lucide-react'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'

type TabKey = 'overview' | 'wishlist' | 'alerts' | 'recently-viewed' | 'compare' | 'earnings' | 'settings' | 'refer'

const MOCK_USER = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  joinDate: 'January 2026',
  accountType: 'Associate',
  earnings: '₹4,200',
  clicks: 847,
  conversions: 23,
} as const

const INITIAL_ALERTS = [
  { product: 'Samsung Galaxy S25', target: '₹25,000', current: '₹29,999', targetNum: 25000, currentNum: 29999, status: 'waiting' },
  { product: 'MacBook Air M3', target: '₹80,000', current: '₹89,990', targetNum: 80000, currentNum: 89990, status: 'waiting' },
  { product: 'Sony WH-1000XM5', target: '₹15,000', current: '₹14,999', targetNum: 15000, currentNum: 14999, status: 'triggered' },
]

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart2 },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'alerts', label: 'Price Alerts', icon: Bell },
  { key: 'recently-viewed', label: 'Recently Viewed', icon: Clock },
  { key: 'compare', label: 'Compare Lists', icon: GitCompare },
  { key: 'earnings', label: 'Earnings', icon: Star },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'refer', label: 'Refer & Earn', icon: Gift },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('cb_saved_products')
      return stored ? JSON.parse(stored) : MOCK_PRODUCTS.slice(0, 4)
    } catch { return MOCK_PRODUCTS.slice(0, 4) }
  })
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [recentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('cb_recently_viewed')
      return stored ? JSON.parse(stored) : MOCK_PRODUCTS.slice(4, 8)
    } catch { return MOCK_PRODUCTS.slice(4, 8) }
  })
  const [compareList] = useState(() => {
    try {
      const stored = localStorage.getItem('cb_compare_list')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [notify, setNotify] = useState({ priceAlerts: true, dealAlerts: true, weeklyDigest: false, associateReports: true })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const referCode = useMemo(() => {
    try {
      const stored = localStorage.getItem('cb_ref_code')
      if (stored) return stored
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      localStorage.setItem('cb_ref_code', code)
      return code
    } catch { return 'CB' + Math.random().toString(36).substring(2, 6).toUpperCase() }
  }, [])

  const removeWishlistItem = (id: number) => setWishlist((c: any[]) => c.filter((item: any) => item.id !== id))
  const removeAlert = (product: string) => setAlerts((c) => c.filter((a) => a.product !== product))

  const exportData = () => {
    try {
      const data = {
        wishlist: localStorage.getItem('cb_saved_products'),
        recentlyViewed: localStorage.getItem('cb_recently_viewed'),
        compareList: localStorage.getItem('cb_compare_list'),
        priceAlerts: localStorage.getItem('cb_alert_emails'),
        exportedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cloudbasket-my-data.json'
      a.click()
    } catch { /* no-op */ }
  }

  return (
    <main className="min-h-screen bg-[var(--cb-bg)]">
      {/* Header */}
      <section className="bg-[var(--cb-surface-2)] py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-skyline-primary text-xl font-black text-white">
              {MOCK_USER.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black">{MOCK_USER.name}</h1>
              <p className="text-sm text-[var(--cb-text-muted)]">{MOCK_USER.email}</p>
              <span className="cb-badge cb-badge-green mt-1">{MOCK_USER.accountType}</span>
            </div>
          </div>
          <Link href="/login" className="cb-btn cb-btn-ghost gap-2"><LogOut size={16} /> Sign Out</Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-6 lg:flex lg:gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="cb-card p-3 sticky top-24">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors mb-1 ${activeTab === tab.key ? 'bg-skyline-primary/10 text-skyline-primary font-black' : 'hover:bg-[var(--cb-surface-2)] text-[var(--cb-text-secondary)]'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
          {TABS.map((tab) => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === tab.key ? 'bg-skyline-primary text-white' : 'cb-btn cb-btn-ghost'}`}>
              <tab.icon size={14} />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="cb-card p-6 bg-gradient-to-r from-skyline-primary/5 to-skyline-primary/10">
                <h2 className="text-xl font-black">Hi {MOCK_USER.name.split(' ')[0]}, here's your savings summary 👋</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { value: String(wishlist.length), label: 'Wishlist Items', icon: Heart, color: 'text-red-500' },
                  { value: String(alerts.length), label: 'Price Alerts', icon: Bell, color: 'text-skyline-primary' },
                  { value: MOCK_USER.earnings, label: 'Est. Savings', icon: Star, color: 'text-yellow-500' },
                  { value: String(MOCK_USER.conversions), label: 'Deals Clicked', icon: ShoppingBag, color: 'text-green-500' },
                ].map((stat) => (
                  <div key={stat.label} className="cb-card p-5 text-center">
                    <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-black">{stat.value}</p>
                    <p className="text-xs text-[var(--cb-text-muted)] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cb-card p-5">
                  <h3 className="font-black mb-4 flex items-center gap-2"><Heart size={16} className="text-red-500" /> Recent Wishlist</h3>
                  {wishlist.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[var(--cb-border)] last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-skyline-primary font-black">₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <Link href={`/product/${item.id}`} className="cb-btn cb-btn-ghost text-xs p-2"><ExternalLink size={12} /></Link>
                    </div>
                  ))}
                  <button type="button" onClick={() => setActiveTab('wishlist')} className="text-xs text-skyline-primary mt-3 flex items-center gap-1">View all <ChevronRight size={12} /></button>
                </div>
                <div className="cb-card p-5">
                  <h3 className="font-black mb-4 flex items-center gap-2"><Bell size={16} className="text-skyline-primary" /> Active Alerts</h3>
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.product} className="flex items-center justify-between py-2 border-b border-[var(--cb-border)] last:border-0">
                      <div>
                        <p className="text-sm font-bold line-clamp-1">{alert.product}</p>
                        <div className="w-32 h-1.5 bg-[var(--cb-surface-2)] rounded-full mt-1">
                          <div className="h-full bg-skyline-primary rounded-full" style={{ width: `${Math.min(100, Math.round((alert.targetNum / alert.currentNum) * 100))}%` }} />
                        </div>
                      </div>
                      <span className={alert.status === 'triggered' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>{alert.status === 'triggered' ? '🎯 Hit!' : 'Watching'}</span>
                    </div>
                  ))}
                  <button type="button" onClick={() => setActiveTab('alerts')} className="text-xs text-skyline-primary mt-3 flex items-center gap-1">Manage alerts <ChevronRight size={12} /></button>
                </div>
              </div>
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">My Wishlist ({wishlist.length})</h2>
                <button type="button" className="cb-btn cb-btn-ghost text-xs gap-1"><Heart size={12} /> Share Wishlist</button>
              </div>
              {wishlist.length === 0 ? (
                <div className="cb-card p-16 text-center">
                  <Heart size={48} className="mx-auto mb-4 text-[var(--cb-text-muted)]" />
                  <p className="font-black">Your wishlist is empty</p>
                  <Link href="/products" className="cb-btn cb-btn-primary mt-4">Browse Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {wishlist.map((item: any) => (
                    <article key={item.id} className="cb-card overflow-hidden">
                      <div className="relative h-36">
                        <Image src={resolveImageSource(item.image, IMAGE_ASSETS.noImage)} alt={item.name} fill className="object-cover" sizes="200px" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold line-clamp-2">{item.name}</p>
                        <p className="text-skyline-primary font-black text-sm mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                        <div className="mt-2 flex gap-1">
                          <Link href={`/product/${item.id}`} className="cb-btn cb-btn-primary flex-1 text-xs py-1.5">View</Link>
                          <button type="button" onClick={() => removeWishlistItem(item.id)} className="cb-btn cb-btn-ghost p-1.5" aria-label="Remove"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRICE ALERTS */}
          {activeTab === 'alerts' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Price Alerts ({alerts.length})</h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.product} className="cb-card p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-black">{alert.product}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[var(--cb-text-muted)]">
                        <span>Current: <strong className="text-[var(--cb-text-primary)]">{alert.current}</strong></span>
                        <span>Target: <strong className="text-skyline-primary">{alert.target}</strong></span>
                      </div>
                      <div className="w-full h-2 bg-[var(--cb-surface-2)] rounded-full mt-3">
                        <div className="h-full bg-skyline-primary rounded-full transition-all" style={{ width: `${Math.min(100, Math.round((alert.targetNum / alert.currentNum) * 100))}%` }} />
                      </div>
                      <p className="text-xs text-[var(--cb-text-muted)] mt-1">{Math.min(100, Math.round((alert.targetNum / alert.currentNum) * 100))}% to target</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={alert.status === 'triggered' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>{alert.status === 'triggered' ? '🎯 Target Hit!' : 'Watching'}</span>
                      <button type="button" onClick={() => removeAlert(alert.product)} className="cb-btn cb-btn-ghost text-xs gap-1"><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/search" className="cb-btn cb-btn-primary mt-6 gap-2"><Bell size={16} /> Set New Alert</Link>
            </div>
          )}

          {/* RECENTLY VIEWED */}
          {activeTab === 'recently-viewed' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">Recently Viewed</h2>
                <button type="button" onClick={() => { try { localStorage.removeItem('cb_recently_viewed') } catch { /* no-op */ } }} className="cb-btn cb-btn-ghost text-xs gap-1"><Trash2 size={12} /> Clear History</button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {recentlyViewed.slice(0, 8).map((item: any) => (
                  <Link key={item.id} href={`/product/${item.id}`} className="cb-card overflow-hidden group">
                    <div className="relative h-32">
                      <Image src={resolveImageSource(item.image, IMAGE_ASSETS.noImage)} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="200px" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold line-clamp-2 group-hover:text-skyline-primary">{item.name}</p>
                      <p className="text-skyline-primary font-black text-sm mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* COMPARE */}
          {activeTab === 'compare' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Saved Comparisons</h2>
              {compareList.length === 0 ? (
                <div className="cb-card p-16 text-center">
                  <GitCompare size={48} className="mx-auto mb-4 text-[var(--cb-text-muted)]" />
                  <p className="font-black">No saved comparisons</p>
                  <Link href="/compare" className="cb-btn cb-btn-primary mt-4">Start Comparing</Link>
                </div>
              ) : (
                <div className="cb-card p-6">
                  <p className="text-sm text-[var(--cb-text-muted)] mb-4">{compareList.length} products saved for comparison</p>
                  <Link href="/compare" className="cb-btn cb-btn-primary gap-2"><GitCompare size={16} /> Open Comparison</Link>
                  <button type="button" onClick={() => { try { localStorage.removeItem('cb_compare_list') } catch { /* no-op */ } }} className="cb-btn cb-btn-ghost ml-3 gap-2"><Trash2 size={16} /> Clear</button>
                </div>
              )}
            </div>
          )}

          {/* EARNINGS */}
          {activeTab === 'earnings' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Associate Earnings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { value: '₹4,200', label: 'Total Earned', color: 'text-green-500' },
                  { value: '₹1,800', label: 'This Month', color: 'text-skyline-primary' },
                  { value: '₹2,400', label: 'Next Payout (15th Mar)', color: 'text-orange-500' },
                ].map((item) => (
                  <div key={item.label} className="cb-card p-6 text-center">
                    <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-[var(--cb-text-muted)] mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="cb-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--cb-surface-2)]">
                    <tr>
                      {['Date', 'Product', 'Commission', 'Status'].map((h) => (
                        <th key={h} className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'March 7, 2026', product: 'Samsung Galaxy S25', commission: '₹750', status: 'Paid' },
                      { date: 'March 5, 2026', product: 'Nike Air Max 270', commission: '₹180', status: 'Paid' },
                      { date: 'March 3, 2026', product: 'MacBook Air M3', commission: '₹870', status: 'Processing' },
                    ].map((row) => (
                      <tr key={row.date + row.product} className="border-t border-[var(--cb-border)]">
                        <td className="py-3 px-4 text-[var(--cb-text-muted)]">{row.date}</td>
                        <td className="py-3 px-4 font-bold">{row.product}</td>
                        <td className="py-3 px-4 font-black text-green-500">{row.commission}</td>
                        <td className="py-3 px-4"><span className={row.status === 'Paid' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black">Account Settings</h2>
              <div className="cb-card p-6">
                <h3 className="font-black mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    { key: 'priceAlerts', label: 'Price drop alerts', desc: 'Notify when tracked product prices drop' },
                    { key: 'dealAlerts', label: 'Deal alerts', desc: 'Flash sales and limited time offers' },
                    { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Top 5 deals every Monday morning' },
                    { key: 'associateReports', label: 'Associate reports', desc: 'Monthly earnings and performance' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start justify-between gap-4 py-2">
                      <div>
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="text-xs text-[var(--cb-text-muted)]">{item.desc}</p>
                      </div>
                      <input type="checkbox" checked={notify[item.key as keyof typeof notify]} onChange={(e) => setNotify((c) => ({ ...c, [item.key]: e.target.checked }))} className="mt-1" />
                    </label>
                  ))}
                </div>
              </div>
              <div className="cb-card p-6">
                <h3 className="font-black mb-4">Data and Privacy</h3>
                <button type="button" onClick={exportData} className="cb-btn cb-btn-ghost gap-2 mb-3"><Download size={16} /> Export My Data (JSON)</button>
                <p className="text-xs text-[var(--cb-text-muted)]">Downloads all your saved data including wishlist, alerts, and preferences.</p>
              </div>
              <div className="cb-card p-6 border-red-500/20">
                <h3 className="font-black text-red-500 mb-2">Delete Account</h3>
                <p className="text-sm text-[var(--cb-text-muted)] mb-4">This will permanently delete your account and all associated data. This action cannot be undone.</p>
                {showDeleteConfirm ? (
                  <div className="space-y-2">
                    <p className="text-sm font-black text-red-500">Are you sure? Type DELETE to confirm.</p>
                    <input className="cb-input w-full" placeholder="Type DELETE" />
                    <div className="flex gap-2">
                      <button type="button" className="cb-btn bg-red-500 text-white text-sm">Confirm Delete</button>
                      <button type="button" onClick={() => setShowDeleteConfirm(false)} className="cb-btn cb-btn-ghost text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowDeleteConfirm(true)} className="cb-btn border border-red-500/30 text-red-500 text-sm">Delete Account</button>
                )}
              </div>
            </div>
          )}

          {/* REFER & EARN */}
          {activeTab === 'refer' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Refer & Earn</h2>
              <div className="cb-card p-8 text-center bg-gradient-to-br from-skyline-primary/5 to-skyline-primary/10 mb-6">
                <Gift size={48} className="mx-auto mb-4 text-skyline-primary" />
                <h3 className="text-xl font-black">Share CloudBasket, Earn Together</h3>
                <p className="text-[var(--cb-text-muted)] mt-2 mb-6">Refer friends and earn shopping credits when they use CloudBasket. Coming soon.</p>
                <div className="flex items-center gap-2 max-w-sm mx-auto">
                  <input className="cb-input flex-1 font-mono text-sm" value={`https://cloudbasket.in?ref=${referCode}`} readOnly />
                  <button type="button" onClick={() => { try { navigator.clipboard.writeText(`https://cloudbasket.in?ref=${referCode}`) } catch { /* no-op */ } }} className="cb-btn cb-btn-primary">Copy</button>
                </div>
                <p className="text-xs text-[var(--cb-text-muted)] mt-3">Your referral code: <strong>{referCode}</strong></p>
              </div>
              <div className="cb-card p-6">
                <h3 className="font-black mb-4">How It Works</h3>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'Share your referral link with friends' },
                    { step: '2', text: 'They sign up and use CloudBasket' },
                    { step: '3', text: 'You both earn shopping credits (coming soon)' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-skyline-primary/10 flex items-center justify-center font-black text-skyline-primary flex-shrink-0">{item.step}</div>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}