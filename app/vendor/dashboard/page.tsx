// D61 — vendor-dashboard.tsx | app/vendor/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface VendorStats {
  totalRevenue: number;
  pendingPayout: number;
  processedPayout: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  activeProducts: number;
  avgRating: number;
  reviewCount: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  productId: string;
  name: string;
  imageUrl?: string;
  unitsSold: number;
  revenue: number;
}

const STAT_CARDS = [
  { key: 'totalRevenue', label: 'Total Revenue', prefix: '₹', color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'pendingPayout', label: 'Pending Payout', prefix: '₹', color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'totalOrders', label: 'Total Orders', prefix: '', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'activeProducts', label: 'Active Products', prefix: '', color: 'text-purple-600', bg: 'bg-purple-50' },
] as const;

const STATUS_COLORS: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  shipped: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-gray-100 text-gray-700',
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingPayout, setRequestingPayout] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/vendor/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard');
      const data = await res.json();
      setStats(data.stats ?? null);
      setRecentOrders(data.recentOrders ?? []);
      setTopProducts(data.topProducts ?? []);
    } catch (err) {
      console.warn('[vendor-dashboard] fetchDashboard:', err);
      setError('Unable to load dashboard. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleRequestPayout = async () => {
    try {
      if (!stats || stats.pendingPayout < 100) {
        alert('Minimum payout amount is ₹100');
        return;
      }
      setRequestingPayout(true);
      const res = await fetch('/api/vendor/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: stats.pendingPayout }),
      });
      if (!res.ok) throw new Error('Payout request failed');
      alert('Payout request submitted successfully!');
      fetchDashboard();
    } catch (err) {
      console.warn('[vendor-dashboard] handleRequestPayout:', err);
      alert('Failed to request payout. Please try again.');
    } finally {
      setRequestingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-white rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-sm text-gray-500">CloudBasket Seller Portal</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/vendor/products/new')}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
            >
              + Add Product
            </button>
            <button
              onClick={handleRequestPayout}
              disabled={requestingPayout || !stats || stats.pendingPayout < 100}
              className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {requestingPayout ? 'Requesting...' : 'Request Payout'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map(({ key, label, prefix, color, bg }) => (
              <div key={key} className="bg-white rounded-xl shadow-sm p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${bg} mb-3`}>
                  <span className={`text-lg font-bold ${color}`}>{prefix || '#'}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {prefix}
                  {typeof stats[key as keyof VendorStats] === 'number'
                    ? prefix === '₹'
                      ? (stats[key as keyof VendorStats] as number).toLocaleString('en-IN')
                      : stats[key as keyof VendorStats]
                    : '—'}
                </p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Rating Banner */}
        {stats && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.round(stats.avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stats.reviewCount} reviews</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <p className="text-sm font-medium text-gray-700">Seller Performance</p>
                <p className="text-xs text-gray-500">{stats.pendingOrders} orders need attention</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/vendor/orders?status=pending')}
              className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition"
            >
              View Pending ({stats.pendingOrders})
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => router.push('/vendor/orders')}
                className="text-sm text-orange-500 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y">
              {recentOrders.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-500">No orders yet</div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => router.push(`/vendor/orders/${order.id}`)}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.productName}</p>
                      <p className="text-xs text-gray-500">
                        #{order.orderNumber} · Qty {order.quantity}
                      </p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">₹{order.amount.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Top Products</h2>
              <button
                onClick={() => router.push('/vendor/products')}
                className="text-sm text-orange-500 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="divide-y">
              {topProducts.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-500">No products yet</div>
              ) : (
                topProducts.map((product, i) => (
                  <div key={product.productId} className="px-5 py-4 flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      ₹{product.revenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'My Products', path: '/vendor/products' },
            { label: 'Orders', path: '/vendor/orders' },
            { label: 'Payouts', path: '/vendor/payouts' },
            { label: 'Settings', path: '/vendor/settings' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              className="py-3 bg-white border rounded-xl text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-500 transition shadow-sm"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
