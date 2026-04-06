import { getSupabase } from '@/lib/supabase/get-client';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  createdAt: string;
}

export async function getWalletBalance(userId: string): Promise<number> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch wallet balance: ${error.message}`);
  }

  return data?.balance || 0;
}

export async function getWalletTransactions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<WalletTransaction[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('wallet_user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return (data || []).map(mapTransactionFromDb);
}

export async function creditWallet(
  userId: string,
  amount: number,
  description: string,
  reference?: string
): Promise<WalletTransaction> {
  const supabase = await getSupabase();
  
  // Get or create wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', userId)
    .single();

  const walletId = wallet?.id;
  if (!walletId) {
    throw new Error('Wallet not found for user');
  }

  // Update balance
  await supabase
    .from('wallets')
    .update({
      balance: supabase.rpc('increment_balance', { user_id: userId, amount }),
    })
    .eq('user_id', userId);

  // Record transaction
  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert([
      {
        wallet_id: walletId,
        wallet_user_id: userId,
        type: 'credit',
        amount,
        description,
        reference: reference || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to credit wallet: ${error.message}`);
  }

  return mapTransactionFromDb(data);
}

export async function debitWallet(
  userId: string,
  amount: number,
  description: string,
  reference?: string
): Promise<WalletTransaction> {
  const supabase = await getSupabase();
  
  const currentBalance = await getWalletBalance(userId);
  if (currentBalance < amount) {
    throw new Error('Insufficient wallet balance');
  }

  // Get wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', userId)
    .single();

  const walletId = wallet?.id;
  if (!walletId) {
    throw new Error('Wallet not found for user');
  }

  // Update balance
  await supabase
    .from('wallets')
    .update({
      balance: supabase.rpc('decrement_balance', { user_id: userId, amount }),
    })
    .eq('user_id', userId);

  // Record transaction
  const { data, error } = await supabase
    .from('wallet_transactions')
    .insert([
      {
        wallet_id: walletId,
        wallet_user_id: userId,
        type: 'debit',
        amount,
        description,
        reference: reference || null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to debit wallet: ${error.message}`);
  }

  return mapTransactionFromDb(data);
}

function mapTransactionFromDb(dbTransaction: any): WalletTransaction {
  return {
    id: dbTransaction.id,
    walletId: dbTransaction.wallet_id,
    type: dbTransaction.type,
    amount: dbTransaction.amount,
    description: dbTransaction.description,
    reference: dbTransaction.reference || undefined,
    createdAt: dbTransaction.created_at,
  };
}
