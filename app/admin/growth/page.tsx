'use client'

import { useState } from 'react'

interface ReferralRow {
  id: string
  referrerEmail: string
  refereeEmail: string
  code: string
  status: 'pending' | 'clicked' | 'registered' | 'converted' | 'rewarded'
  referrerReward: number
  createdAt: string
  source: string
}

interface CouponRow {
  id: string
  code: string
  title: string
  platform: string
  discount: number
  discountType: 'percent' | 'flat'
  successRate: number
  usageCount: number
  validUntil: string
  isVerified: boolean
}

const MOCK_REFERRALS: ReferralRow[] = [
  {
    id: '1',
    referrerEmail: 'priya@gmail.com',
    refereeEmail: 'raj@gmail.com',
    code: 'CBPRIYA1',
    status: 'rewarded',
    referrerReward: 100,
    createdAt: '2026-04-01',
    source: 'whatsapp',
  },
  {
    id: '2',
    referrerEmail: 'amit@gmail.com',
    refereeEmail: 'neha@gmail.com',
    code: 'CBAMIT2',
    status: 'converted',
    referrerReward: 100,
    createdAt: '2026-04-02',
    source: 'email',
  },
  {
    id: '3',
    referrerEmail: 'priya@gmail.com',
    refereeEmail: 'suresh@gmail.com',
    code: 'CBPRIYA1',
    status: 'pending',
    referrerReward: 100,
    createdAt: '2026-04-03',
    source: 'link',
  },
  {
    id: '4',
    referrerEmail: 'ravi@gmail.com',
    refereeEmail: 'meena@gmail.com',
    code: 'CBRAVI3',
    status: 'registered',
    referrerReward: 100,
    createdAt: '2026-04-04',
    source: 'share',
  },
  {
    id: '5',
    referrerEmail: 'amit@gmail.com',
    refereeEmail: 'deepa@gmail.com',
    code: 'CBAMIT2',
    status: 'rewarded',
    referrerReward: 100,
    createdAt: '2026-04-05',
    source: 'whatsapp',
  },
]

const MOCK_COUPONS: CouponRow[] = [
  {
    id: '1',
    code: 'SAVE10',
    title: '10% Off Sitewide',
    platform: 'amazon',
    discount: 10,
    discountType: 'percent',
    successRate: 87,
    usageCount: 1423,
    validUntil: '2026-04-12',
    isVerified: true,
  },
  {
    id: '2',
    code: 'FLAT200',
    title: '₹200 Off on ₹999+',
    platform: 'flipkart',
    discount: 200,
    discountType: 'flat',
    successRate: 92,
    usageCount: 876,
    validUntil: '2026-04-08',
    isVerified: true,
  },
  {
    id: '3',
    code: 'NEW15',
    title: '15% Off for New Users',
    platform: 'generic',
    discount: 15,
    discountType: 'percent',
    successRate: 78,
    usageCount: 234,
    validUntil: '2026-04-30',
    isVerified: false,
  },
  {
    id: '4',
    code: 'FASHION20',
    title: '20% Off Fashion',
    platform: 'myntra',
    discount: 20,
    discountType: 'percent',
    successRate: 81,
    usageCount: 567,
    validUntil: '2026-04-10',
    isVerified: true,
  },
]

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  clicked: 'bg-blue-100 text-blue-800',
  registered: 'bg-purple-100 text-purple-800',
  converted: 'bg-orange-100 text-orange-800',
  rewarded: 'bg-green-100 text-green-800',
}

export default function GrowthAdminPage() {
  const [activeTab, setActiveTab] = useState<'referrals' | 'coupons'>('referrals')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const converted = MOCK_REFERRALS.filter(
    (r) => r.status === 'converted' || r.status === 'rewarded'
  ).length
  const conversionRate =
    MOCK_REFERRALS.length > 0
      ? Math.round((converted / MOCK_REFERRALS.length) * 100)
      : 0
  const totalRewards = MOCK_REFERRALS.filter((r) => r.status === 'rewarded').reduce(
    (sum, r) => sum + r.referrerReward,
    0
  )
  const verifiedCoupons = MOCK_COUPONS.filter((c) => c.isVerified).length
  const avgSuccessRate =
    MOCK_COUPONS.length > 0
      ? Math.round(
          MOCK_COUPONS.reduce((sum, c) => sum + c.successRate, 0) / MOCK_COUPONS.length
        )
      : 0

  const filteredReferrals =
    statusFilter === 'all'
      ? MOCK_REFERRALS
      : MOCK_REFERRALS.filter((r) => r.status === statusFilter)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Growth Engine</h1>
          <p className="text-gray-500 text-sm mt-1">
            Referrals, coupons &amp; viral growth tools
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
          <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            + Add Coupon
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Referrals',
            value: MOCK_REFERRALS.length,
            sub: `${converted} converted`,
            color: 'text-blue-600',
          },
          {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            sub: 'referral → purchase',
            color: 'text-green-600',
          },
          {
            label: 'Rewards Paid',
            value: `₹${totalRewards}`,
            sub: 'to referrers',
            color: 'text-orange-600',
          },
          {
            label: 'Active Coupons',
            value: MOCK_COUPONS.length,
            sub: `${verifiedCoupons} verified · ${avgSuccessRate}% avg success`,
            color: 'text-purple-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(['referrals', 'coupons'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'referrals' ? `Referrals (${MOCK_REFERRALS.length})` : `Coupons (${MOCK_COUPONS.length})`}
          </button>
        ))}
      </div>

      {/* Referrals */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'clicked', 'registered', 'converted', 'rewarded'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-medium rounded-full border capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Referrer', 'Referee', 'Code', 'Source', 'Status', 'Reward', 'Date'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReferrals.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.referrerEmail}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.refereeEmail}</td>
                      <td className="px-4 py-3 font-mono text-orange-600 text-xs bg-orange-50">
                        {r.code}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{r.source}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            STATUS_CLASSES[r.status]
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        ₹{r.referrerReward}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{r.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredReferrals.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                No referrals matching filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coupons */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    'Code',
                    'Title',
                    'Platform',
                    'Discount',
                    'Success Rate',
                    'Usage',
                    'Expires',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_COUPONS.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{c.title}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{c.platform}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">
                      {c.discountType === 'percent'
                        ? `${c.discount}%`
                        : `₹${c.discount}`}{' '}
                      off
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.successRate >= 85
                                ? 'bg-green-500'
                                : c.successRate >= 70
                                ? 'bg-yellow-500'
                                : 'bg-red-400'
                            }`}
                            style={{ width: `${c.successRate}%` }}
                          />
                        </div>
                        <span className="text-gray-700 text-xs font-medium">
                          {c.successRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.usageCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.validUntil}</td>
                    <td className="px-4 py-3">
                      {c.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                          <span className="text-green-500">✓</span> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-700 text-xs font-medium">
                          <span>⚠</span> Unverified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
