// F22: Advanced Search with Typesense
export type TypesenseSearchParams = { q: string; query_by?: string; filter_by?: string; sort_by?: string; per_page?: number; page?: number }
export type TypesenseHit = { document: Record<string, any>; highlights: any[]; text_match: number }
export type TypesenseResult = { hits: TypesenseHit[]; found: number; page: number; request_params: any }

function isConfigured(): boolean { return !!(process.env.TYPESENSE_HOST && process.env.TYPESENSE_API_KEY) }

export async function typesenseSearch(params: TypesenseSearchParams): Promise<TypesenseResult | null> {
  if (!isConfigured()) return null
  try {
    const qs = new URLSearchParams({ q: params.q, query_by: params.query_by || 'name,brand,category', per_page: String(params.per_page || 20), page: String(params.page || 1), ...(params.filter_by ? { filter_by: params.filter_by } : {}), ...(params.sort_by ? { sort_by: params.sort_by } : {}) })
    const r = await fetch(`https://${process.env.TYPESENSE_HOST}/collections/products/documents/search?${qs}`, { headers: { 'X-TYPESENSE-API-KEY': process.env.TYPESENSE_API_KEY! } })
    return r.ok ? await r.json() : null
  } catch { return null }
}

export async function indexProductsToTypesense(products: any[]): Promise<{ success: number; errors: number }> {
  if (!isConfigured()) return { success: 0, errors: products.length }
  let success = 0; let errors = 0
  const chunks = []
  for (let i = 0; i < products.length; i += 50) chunks.push(products.slice(i, i + 50))
  for (const chunk of chunks) {
    try {
      const body = chunk.map(p => JSON.stringify({ id: String(p.id), name: p.name || p.title || '', brand: p.brand || '', category: p.category || '', price: p.price || 0, discount: p.discount || 0, platform: p.platform || 'Amazon', in_stock: p.inStock !== false })).join('\n')
      const r = await fetch(`https://${process.env.TYPESENSE_HOST}/collections/products/documents/import?action=upsert`, { method: 'POST', headers: { 'X-TYPESENSE-API-KEY': process.env.TYPESENSE_API_KEY!, 'Content-Type': 'text/plain' }, body })
      if (r.ok) success += chunk.length; else errors += chunk.length
    } catch { errors += chunk.length }
  }
  return { success, errors }
}