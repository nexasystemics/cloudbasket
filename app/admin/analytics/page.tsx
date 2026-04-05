'use client'
// app/admin/analytics/page.tsx
// D21: Admin Analytics Dashboard

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Users, ShoppingBag, MousePointer, DollarSign, RefreshCw, BarChart2 } from 'lucide-react'

type MetricCard = {
  label: string
  value: string
  change: number
  icon: React.ElementType
  color: string
}

type DailyData = {
  date: string
  clicks: number
  conversions: number
  revenue: number
  visitors: number
}

const STUB_METRICS: MetricCard[] = [
  { label: 'Total Visitors', value: '48,291', change: 12.4, icon: Users, color: 'text-blue-500' },
  { label: 'Product Clicks', value: '1,24,830', change: 8.7, icon: MousePointer, color: 'text-purple-500' },
  { label: 'Conversions', value: '3,847', change: -2.1, icon: ShoppingBag, color: 'text-orange-500' },
  { label: 'Affiliate Revenue', value: '₹2,84,920', change: 15.3, icon: DollarSign, color: 'text-green-500' },
]

const STUB_DAILY: DailyData[] = [
  { date: 'Apr 1', clicks: 18420, conversions: 542, revenue: 38400, visitors: 7230 },
  { date: 'Apr 2', clicks: 21340, conversions: 618, revenue: 44200, visitors: 8140 },
  { date: 'Apr 3', clicks: 19870, conversions: 589, revenue: 41800, visitors: 7680 },
  { date: 'Apr 4', clicks: 24560, conversions: 712, revenue: 52600, visitors: 9340 },
  { date: 'Apr 5', clicks: 22180, conversions: 631, revenue: 47900, visitors: 8520 },
]

const TOP_PRODUCTS = [
  { name: 'boAt Airdopes 141', clicks: 4820, conversions: 142, revenue: '₹18,420' },
  { name: 'Realme Narzo 70', clicks: 3940, conversions: 118, revenue: '₹24,680' },
  { name: 'Bajaj Mixer Grinder', clicks: 3210, conversions: 97, revenue: '₹12,940' },
  { name: 'Puma Men T-Shirt', clicks: 2870, conversions: 84, revenue: '₹8,740' },
  { name: 'HUL Dove Shampoo', clicks: 2540, conversions: 76, revenue: '₹6,320' },
]

export default function AdminAnalyticsPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString('en-IN'))
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString('en-IN'))
      setIsRefreshing(false)
    }, 1200)
  }

  const maxClicks = Math.max(...STUB_DAILY.map(d => d.clicks))

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
              <BarChart2 size={24} className="text-skyline-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
              Last updated: {lastUpdated}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="cb-btn-ghost flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STUB_METRICS.map((metric) => (
            <div key={metric.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">{metric.label}</p>
                <metric.icon size={16} className={metric.color} />
              </div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{metric.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {metric.change >= 0
                  ? <TrendingUp size={12} className="text-green-500" />
                  : <TrendingDown size={12} className="text-red-500" />
                }
                <span className={`text-xs font-black ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-xs text-zinc-400 font-bold">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Clicks Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Daily Clicks — Last 5 Days</h2>
          <div className="flex items-end gap-4 h-40">
            {STUB_DAILY.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-black text-zinc-500">{day.clicks.toLocaleString('en-IN')}</span>
                <div
                  className="w-full bg-skyline-primary/80 rounded-t-lg transition-all"
                  style={{ height: `${(day.clicks / maxClicks) * 100}px` }}
                />
                <span className="text-xs font-bold text-zinc-400">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Top Performing Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="text-left text-xs font-black uppercase tracking-widest text-zinc-400 pb-3">Product</th>
                  <th className="text-right text-xs font-black uppercase tracking-widest text-zinc-400 pb-3">Clicks</th>
                  <th className="text-right text-xs font-black uppercase tracking-widest text-zinc-400 pb-3">Conversions</th>
                  <th className="text-right text-xs font-black uppercase tracking-widest text-zinc-400 pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                {TOP_PRODUCTS.map((product) => (
                  <tr key={product.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3 text-sm font-bold text-zinc-900 dark:text-white">{product.name}</td>
                    <td className="py-3 text-right text-sm font-bold text-zinc-600 dark:text-zinc-400">{product.clicks.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right text-sm font-bold text-zinc-600 dark:text-zinc-400">{product.conversions}</td>
                    <td className="py-3 text-right text-sm font-black text-green-600">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
