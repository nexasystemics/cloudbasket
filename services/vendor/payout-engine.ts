// D60 — payout-engine.ts | services/vendor/
import Razorpay from 'razorpay';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/env';
import { env } from '@/lib/env';

export type PayoutStatus = 'pending' | 'processing' | 'processed' | 'failed' | 'reversed';
export type PayoutMode = 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';

export interface VendorBankDetails {
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
  bankName: string;
  upiId?: string;
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  amount: number;
  currency: string;
  mode: PayoutMode;
  status: PayoutStatus;
  razorpayPayoutId?: string;
  fundAccountId?: string;
  description: string;
  failureReason?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayoutInput {
  vendorId: string;
  amount: number;
  mode?: PayoutMode;
  description?: string;
}

export interface VendorEarning {
  vendorId: string;
  totalEarnings: number;
  pendingPayout: number;
  processedPayout: number;
  lastPayoutDate?: string;
}

function getRazorpayXClient(): Razorpay | null {
  try {
    if (!isConfigured('RAZORPAY_KEY_ID') || !isConfigured('RAZORPAY_KEY_SECRET')) {
      console.warn('[payout-engine] Razorpay keys not configured');
      return null;
    }
    return new Razorpay({
      key_id: env('RAZORPAY_KEY_ID'),
      key_secret: env('RAZORPAY_KEY_SECRET'),
    });
  } catch (err) {
    console.warn('[payout-engine] getRazorpayXClient exception:', err);
    return null;
  }
}

export async function getVendorEarnings(vendorId: string): Promise<VendorEarning | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[payout-engine] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('vendor_earnings')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();

    if (error) {
      console.warn('[payout-engine] getVendorEarnings error:', error.message);
      return null;
    }
    return {
      vendorId: data.vendor_id,
      totalEarnings: data.total_earnings,
      pendingPayout: data.pending_payout,
      processedPayout: data.processed_payout,
      lastPayoutDate: data.last_payout_date ?? undefined,
    };
  } catch (err) {
    console.warn('[payout-engine] getVendorEarnings exception:', err);
    return null;
  }
}

export async function createPayoutRequest(
  input: CreatePayoutInput
): Promise<PayoutRequest | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[payout-engine] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();

    const earnings = await getVendorEarnings(input.vendorId);
    if (!earnings || earnings.pendingPayout < input.amount) {
      console.warn('[payout-engine] createPayoutRequest: insufficient pending payout');
      return null;
    }

    const { data, error } = await supabase
      .from('payout_requests')
      .insert({
        vendor_id: input.vendorId,
        amount: input.amount,
        currency: 'INR',
        mode: input.mode ?? 'IMPS',
        status: 'pending',
        description: input.description ?? `Payout for vendor ${input.vendorId}`,
      })
      .select()
      .single();

    if (error) {
      console.warn('[payout-engine] createPayoutRequest insert error:', error.message);
      return null;
    }
    return mapPayoutRow(data);
  } catch (err) {
    console.warn('[payout-engine] createPayoutRequest exception:', err);
    return null;
  }
}

export async function processPayoutViaRazorpay(
  payoutRequestId: string,
  bankDetails: VendorBankDetails
): Promise<boolean> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[payout-engine] Supabase not configured');
      return false;
    }
    const rzp = getRazorpayXClient();
    if (!rzp) return false;

    const supabase = await createServerSupabaseClient();
    const { data: payout, error: fetchError } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('id', payoutRequestId)
      .single();

    if (fetchError || !payout) {
      console.warn('[payout-engine] processPayoutViaRazorpay fetch error:', fetchError?.message);
      return false;
    }

    await supabase
      .from('payout_requests')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', payoutRequestId);

    // Note: RazorpayX payout API — fund_account creation + payout initiation
    // This requires RazorpayX account. Using rzp instance as placeholder.
    const rzpPayout = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${env('RAZORPAY_KEY_ID')}:${env('RAZORPAY_KEY_SECRET')}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        account_number: env('RAZORPAY_ACCOUNT_NUMBER'),
        fund_account: {
          account_type: 'bank_account',
          bank_account: {
            name: bankDetails.accountHolderName,
            ifsc: bankDetails.ifsc,
            account_number: bankDetails.accountNumber,
          },
          contact: {
            name: bankDetails.accountHolderName,
            type: 'vendor',
          },
        },
        amount: payout.amount * 100,
        currency: 'INR',
        mode: payout.mode,
        purpose: 'payout',
        narration: payout.description,
      }),
    });

    if (!rzpPayout.ok) {
      const errData = await rzpPayout.json();
      console.warn('[payout-engine] RazorpayX payout error:', errData);
      await supabase
        .from('payout_requests')
        .update({
          status: 'failed',
          failure_reason: errData?.error?.description ?? 'RazorpayX error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payoutRequestId);
      return false;
    }

    const rzpData = await rzpPayout.json();
    await supabase
      .from('payout_requests')
      .update({
        status: 'processed',
        razorpay_payout_id: rzpData.id,
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payoutRequestId);

    await supabase.rpc('deduct_vendor_pending_payout', {
      p_vendor_id: payout.vendor_id,
      p_amount: payout.amount,
    });

    // rzp is initialized but RazorpayX uses direct fetch; suppress unused warning
    void rzp;
    return true;
  } catch (err) {
    console.warn('[payout-engine] processPayoutViaRazorpay exception:', err);
    return false;
  }
}

export async function getVendorPayouts(
  vendorId: string,
  page = 1,
  limit = 20
): Promise<{ payouts: PayoutRequest[]; total: number }> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[payout-engine] Supabase not configured');
      return { payouts: [], total: 0 };
    }
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('payout_requests')
      .select('*', { count: 'exact' })
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      console.warn('[payout-engine] getVendorPayouts error:', error.message);
      return { payouts: [], total: 0 };
    }
    return { payouts: (data ?? []).map(mapPayoutRow), total: count ?? 0 };
  } catch (err) {
    console.warn('[payout-engine] getVendorPayouts exception:', err);
    return { payouts: [], total: 0 };
  }
}

export async function updatePayoutStatus(
  payoutId: string,
  status: PayoutStatus,
  failureReason?: string
): Promise<boolean> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[payout-engine] Supabase not configured');
      return false;
    }
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('payout_requests')
      .update({
        status,
        ...(failureReason && { failure_reason: failureReason }),
        ...(status === 'processed' && { processed_at: new Date().toISOString() }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payoutId);

    if (error) {
      console.warn('[payout-engine] updatePayoutStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[payout-engine] updatePayoutStatus exception:', err);
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPayoutRow(row: Record<string, any>): PayoutRequest {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    amount: row.amount,
    currency: row.currency,
    mode: row.mode,
    status: row.status,
    razorpayPayoutId: row.razorpay_payout_id ?? undefined,
    fundAccountId: row.fund_account_id ?? undefined,
    description: row.description,
    failureReason: row.failure_reason ?? undefined,
    processedAt: row.processed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
