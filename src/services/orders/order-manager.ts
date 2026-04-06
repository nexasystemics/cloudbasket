import { getSupabase } from '@/lib/supabase/get-client';

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
}

export async function createOrder(
  userId: string,
  vendorId: string,
  items: OrderItem[],
  totalAmount: number
): Promise<Order> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        vendor_id: vendorId,
        items,
        total_amount: totalAmount,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return mapOrderFromDb(data);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('orders')
    .select()
    .eq('id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  return data ? mapOrderFromDb(data) : null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('orders')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user orders: ${error.message}`);
  }

  return (data || []).map(mapOrderFromDb);
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<Order> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return mapOrderFromDb(data);
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to cancel order: ${error.message}`);
  }

  return mapOrderFromDb(data);
}

function mapOrderFromDb(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id,
    vendorId: dbOrder.vendor_id,
    items: dbOrder.items || [],
    totalAmount: dbOrder.total_amount,
    status: dbOrder.status,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
  };
}
