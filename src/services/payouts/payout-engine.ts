import { getSupabase } from '@/lib/supabase/get-client';

export interface Payout {
  id: string;
  vendorId: string;
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'check' | 'paypal' | 'stripe';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export async function createPayout(
  vendorId: string,
  amount: number,
  method: Payout['method'],
  reference?: string,
  notes?: string
): Promise<Payout> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('payouts')
    .insert([
      {
        vendor_id: vendorId,
        amount,
        currency: 'USD',
        method,
        status: 'pending',
        reference: reference || null,
        notes: notes || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payout: ${error.message}`);
  }

  return mapPayoutFromDb(data);
}

export async function getPayoutById(payoutId: string): Promise<Payout | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('payouts')
    .select()
    .eq('id', payoutId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch payout: ${error.message}`);
  }

  return data ? mapPayoutFromDb(data) : null;
}

export async function getVendorPayouts(
  vendorId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Payout[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('payouts')
    .select()
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch vendor payouts: ${error.message}`);
  }

  return (data || []).map(mapPayoutFromDb);
}

export async function updatePayoutStatus(
  payoutId: string,
  status: Payout['status']
): Promise<Payout> {
  const supabase = await getSupabase();
  
  const updateData: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payouts')
    .update(updateData)
    .eq('id', payoutId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payout status: ${error.message}`);
  }

  return mapPayoutFromDb(data);
}

export async function getPendingPayouts(limit: number = 100): Promise<Payout[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('payouts')
    .select()
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch pending payouts: ${error.message}`);
  }

  return (data || []).map(mapPayoutFromDb);
}

export async function getPayoutSummary(vendorId: string): Promise<{
  totalPending: number;
  totalProcessing: number;
  totalCompleted: number;
}> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('payouts')
    .select('status, amount')
    .eq('vendor_id', vendorId)
    .in('status', ['pending', 'processing', 'completed']);

  if (error) {
    throw new Error(`Failed to fetch payout summary: ${error.message}`);
  }

  const summary = {
    totalPending: 0,
    totalProcessing: 0,
    totalCompleted: 0,
  };

  (data || []).forEach((payout) => {
    if (payout.status === 'pending') {
      summary.totalPending += payout.amount;
    } else if (payout.status === 'processing') {
      summary.totalProcessing += payout.amount;
    } else if (payout.status === 'completed') {
      summary.totalCompleted += payout.amount;
    }
  });

  return summary;
}

function mapPayoutFromDb(dbPayout: any): Payout {
  return {
    id: dbPayout.id,
    vendorId: dbPayout.vendor_id,
    amount: dbPayout.amount,
    currency: dbPayout.currency,
    method: dbPayout.method,
    status: dbPayout.status,
    reference: dbPayout.reference || undefined,
    notes: dbPayout.notes || undefined,
    createdAt: dbPayout.created_at,
    updatedAt: dbPayout.updated_at,
    completedAt: dbPayout.completed_at || undefined,
  };
}
