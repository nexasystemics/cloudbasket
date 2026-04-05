// D57 — order-tracking.ts | services/orders/
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/env';

export type TrackingEventStatus =
  | 'order_placed'
  | 'payment_confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'returned'
  | 'cancelled'
  | 'refunded';

export interface TrackingEvent {
  id: string;
  orderId: string;
  status: TrackingEventStatus;
  location?: string;
  description: string;
  timestamp: string;
}

export interface TrackingInfo {
  orderId: string;
  orderNumber: string;
  currentStatus: TrackingEventStatus;
  trackingId?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
}

export interface AddTrackingEventInput {
  orderId: string;
  status: TrackingEventStatus;
  description: string;
  location?: string;
  trackingId?: string;
  trackingUrl?: string;
  carrier?: string;
}

export async function getTrackingInfo(orderId: string): Promise<TrackingInfo | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-tracking] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, status, tracking_id, tracking_url, expected_delivery')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.warn('[order-tracking] getTrackingInfo order error:', orderError?.message);
      return null;
    }

    const { data: events, error: eventsError } = await supabase
      .from('order_tracking_events')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.warn('[order-tracking] getTrackingInfo events error:', eventsError.message);
    }

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      currentStatus: order.status as TrackingEventStatus,
      trackingId: order.tracking_id ?? undefined,
      trackingUrl: order.tracking_url ?? undefined,
      estimatedDelivery: order.expected_delivery ?? undefined,
      events: (events ?? []).map(mapEventRow),
    };
  } catch (err) {
    console.warn('[order-tracking] getTrackingInfo exception:', err);
    return null;
  }
}

export async function addTrackingEvent(
  input: AddTrackingEventInput
): Promise<TrackingEvent | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-tracking] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('order_tracking_events')
      .insert({
        order_id: input.orderId,
        status: input.status,
        description: input.description,
        location: input.location ?? null,
      })
      .select()
      .single();

    if (error) {
      console.warn('[order-tracking] addTrackingEvent error:', error.message);
      return null;
    }

    const updatePayload: Record<string, string> = {
      status: input.status,
      updated_at: new Date().toISOString(),
    };
    if (input.trackingId) updatePayload['tracking_id'] = input.trackingId;
    if (input.trackingUrl) updatePayload['tracking_url'] = input.trackingUrl;

    await supabase.from('orders').update(updatePayload).eq('id', input.orderId);

    return mapEventRow(data);
  } catch (err) {
    console.warn('[order-tracking] addTrackingEvent exception:', err);
    return null;
  }
}

export async function getTrackingByNumber(orderNumber: string): Promise<TrackingInfo | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-tracking] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single();

    if (error || !data) {
      console.warn('[order-tracking] getTrackingByNumber error:', error?.message);
      return null;
    }
    return getTrackingInfo(data.id);
  } catch (err) {
    console.warn('[order-tracking] getTrackingByNumber exception:', err);
    return null;
  }
}

export function getStatusLabel(status: TrackingEventStatus): string {
  const labels: Record<TrackingEventStatus, string> = {
    order_placed: 'Order Placed',
    payment_confirmed: 'Payment Confirmed',
    processing: 'Processing',
    packed: 'Packed',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    failed_delivery: 'Delivery Failed',
    returned: 'Returned',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return labels[status] ?? status;
}

export function getStatusStep(status: TrackingEventStatus): number {
  const steps: Record<TrackingEventStatus, number> = {
    order_placed: 1,
    payment_confirmed: 2,
    processing: 3,
    packed: 4,
    shipped: 5,
    out_for_delivery: 6,
    delivered: 7,
    failed_delivery: 6,
    returned: 4,
    cancelled: 0,
    refunded: 0,
  };
  return steps[status] ?? 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEventRow(row: Record<string, any>): TrackingEvent {
  return {
    id: row.id,
    orderId: row.order_id,
    status: row.status,
    location: row.location ?? undefined,
    description: row.description,
    timestamp: row.created_at,
  };
}

export type { TrackingEventStatus } from '@/services/orders/order-tracking-utils';
