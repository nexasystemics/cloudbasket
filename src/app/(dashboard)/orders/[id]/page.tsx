'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getOrderById, updateOrderStatus, cancelOrder } from '@/services/orders/order-manager';
import { getTrackingEvents } from '@/services/orders/order-tracking';
import type { Order, OrderItem } from '@/services/orders/order-manager';
import type { TrackingEvent } from '@/services/orders/order-tracking';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const supabase = createBrowserSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const orderData = await getOrderById(orderId);
        if (!orderData || orderData.userId !== user.id) {
          setError('Order not found');
          return;
        }

        setOrder(orderData);

        const events = await getTrackingEvents(orderId);
        setTrackingEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, router]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      const updated = await cancelOrder(order.id);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
              <p className="text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-bold ${
                order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item: OrderItem, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {trackingEvents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tracking</h2>
              <div className="space-y-4">
                {trackingEvents.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={handleCancel}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
