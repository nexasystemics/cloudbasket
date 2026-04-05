// D52 — order-manager.ts | services/orders/
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/env';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  taxAmount: number;
  walletAmountUsed: number;
  totalAmount: number;
  paymentId?: string;
  paymentMethod?: string;
  trackingId?: string;
  trackingUrl?: string;
  notes?: string;
  expectedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  taxAmount: number;
  walletAmountUsed: number;
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
}

function generateOrderNumber(): string {
  const prefix = 'CB';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const orderNumber = generateOrderNumber();
    const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: input.userId,
        order_number: orderNumber,
        status: 'pending',
        items: input.items,
        shipping_address: input.shippingAddress,
        subtotal: input.subtotal,
        shipping_charge: input.shippingCharge,
        discount_amount: input.discountAmount,
        tax_amount: input.taxAmount,
        wallet_amount_used: input.walletAmountUsed,
        total_amount: input.totalAmount,
        payment_method: input.paymentMethod,
        notes: input.notes ?? null,
        expected_delivery: expectedDelivery,
      })
      .select()
      .single();

    if (error) {
      console.warn('[order-manager] createOrder error:', error.message);
      return null;
    }
    return mapRow(data);
  } catch (err) {
    console.warn('[order-manager] createOrder exception:', err);
    return null;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.warn('[order-manager] getOrderById error:', error.message);
      return null;
    }
    return mapRow(data);
  } catch (err) {
    console.warn('[order-manager] getOrderById exception:', err);
    return null;
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.warn('[order-manager] getOrderByNumber error:', error.message);
      return null;
    }
    return mapRow(data);
  } catch (err) {
    console.warn('[order-manager] getOrderByNumber exception:', err);
    return null;
  }
}

export async function getUserOrders(
  userId: string,
  page = 1,
  limit = 10
): Promise<{ orders: Order[]; total: number }> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return { orders: [], total: 0 };
    }
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      console.warn('[order-manager] getUserOrders error:', error.message);
      return { orders: [], total: 0 };
    }
    return { orders: (data ?? []).map(mapRow), total: count ?? 0 };
  } catch (err) {
    console.warn('[order-manager] getUserOrders exception:', err);
    return { orders: [], total: 0 };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  extra?: { trackingId?: string; trackingUrl?: string; paymentId?: string }
): Promise<boolean> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return false;
    }
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        ...(extra?.trackingId && { tracking_id: extra.trackingId }),
        ...(extra?.trackingUrl && { tracking_url: extra.trackingUrl }),
        ...(extra?.paymentId && { payment_id: extra.paymentId }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.warn('[order-manager] updateOrderStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[order-manager] updateOrderStatus exception:', err);
    return false;
  }
}

export async function cancelOrder(orderId: string, userId: string): Promise<boolean> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return false;
    }
    const supabase = await createServerSupabaseClient();

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status, user_id')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      console.warn('[order-manager] cancelOrder fetch error:', fetchError?.message);
      return false;
    }
    if (order.user_id !== userId) {
      console.warn('[order-manager] cancelOrder: unauthorized user');
      return false;
    }
    const cancellable: OrderStatus[] = ['pending', 'confirmed'];
    if (!cancellable.includes(order.status as OrderStatus)) {
      console.warn('[order-manager] cancelOrder: status not cancellable:', order.status);
      return false;
    }
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.warn('[order-manager] cancelOrder update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[order-manager] cancelOrder exception:', err);
    return false;
  }
}

export async function getAllOrders(
  page = 1,
  limit = 20,
  status?: OrderStatus
): Promise<{ orders: Order[]; total: number }> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[order-manager] Supabase not configured');
      return { orders: [], total: 0 };
    }
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) {
      console.warn('[order-manager] getAllOrders error:', error.message);
      return { orders: [], total: 0 };
    }
    return { orders: (data ?? []).map(mapRow), total: count ?? 0 };
  } catch (err) {
    console.warn('[order-manager] getAllOrders exception:', err);
    return { orders: [], total: 0 };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: Record<string, any>): Order {
  return {
    id: row.id,
    userId: row.user_id,
    orderNumber: row.order_number,
    status: row.status,
    items: row.items,
    shippingAddress: row.shipping_address,
    subtotal: row.subtotal,
    shippingCharge: row.shipping_charge,
    discountAmount: row.discount_amount,
    taxAmount: row.tax_amount,
    walletAmountUsed: row.wallet_amount_used,
    totalAmount: row.total_amount,
    paymentId: row.payment_id ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    trackingId: row.tracking_id ?? undefined,
    trackingUrl: row.tracking_url ?? undefined,
    notes: row.notes ?? undefined,
    expectedDelivery: row.expected_delivery ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
