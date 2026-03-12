'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  BarChart2,
  Database,
  DollarSign,
  Eye,
  Globe,
  Package,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'

type TabKey = 'overview' | 'products' | 'users' | 'revenue' | 'settings'

type ActivityType = 'success' | 'info' | 'warning'

type ActivityItem = {
  time: string
  event: string
  user: string
  type: ActivityType
}

const ADMIN_STATS = {
  totalProducts: 2000,
  totalUsers: 1247,
  totalClicks: 48293,
  totalRevenue: '₹1,24,500',
  activeDeals: 12,
  associates: 89,
  podOrders: 34,
  pageViews: '2,84,719',
} as const

const RECENT_ACTIVITY: ActivityItem[] = [
  { time: '2 min ago', event: 'New associate signup', user: 'Priya S.', type: 'success' },
  { time: '15 min ago', event: 'POD order placed', user: 'Rahul M.', type: 'success' },
  { time: '1 hr ago', event: 'Price alert triggered', user: 'System', type: 'info' },
  { time: '2 hr ago', event: 'New user registered', user: 'Arjun K.', type: 'success' },
  { time: '3 hr ago', event: 'Deal expired', user: 'System', type: 'warning' },
  { time: '5 hr ago', event: 'CJ commission earned', user: 'System', type: 'success' },
]

const REVENUE_STREAMS = [
  { name: 'Affiliate', amount: '₹68,000', width: '55%' },
  { name: 'POD', amount: '₹24,500', width: '20%' },
  { name: 'Associates', amount: '₹18,500', width: '15%' },
  { name: 'AdSense', amount: '₹8,200', width: '7%' },
  { name: 'CJ Network', amount: '₹5,300', width: '4%' },
] as const

const MOCK_USERS = [
  { name: 'Rahul Sharma', email: 'rahul@example.com', type: 'Shopper', joined: 'Jan 2026', status: 'Active' },
  { name: 'Priya Singh', email: 'priya@example.com', type: 'Associate', joined: 'Jan 2026', status: 'Active' },
  { name: 'Arjun Kapoor', email: 'arjun@example.com', type: 'POD Creator', joined: 'Feb 2026', status: 'Inactive' },
  { name: 'Neha Mehta', email: 'neha@example.com', type: 'Shopper', joined: 'Feb 2026', status: 'Active' },
  { name: 'Vikram Das', email: 'vikram@example.com', type: 'Associate', joined: 'Mar 2026', status: 'Active' },
] as const

const MONTHLY_REVENUE = [
  { month: 'October 2025', affiliate: 8200, pod: 3500, associates: 2100, adsense: 1100, cj: 900 },
  { month: 'November 2025', affiliate: 9100, pod: 3900, associates: 2400, adsense: 1250, cj: 980 },
  { month: 'December 2025', affiliate: 10400, pod: 4200, associates: 2600, adsense: 1320, cj: 1100 },
  { month: 'January 2026', affiliate: 11800, pod: 4800, associates: 3100, adsense: 1400, cj: 1250 },
  { month: 'February 2026', affiliate: 13100, pod: 5200, associates: 3500, adsense: 1550, cj: 1450 },
  { month: 'March 2026', affiliate: 15400, pod: 6900, associates: 4800, adsense: 1580, cj: 1720 },
]

