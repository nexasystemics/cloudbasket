// app/admin/vendors/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { getVendors, approveVendor, suspendVendor } from '@/services/vendor/vendor-portal'

interface Vendor {
  id: string
  name: string
  gst: string
  email: string
  phone: string
  status: 'pending' | 'active' | 'suspended'
  commission_rate: number
  total_products: number
  total_sales: number
  created_at: string
}

type Filter = 'all' | 'pending' | 'active' | 'suspended'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [filter])

  async function load() {
    setLoading(true)
    const data = await getVendors(filter === 'all' ? undefined : filter)
    setVendors(data as Vendor[])
    setLoading(false)
  }

  async function handleApprove(id: string) {
    setActionId(id)
    await approveVendor(id)
    await load()
    setActionId(null)
  }

  async function handleSuspend(id: string) {
    setActionId(id)
    await suspendVendor(id)
    await load()
    setActionId(null)
  }

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    suspended: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Portal</h1>
        <span className="text-sm text-gray-500">{vendors.length} vendors</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'active', 'suspended'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading vendors…</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No vendors found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Vendor</th>
                <th className="px-4 py-3 text-left">GST</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Commission</th>
                <th className="px-4 py-3 text-right">Products</th>
                <th className="px-4 py-3 text-right">Sales</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{v.gst}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[v.status]}`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{v.commission_rate}%</td>
                  <td className="px-4 py-3 text-right text-gray-700">{v.total_products}</td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    ₹{v.total_sales.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      {v.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(v.id)}
                          disabled={actionId === v.id}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {v.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(v.id)}
                          disabled={actionId === v.id}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      )}
                      {v.status === 'suspended' && (
                        <button
                          onClick={() => handleApprove(v.id)}
                          disabled={actionId === v.id}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                        >
                          Reinstate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
