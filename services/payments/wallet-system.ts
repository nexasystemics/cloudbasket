// D55 — wallet-system.ts | services/payments/
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/env';

export type WalletTransactionType =
  | 'credit'
  | 'debit'
  | 'refund'
  | 'cashback'
  | 'bonus'
  | 'withdrawal';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  amount: number;
  balance: number;
  description: string;
  referenceId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface WalletBalance {
  userId: string;
  balance: number;
  lockedBalance: number;
  availableBalance: number;
  updatedAt: string;
}

export interface CreditWalletInput {
  userId: string;
  amount: number;
  description: string;
  referenceId?: string;
  type: WalletTransactionType;
}

export interface DebitWalletInput {
  userId: string;
  amount: number;
  description: string;
  referenceId?: string;
}

export async function getWalletBalance(userId: string): Promise<WalletBalance | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[wallet-system] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return await initializeWallet(userId);
      }
      console.warn('[wallet-system] getWalletBalance error:', error.message);
      return null;
    }

    return {
      userId: data.user_id,
      balance: data.balance,
      lockedBalance: data.locked_balance,
      availableBalance: data.balance - data.locked_balance,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn('[wallet-system] getWalletBalance exception:', err);
    return null;
  }
}

async function initializeWallet(userId: string): Promise<WalletBalance | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[wallet-system] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('wallets')
      .insert({ user_id: userId, balance: 0, locked_balance: 0 })
      .select()
      .single();

    if (error) {
      console.warn('[wallet-system] initializeWallet error:', error.message);
      return null;
    }
    return {
      userId: data.user_id,
      balance: data.balance,
      lockedBalance: data.locked_balance,
      availableBalance: 0,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn('[wallet-system] initializeWallet exception:', err);
    return null;
  }
}

export async function creditWallet(input: CreditWalletInput): Promise<WalletTransaction | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[wallet-system] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();

    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', input.userId)
      .single();

    if (walletError) {
      await initializeWallet(input.userId);
    }

    const currentBalance = wallet?.balance ?? 0;
    const newBalance = currentBalance + input.amount;

    const { error: updateError } = await supabase
      .from('wallets')
      .upsert({
        user_id: input.userId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.warn('[wallet-system] creditWallet update error:', updateError.message);
      return null;
    }

    const { data: txn, error: txnError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: input.userId,
        type: input.type,
        amount: input.amount,
        balance: newBalance,
        description: input.description,
        reference_id: input.referenceId ?? null,
        status: 'completed',
      })
      .select()
      .single();

    if (txnError) {
      console.warn('[wallet-system] creditWallet txn error:', txnError.message);
      return null;
    }
    return mapTxnRow(txn);
  } catch (err) {
    console.warn('[wallet-system] creditWallet exception:', err);
    return null;
  }
}

export async function debitWallet(input: DebitWalletInput): Promise<WalletTransaction | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[wallet-system] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();

    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance, locked_balance')
      .eq('user_id', input.userId)
      .single();

    if (walletError || !wallet) {
      console.warn('[wallet-system] debitWallet: wallet not found');
      return null;
    }

    const available = wallet.balance - wallet.locked_balance;
    if (available < input.amount) {
      console.warn('[wallet-system] debitWallet: insufficient balance');
      return null;
    }

    const newBalance = wallet.balance - input.amount;

    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', input.userId);

    if (updateError) {
      console.warn('[wallet-system] debitWallet update error:', updateError.message);
      return null;
    }

    const { data: txn, error: txnError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: input.userId,
        type: 'debit',
        amount: input.amount,
        balance: newBalance,
        description: input.description,
        reference_id: input.referenceId ?? null,
        status: 'completed',
      })
      .select()
      .single();

    if (txnError) {
      console.warn('[wallet-system] debitWallet txn error:', txnError.message);
      return null;
    }
    return mapTxnRow(txn);
  } catch (err) {
    console.warn('[wallet-system] debitWallet exception:', err);
    return null;
  }
}

export async function getWalletTransactions(
  userId: string,
  page = 1,
  limit = 20
): Promise<{ transactions: WalletTransaction[]; total: number }> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[wallet-system] Supabase not configured');
      return { transactions: [], total: 0 };
    }
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('wallet_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      console.warn('[wallet-system] getWalletTransactions error:', error.message);
      return { transactions: [], total: 0 };
    }
    return {
      transactions: (data ?? []).map(mapTxnRow),
      total: count ?? 0,
    };
  } catch (err) {
    console.warn('[wallet-system] getWalletTransactions exception:', err);
    return { transactions: [], total: 0 };
  }
}

export async function checkSufficientBalance(
  userId: string,
  amount: number
): Promise<boolean> {
  try {
    const wallet = await getWalletBalance(userId);
    if (!wallet) return false;
    return wallet.availableBalance >= amount;
  } catch (err) {
    console.warn('[wallet-system] checkSufficientBalance exception:', err);
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTxnRow(row: Record<string, any>): WalletTransaction {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: row.amount,
    balance: row.balance,
    description: row.description,
    referenceId: row.reference_id ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}
