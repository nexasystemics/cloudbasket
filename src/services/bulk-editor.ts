import { getSupabase } from '@/lib/supabase/get-client';

export type BulkField = 'price' | 'stock' | 'category' | 'brand' | 'is_active';

export interface BulkUpdatePayload {
  ids: string[];
  field: BulkField;
  value: string | number | boolean;
}

export interface BulkResult {
  affected: number;
  errors: string[];
}

export async function bulkUpdateProducts(payload: BulkUpdatePayload): Promise<BulkResult | null> {
  const supabase = await getSupabase();

  const { ids, field, value } = payload;
  const result: BulkResult = { affected: 0, errors: [] };

  const { error, count } = await supabase
    .from('products')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .in('id', ids)
    .select('id', { count: 'exact', head: true });

  if (error) {
    result.errors.push(error.message);
  } else {
    result.affected = count ?? 0;
  }

  return result;
}

export async function bulkDeleteProducts(ids: string[]): Promise<BulkResult | null> {
  const supabase = await getSupabase();

  const result: BulkResult = { affected: 0, errors: [] };

  const { error, count } = await supabase
    .from('products')
    .delete({ count: 'exact' })
    .in('id', ids);

  if (error) {
    result.errors.push(error.message);
  } else {
    result.affected = count ?? 0;
  }

  return result;
}

export async function bulkToggleActive(ids: string[], active: boolean): Promise<BulkResult | null> {
  return bulkUpdateProducts({ ids, field: 'is_active', value: active });
}

export async function bulkSetCategory(ids: string[], category: string): Promise<BulkResult | null> {
  return bulkUpdateProducts({ ids, field: 'category', value: category });
}

export async function bulkAdjustPrice(ids: string[], adjustPercent: number): Promise<BulkResult | null> {
  const supabase = await getSupabase();

  const result: BulkResult = { affected: 0, errors: [] };
  const factor = 1 + adjustPercent / 100;

  const { data: products, error: fetchErr } = await supabase
    .from('products')
    .select('id, price')
    .in('id', ids);

  if (fetchErr || !products) {
    result.errors.push(fetchErr?.message ?? 'Fetch failed');
    return result;
  }

  for (const p of products) {
    const newPrice = parseFloat((p.price * factor).toFixed(2));
    const { error } = await supabase
      .from('products')
      .update({ price: newPrice, updated_at: new Date().toISOString() })
      .eq('id', p.id);
    if (error) { result.errors.push(error.message); } else { result.affected++; }
  }

  return result;
}
