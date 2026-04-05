// D58 — order-page.tsx | app/account/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStatusLabel, getStatusStep } from '@/services/orders/order-tracking-utils';
import type { TrackingEventStatus } from '@/services/orders/order-tracking-utils';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: TrackingEventStatus;
  items: OrderItem[];
  totalAmount: number;
  trackingId?: string;
  trackingUrl?: string;
  expectedDelivery?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  shipped: 'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  packed: 'bg-yellow-100 text-yellow-700',
  payment_confirmed: 'bg-orange-100 text-orange-700',
  order_placed: 'bg-gray-100 text-gray-700',
};

const FILTER_OPTIONS = ['all', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(filter !== 'all' && { status: filter }),
      });
      const res = await fetch(`/api/account/orders?${params}`);
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.warn('[order-page] fetchOrders:', err);
      setError('Unable to load orders. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId: string) => {
    try {
      if (!confirm('Cancel this order?')) return;
      const res = await fetch(`/api/account/orders/${orderId}/cancel`, { method: 'POST' });
      if (!res.ok) throw new Error('Cancel failed');
      fetchOrders();
    } catch (err) {
      console.warn('[order-page] handleCancel:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <span className="text-sm text-gray-500">{total} orders</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap capitalize transition ${
                filter === f
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border hover:border-orange-300'
              }`}
            >
              {f === 'all' ? 'All Orders' : getStatusLabel(f as TrackingEventStatus)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg font-semibold text-gray-700">No orders found</p>
            <p className="text-sm text-gray-500 mt-1">
              {filter !== 'all' ? 'Try a different filter' : 'Start shopping on CloudBasket'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {!['cancelled', 'refunded', 'returned'].includes(order.status) && (
                  <div className="px-5 py-3 bg-gray-50">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            step <= getStatusStep(order.status)
                              ? 'bg-orange-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="px-5 py-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          ₹{item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                {/* Tracking + Actions */}
                <div className="px-5 py-3 border-t flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-gray-500">
                    {order.trackingId && (
                      <span>
                        Tracking:{' '}
                        {order.trackingUrl ? (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:underline"
                          >
                            {order.trackingId}
                          </a>
                        ) : (
                          order.trackingId
                        )}
                      </span>
                    )}
                    {order.expectedDelivery && !['delivered', 'cancelled', 'refunded'].includes(order.status) && (
                      <span className={order.trackingId ? ' · ' : ''}>
                        Est.{' '}
                        {new Date(order.expectedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short',
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/account/orders/${order.id}`)}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:border-orange-400 hover:text-orange-500 transition"
                    >
                      View Details
                    </button>
                    {['pending', 'confirmed'].includes(order.status) && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-3 py-1.5 text-xs border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => router.push(`/product/${order.items[0]?.productId}#review`)}
                        className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-orange-400 transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-orange-400 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
