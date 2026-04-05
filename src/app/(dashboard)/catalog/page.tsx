import { getSupabase } from '@/lib/supabase/get-client';
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
  const supabase = await getSupabase();

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
  const supabase = await getSupabase();
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
