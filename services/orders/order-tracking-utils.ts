// order-tracking-utils.ts | services/orders/
// Client-safe: no server imports, pure functions + types only

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

export function getStatusLabel(status: TrackingEventStatus | string): string {
  const labels: Record<string, string> = {
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

export function getStatusStep(status: TrackingEventStatus | string): number {
  const steps: Record<string, number> = {
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
