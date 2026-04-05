// app/admin/reports/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { getReturnMetrics } from '@/services/orders/return-manager'
import { getSupportMetrics } from '@/services/support/chat-support'
import { getAllBundleStats } from '@/services/deals/bundle-creator'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReturnMetrics {
  total_returns: number
  pending: number
  approved: number
  rejected: number
  refund_processed: number
  total_refunded: number
  avg_processing_days: number
}

interface SupportMetrics {
  open_tickets: number
  in_progress: number
  resolved_today: number
  avg_first_response_hours: number
  avg_resolution_hours: number
  satisfaction_score: number | null
  tickets_by_category: Record<string, number>
}

interface BundleStat {
  bundle_id: string
  total_sales: number
  revenue: number
  avg_order_value: number
  conversion_rate: number
  top_region: string | null
}

interface TopVendor {
  vendor_id: string
  name: string
  revenue: number
  orders: number
  commission: number
  return_rate: number
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color = 'blue',
}: {
  label: string
  value: string | number
  sub?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs opacity-60">{sub}</p>}
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [returns, setReturns] = useState<ReturnMetrics | null>(null)
  const [support, setSupport] = useState<SupportMetrics | null>(null)
  const [bundles, setBundles] = useState<BundleStat[]>([])
  const [topVendors, setTopVendors] = useState<TopVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [returnData, supportData, bundleData] = await Promise.all([
          getReturnMetrics(),
          getSupportMetrics(),
          getAllBundleStats(5),
        ])
        setReturns(returnData)
        setSupport(supportData)
        setBundles(bundleData)
      } catch (err) {
        console.warn('[ReportsPage] load error:', err)
        setError('Failed to load report data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const ticketCategoryData = support
    ? Object.entries(support.tickets_by_category).map(([cat, count]) => ({
        category: cat.replace(/_/g, ' '),
        tickets: count,
      }))
    : []

  const bundleChartData = bundles.map((b) => ({
    id: b.bundle_id.slice(0, 8),
    sales: b.total_sales,
    revenue: b.revenue,
    conversion: b.conversion_rate,
  }))

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide metrics overview</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Live data
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── Returns Section ── */}
      <section>
        <SectionHeader title="Returns & Refunds" sub="Current return pipeline status" />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : returns ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Returns" value={returns.total_returns} color="blue" />
              <StatCard label="Pending Review" value={returns.pending} color="yellow" />
              <StatCard label="Refunds Processed" value={returns.refund_processed} color="green" />
              <StatCard
                label="Total Refunded"
                value={`₹${returns.total_refunded.toLocaleString('en-IN')}`}
                sub={`Avg ${returns.avg_processing_days}d processing`}
                color="purple"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatCard label="Approved" value={returns.approved} color="green" />
              <StatCard label="Rejected" value={returns.rejected} color="red" />
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">No return data available.</p>
        )}
      </section>

      {/* ── Support Section ── */}
      <section>
        <SectionHeader title="Support Tickets" sub="Live ticket queue and response metrics" />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : support ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Open Tickets" value={support.open_tickets} color="red" />
              <StatCard label="In Progress" value={support.in_progress} color="yellow" />
              <StatCard label="Resolved Today" value={support.resolved_today} color="green" />
              <StatCard
                label="Satisfaction Score"
                value={support.satisfaction_score !== null ? `${support.satisfaction_score}/5` : 'N/A'}
                sub={`Avg response: ${support.avg_first_response_hours}h`}
                color="blue"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-4">Tickets by Category</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ticketCategoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">No support data available.</p>
        )}
      </section>

      {/* ── Bundles Section ── */}
      <section>
        <SectionHeader title="Top Bundles Performance" sub="Revenue and conversion by bundle" />
        {loading ? (
          <Skeleton className="h-64" />
        ) : bundles.length > 0 ? (
          <>
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={bundleChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="id" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} name="Revenue (₹)" />
                  <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={false} name="Sales" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Bundle ID</th>
                    <th className="px-4 py-3 text-right">Sales</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                    <th className="px-4 py-3 text-right">AOV</th>
                    <th className="px-4 py-3 text-right">Conversion</th>
                    <th className="px-4 py-3 text-left">Top Region</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bundles.map((b) => (
                    <tr key={b.bundle_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bundle_id.slice(0, 12)}…</td>
                      <td className="px-4 py-3 text-right text-gray-700">{b.total_sales}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">₹{b.revenue.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right text-gray-700">₹{b.avg_order_value.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${b.conversion_rate >= 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {b.conversion_rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.top_region ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">No bundle data available.</p>
        )}
      </section>
    </div>
  )
}
