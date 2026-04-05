# CloudBasket D62-D66 Generator
# Run: powershell -ExecutionPolicy Bypass -File ".\create-d62-d66.ps1"
# CWD: F:\cloudbasket

Set-Location F:\cloudbasket

New-Item -ItemType Directory -Force -Path "src\services"                | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\(dashboard)\catalog" | Out-Null
New-Item -ItemType Directory -Force -Path "src\app\(dashboard)\media"   | Out-Null

# ── D62 ──────────────────────────────────────────────────────────────
Set-Content -Path "src\services\product-importer.ts" -Encoding UTF8 -Value @'
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

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
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

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
'@

# ── D63 ──────────────────────────────────────────────────────────────
Set-Content -Path "src\services\bulk-editor.ts" -Encoding UTF8 -Value @'
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

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
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

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
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

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
'@

# ── D64 ──────────────────────────────────────────────────────────────
Set-Content -Path "src\app\(dashboard)\catalog\page.tsx" -Encoding UTF8 -Value @'
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  is_active: boolean;
}

async function getProducts(search: string, category: string): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from('products')
    .select('id,name,sku,price,category,brand,stock,is_active')
    .order('created_at', { ascending: false })
    .limit(50);

  if (search) query = query.ilike('name', `%${search}%`);
  if (category) query = query.eq('category', category);

  const { data } = await query;
  return (data as Product[]) ?? [];
}

async function getCategories(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase.from('products').select('category');
  const cats = [...new Set((data ?? []).map((r: { category: string }) => r.category))];
  return cats.filter(Boolean).sort();
}

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { search = '', category = '' } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(search, category),
    getCategories(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <Link
          href="/catalog/import"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Import Products
        </Link>
      </div>

      <form method="GET" className="flex gap-3 flex-wrap">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search products..."
          className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          name="category"
          defaultValue={category}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700"
        >
          Filter
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 text-gray-500">{p.brand}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {'\u20B9'}{p.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/catalog/${p.id}`} className="text-indigo-600 hover:underline text-xs">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400">{products.length} product(s) shown</p>
    </div>
  );
}
'@

# ── D65 ──────────────────────────────────────────────────────────────
Set-Content -Path "src\services\media-manager.ts" -Encoding UTF8 -Value @'
import { createServerSupabaseClient } from '@/lib/supabase/server';

const BUCKET = 'cloudbasket-media';

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  mime_type: string;
}

export async function listMediaFiles(folder: string = ''): Promise<MediaFile[] | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error || !data) return null;

  return data
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      return {
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
        size: f.metadata?.size ?? 0,
        created_at: f.created_at ?? '',
        mime_type: f.metadata?.mimetype ?? 'application/octet-stream',
      };
    });
}

export async function uploadMediaFile(file: File, folder: string = 'general'): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) return null;

  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}

export async function deleteMediaFile(path: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return !error;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
'@

# ── D66 ──────────────────────────────────────────────────────────────
Set-Content -Path "src\app\(dashboard)\media\page.tsx" -Encoding UTF8 -Value @'
import { listMediaFiles, formatFileSize } from '@/services/media-manager';
import Image from 'next/image';

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);

function isImage(name: string): boolean {
  return IMAGE_EXTS.has(name.split('.').pop()?.toLowerCase() ?? '');
}

interface PageProps {
  searchParams: Promise<{ folder?: string }>;
}

export default async function MediaPage({ searchParams }: PageProps) {
  const { folder = '' } = await searchParams;
  const files = await listMediaFiles(folder);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          {folder && (
            <p className="text-sm text-gray-500 mt-1">
              Folder: <span className="font-mono">{folder}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {folder && (
            <a
              href="/media"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Back
            </a>
          )}
          <a
            href="/media/upload"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Upload Files
          </a>
        </div>
      </div>

      {!files ? (
        <p className="text-red-500 text-sm">Failed to load media files.</p>
      ) : files.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 text-center">
          <p className="text-gray-400 text-sm">No files in this folder.</p>
          <a href="/media/upload" className="mt-3 inline-block text-indigo-600 text-sm hover:underline">
            Upload your first file
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                {isImage(file.name) ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <span className="text-sm text-gray-400">FILE</span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.size)}</p>
                <div className="flex gap-2 mt-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">{files?.length ?? 0} file(s)</p>
    </div>
  );
}
'@

Write-Host "D62-D66 created:" -ForegroundColor Green
Write-Host "  src/services/product-importer.ts"
Write-Host "  src/services/bulk-editor.ts"
Write-Host "  src/app/(dashboard)/catalog/page.tsx"
Write-Host "  src/services/media-manager.ts"
Write-Host "  src/app/(dashboard)/media/page.tsx"
Write-Host "Run: pnpm build" -ForegroundColor Cyan
