'use client'

import { useState } from 'react'
import type { LoyaltyTier } from '@/services/crm/loyalty-program'

interface UserRow {
  id: string
  name: string
  email: string
  phone: string
  tier: LoyaltyTier
  pointsBalance: number
  totalSpend: number
  cashbackEarned: number
  cashbackPending: number
  wishlistCount: number
  referrals: number
  joinedAt: string
  lastActive: string
  status: 'active' | 'inactive' | 'blocked'
}

const MOCK_USERS: UserRow[] = [
  {
    id: 'u1',
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    phone: '+91 98765 43210',
    tier: 'gold',
    pointsBalance: 6240,
    totalSpend: 48500,
    cashbackEarned: 1820,
    cashbackPending: 340,
    wishlistCount: 12,
    referrals: 5,
    joinedAt: '2025-08-14',
    lastActive: '2026-04-04',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Amit Kumar',
    email: 'amit@gmail.com',
    phone: '+91 87654 32109',
    tier: 'silver',
    pointsBalance: 2100,
    totalSpend: 18700,
    cashbackEarned: 620,
    cashbackPending: 120,
    wishlistCount: 7,
    referrals: 3,
    joinedAt: '2025-11-02',
    lastActive: '2026-04-03',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Ravi Patel',
    email: 'ravi@gmail.com',
    phone: '+91 76543 21098',
    tier: 'platinum',
    pointsBalance: 22800,
    totalSpend: 142000,
    cashbackEarned: 6200,
    cashbackPending: 0,
    wishlistCount: 34,
    referrals: 12,
    joinedAt: '2025-06-20',
    lastActive: '2026-04-05',
    status: 'active',
  },
  {
    id: 'u4',
    name: 'Meena Reddy',
    email: 'meena@gmail.com',
    phone: '+91 65432 10987',
    tier: 'bronze',
    pointsBalance: 450,
    totalSpend: 3200,
    cashbackEarned: 80,
    cashbackPending: 80,
    wishlistCount: 3,
    referrals: 0,
    joinedAt: '2026-03-01',
    lastActive: '2026-04-01',
    status: 'active',
  },
  {
    id: 'u5',
    name: 'Deepa Nair',
    email: 'deepa@gmail.com',
    phone: '+91 54321 09876',
    tier: 'bronze',
    pointsBalance: 120,
    totalSpend: 890,
    cashbackEarned: 22,
    cashbackPending: 22,
    wishlistCount: 1,
    referrals: 0,
    joinedAt: '2026-03-28',
    lastActive: '2026-03-30',
    status: 'inactive',
  },
]

const TIER_CONFIG: Record<LoyaltyTier, { label: string; classes: string; icon: string }> = {
  bronze: { label: 'Bronze', classes: 'bg-amber-100 text-amber-800', icon: '🥉' },
  silver: { label: 'Silver', classes: 'bg-gray-100 text-gray-700', icon: '🥈' },
  gold: { label: 'Gold', classes: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
  platinum: { label: 'Platinum', classes: 'bg-purple-100 text-purple-800', icon: '💎' },
}

const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  blocked: 'bg-red-100 text-red-800',
}

export default function UsersAdminPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<LoyaltyTier | 'all'>('all')
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  const totalRevenue = MOCK_USERS.reduce((sum, u) => sum + u.totalSpend, 0)
  const totalCashback = MOCK_USERS.reduce((sum, u) => sum + u.cashbackEarned, 0)
  const totalReferrals = MOCK_USERS.reduce((sum, u) => sum + u.referrals, 0)

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch =
      search.trim() === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || u.tier === tierFilter
    return matchSearch && matchTier
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            Loyalty tiers, cashback, and account management
          </p>
        </div>
        <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Export Users
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: MOCK_USERS.length, sub: `${MOCK_USERS.filter(u => u.status === 'active').length} active`, color: 'text-blue-600' },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: `avg ₹${Math.round(totalRevenue / MOCK_USERS.length).toLocaleString('en-IN')}/user`, color: 'text-green-600' },
          { label: 'Cashback Issued', value: `₹${totalCashback.toLocaleString('en-IN')}`, sub: `${Math.round((totalCashback / totalRevenue) * 100)}% of revenue`, color: 'text-orange-600' },
          { label: 'Total Referrals', value: totalReferrals, sub: `avg ${(totalReferrals / MOCK_USERS.length).toFixed(1)} per user`, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {(['all', 'bronze', 'silver', 'gold', 'platinum'] as const).map((tier) => {
          const count = tier === 'all'
            ? MOCK_USERS.length
            : MOCK_USERS.filter(u => u.tier === tier).length
          const config = tier !== 'all' ? TIER_CONFIG[tier] : null
          return (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${
                tierFilter === tier
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {config ? `${config.icon} ${config.label}` : '👥 All'} ({count})
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User', 'Tier', 'Points', 'Total Spend', 'Cashback', 'Referrals', 'Joined', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const tierCfg = TIER_CONFIG[u.tier]
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tierCfg.classes}`}>
                        {tierCfg.icon} {tierCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {u.pointsBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₹{u.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">₹{u.cashbackEarned.toLocaleString('en-IN')}</p>
                      {u.cashbackPending > 0 && (
                        <p className="text-xs text-yellow-600">₹{u.cashbackPending} pending</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-center">{u.referrals}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{u.joinedAt}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_CLASSES[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="text-xs text-orange-600 hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No users found.</div>
        )}
      </div>

      {/* User detail panel */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white w-full max-w-sm h-full shadow-xl p-6 overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{selectedUser.name}</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: 'Email', value: selectedUser.email },
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Joined', value: selectedUser.joinedAt },
                { label: 'Last Active', value: selectedUser.lastActive },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-700">Loyalty & Rewards</h3>
              {[
                { label: 'Tier', value: `${TIER_CONFIG[selectedUser.tier].icon} ${TIER_CONFIG[selectedUser.tier].label}` },
                { label: 'Points Balance', value: selectedUser.pointsBalance.toLocaleString() },
                { label: 'Total Spend', value: `₹${selectedUser.totalSpend.toLocaleString('en-IN')}` },
                { label: 'Cashback Earned', value: `₹${selectedUser.cashbackEarned.toLocaleString('en-IN')}` },
                { label: 'Pending Cashback', value: `₹${selectedUser.cashbackPending.toLocaleString('en-IN')}` },
                { label: 'Wishlist Items', value: selectedUser.wishlistCount },
                { label: 'Referrals Made', value: selectedUser.referrals },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Block User
              </button>
              <button className="flex-1 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