const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`

const getActivityColor = (type: ActivityType): string => {
  if (type === 'success') return 'bg-[#10B981]'
  if (type === 'warning') return 'bg-[#F5C842]'
  return 'bg-[#039BE5]'
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const tabs: ReadonlyArray<{ key: TabKey; label: string }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'products', label: 'Products' },
    { key: 'users', label: 'Users' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'settings', label: 'Settings' },
  ]

  const statCards = [
    { label: 'Products', value: '2,000', icon: Package, color: '#039BE5' },
    { label: 'Users', value: '1,247', icon: Users, color: '#10B981' },
    { label: 'Clicks', value: '48,293', icon: Eye, color: '#F97316' },
    { label: 'Revenue', value: '₹1,24,500', icon: DollarSign, color: '#F5C842' },
    { label: 'Active Deals', value: '12', icon: Zap, color: '#EF4444' },
    { label: 'Associates', value: '89', icon: Globe, color: '#8B5CF6' },
    { label: 'POD Orders', value: '34', icon: Package, color: '#EC4899' },
    { label: 'Page Views', value: '2,84,719', icon: BarChart2, color: '#039BE5' },
  ] as const

  const totals = MONTHLY_REVENUE.reduce(
    (acc, row) => {
      acc.affiliate += row.affiliate
      acc.pod += row.pod
      acc.associates += row.associates
      acc.adsense += row.adsense
      acc.cj += row.cj
      return acc
    },
    { affiliate: 0, pod: 0, associates: 0, adsense: 0, cj: 0 }
  )

  const totalRevenueAll = totals.affiliate + totals.pod + totals.associates + totals.adsense + totals.cj

  return (
    <main className="min-h-screen bg-[var(--cb-bg)]">
      <header className="border-b border-[var(--cb-border)] bg-[#09090B] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[#039BE5]" />
            <div>
              <p className="font-black text-white">CloudBasket Admin</p>
              <p className="text-xs text-[var(--cb-text-muted)]">NEXQON Control Panel</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="cb-badge cb-badge-green">● System Healthy</span>
            <Link href="/" className="cb-btn cb-btn-ghost text-sm">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-6">
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

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {activeTab === 'overview' ? (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {statCards.map((card) => (
                <article key={card.label} className="cb-card p-6">
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${card.color}1F` }}
                  >
                    <card.icon size={18} style={{ color: card.color }} />
                  </div>
                  <p className="text-2xl font-black">{card.value}</p>
                  <p className="text-xs text-[var(--cb-text-muted)]">{card.label}</p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="cb-card p-6">
                <h2 className="mb-4 text-lg font-black">Recent Activity</h2>
                {RECENT_ACTIVITY.map((item) => (
                  <div
                    key={`${item.time}-${item.event}`}
                    className="flex items-center gap-3 border-b border-[var(--cb-border)] py-3 last:border-0"
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${getActivityColor(item.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{item.event}</p>
                      <p className="text-xs text-[var(--cb-text-muted)]">
                        {item.user} · {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </article>

              <article className="cb-card p-6">
                <h2 className="mb-4 text-lg font-black">Revenue Breakdown</h2>
                {REVENUE_STREAMS.map((stream) => (
                  <div key={stream.name} className="mb-3">
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{stream.name}</span>
                      <span>{stream.amount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--cb-surface-2)]">
                      <div className="h-2 rounded-full bg-[#039BE5]" style={{ width: stream.width }} />
                    </div>
                  </div>
                ))}
              </article>
            </div>
          </>
        ) : null}

        {activeTab === 'products' ? (
          <article className="cb-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black">Product Management</h2>
              <button type="button" className="cb-btn cb-btn-primary gap-2">
                <Package size={16} />
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--cb-border)] text-left text-[var(--cb-text-muted)]">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Platform</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PRODUCTS.slice(0, 10).map((product) => (
                    <tr key={product.id} className="border-b border-[var(--cb-border)] last:border-0">
                      <td className="px-3 py-3">{product.id}</td>
                      <td className="px-3 py-3">{product.name}</td>
                      <td className="px-3 py-3">{product.mainCategory}</td>
                      <td className="px-3 py-3">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3">{product.source}</td>
                      <td className="px-3 py-3">
                        <button type="button" className="cb-btn cb-btn-ghost mr-2 text-xs">
                          Edit
                        </button>
                        <button type="button" className="cb-btn text-xs text-red-500">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {activeTab === 'users' ? (
          <article className="cb-card p-6">
            <h2 className="mb-6 text-xl font-black">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--cb-border)] text-left text-[var(--cb-text-muted)]">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Joined</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map((user) => (
                    <tr key={user.email} className="border-b border-[var(--cb-border)] last:border-0">
                      <td className="px-3 py-3">{user.name}</td>
                      <td className="px-3 py-3">{user.email}</td>
                      <td className="px-3 py-3">{user.type}</td>
                      <td className="px-3 py-3">{user.joined}</td>
                      <td className="px-3 py-3">
                        <span className={user.status === 'Active' ? 'cb-badge cb-badge-green' : 'cb-badge cb-badge-blue'}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button type="button" className="cb-btn cb-btn-ghost text-xs">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {activeTab === 'revenue' ? (
          <article className="cb-card p-8">
            <h2 className="mb-8 text-2xl font-black">Revenue Analytics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--cb-border)] text-left text-[var(--cb-text-muted)]">
                    <th className="px-3 py-2">Month</th>
                    <th className="px-3 py-2">Affiliate</th>
                    <th className="px-3 py-2">POD</th>
                    <th className="px-3 py-2">Associates</th>
                    <th className="px-3 py-2">AdSense</th>
                    <th className="px-3 py-2">CJ</th>
                    <th className="px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_REVENUE.map((row) => {
                    const rowTotal = row.affiliate + row.pod + row.associates + row.adsense + row.cj
                    return (
                      <tr key={row.month} className="border-b border-[var(--cb-border)] last:border-0">
                        <td className="px-3 py-3">{row.month}</td>
                        <td className="px-3 py-3">{formatInr(row.affiliate)}</td>
                        <td className="px-3 py-3">{formatInr(row.pod)}</td>
                        <td className="px-3 py-3">{formatInr(row.associates)}</td>
                        <td className="px-3 py-3">{formatInr(row.adsense)}</td>
                        <td className="px-3 py-3">{formatInr(row.cj)}</td>
                        <td className="px-3 py-3 font-bold">{formatInr(rowTotal)}</td>
                      </tr>
                    )
                  })}
                  <tr className="bg-[var(--cb-surface-2)] font-black">
                    <td className="px-3 py-3">Total</td>
                    <td className="px-3 py-3">{formatInr(totals.affiliate)}</td>
                    <td className="px-3 py-3">{formatInr(totals.pod)}</td>
                    <td className="px-3 py-3">{formatInr(totals.associates)}</td>
                    <td className="px-3 py-3">{formatInr(totals.adsense)}</td>
                    <td className="px-3 py-3">{formatInr(totals.cj)}</td>
                    <td className="px-3 py-3">{formatInr(totalRevenueAll)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {activeTab === 'settings' ? (
          <article className="cb-card p-8">
            <h2 className="mb-6 text-xl font-black">Platform Settings</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-[var(--cb-border)] pb-3">
                <span>Maintenance Mode</span>
                <span className="cb-badge cb-badge-green">OFF</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--cb-border)] pb-3">
                <span>Amazon Tag</span>
                <span className="font-mono">cloudbasket-21</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--cb-border)] pb-3">
                <span>Flipkart ID</span>
                <span className="font-mono">cb-flipkart-01</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--cb-border)] pb-3">
                <span>AdSense ID</span>
                <span className="font-mono">ca-pub-XXXXXXXX</span>
              </div>
            </div>

            <article className="cb-card mt-6 border-[#F5C842]/30 bg-[#F5C842]/5 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-[#F5C842]">
                <AlertCircle size={16} />
                Maintenance mode is controlled via MAINTENANCE_MODE env variable
              </p>
            </article>

            <div className="mt-6 flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
              <Database size={14} />
              Live stats: {ADMIN_STATS.totalClicks.toLocaleString('en-IN')} clicks · {ADMIN_STATS.pageViews} views
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
              <Settings size={14} />
              {ADMIN_STATS.totalUsers.toLocaleString('en-IN')} users · {ADMIN_STATS.activeDeals} active deals
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-[var(--cb-text-muted)]">
              <TrendingUp size={14} />
              Revenue tracking active: {ADMIN_STATS.totalRevenue}
            </div>
          </article>
        ) : null}
      </section>
    </main>
  )
}



