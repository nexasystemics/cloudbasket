import { getSupabase } from '@/lib/supabase/get-client';

export interface ImportRow {
  name: string;
  sku: string;
  price: number;
  category: string;
  brand: string;
  description?: string;
  stock?: number;
  image_url?: string;
}

export interface ImportResult {
  inserted: number;
  updated: number;
  failed: number;
  errors: string[];
}

function parseCSV(csv: string): ImportRow[] {
  const [headerLine, ...lines] = csv.trim().split('\n');
  const headers = headerLine.split(',').map((h) => h.trim());
  return lines
    .filter((l) => l.trim())
    .map((line) => {
      const vals = line.split(',').map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = vals[i] ?? ''));
      return {
        name: row.name,
        sku: row.sku,
        price: parseFloat(row.price),
        category: row.category,
        brand: row.brand,
        description: row.description || undefined,
        stock: row.stock ? parseInt(row.stock) : undefined,
        image_url: row.image_url || undefined,
      } as ImportRow;
    });
}

export async function importProductsFromCSV(csvText: string): Promise<ImportResult | null> {
  const supabase = await getSupabase();

  const rows = parseCSV(csvText);
  const result: ImportResult = { inserted: 0, updated: 0, failed: 0, errors: [] };

  for (const row of rows) {
    if (!row.sku || !row.name || isNaN(row.price)) {
      result.failed++;
      result.errors.push(`Invalid row - SKU: ${row.sku ?? 'missing'}`);
      continue;
    }

    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('sku', row.sku)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('products')
        .update({ ...row, updated_at: new Date().toISOString() })
        .eq('sku', row.sku);
      if (error) { result.failed++; result.errors.push(error.message); } else { result.updated++; }
    } else {
      const { error } = await supabase.from('products').insert(row);
      if (error) { result.failed++; result.errors.push(error.message); } else { result.inserted++; }
    }
  }

  return result;
}

export async function importProductsFromJSON(products: ImportRow[]): Promise<ImportResult | null> {
  const supabase = await getSupabase();

  const result: ImportResult = { inserted: 0, updated: 0, failed: 0, errors: [] };

  const { error, count } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'sku', count: 'exact' });

  if (error) {
    result.failed = products.length;
    result.errors.push(error.message);
  } else {
    result.inserted = count ?? products.length;
  }

  return result;
}
