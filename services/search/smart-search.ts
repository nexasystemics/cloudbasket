// services/search/smart-search.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SearchFilters {
  category?: string
  brand?: string[]
  min_price?: number
  max_price?: number
  min_rating?: number
  in_stock_only?: boolean
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity'
  page?: number
  limit?: number
}

export interface SearchResult {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  price: number
  original_price: number
  discount_percent: number
  rating: number
  review_count: number
  image_url: string | null
  in_stock: boolean
  relevance_score: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  total_pages: number
  query: string
  filters_applied: SearchFilters
  suggestions: string[]
  took_ms: number
}

export interface SearchSuggestion {
  text: string
  type: 'product' | 'category' | 'brand' | 'query'
  count?: number
}

export interface TrendingSearch {
  query: string
  count: number
  category: string | null
}

export interface SearchAnalyticsEntry {
  query: string
  results_count: number
  clicked_product_id: string | null
  user_id: string | null
  session_id: string
  filters: SearchFilters
  searched_at: string
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  ) {
    console.warn('[SmartSearch] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getAdminClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[SmartSearch] Admin Supabase not configured')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sanitizeQuery(raw: string): string {
  return raw
    .trim()
    .replace(/[^\w\s\-\.]/g, '')
    .substring(0, 100)
}

function buildSortOrder(sort: SearchFilters['sort']): { column: string; ascending: boolean } {
  switch (sort) {
    case 'price_asc':   return { column: 'price', ascending: true }
    case 'price_desc':  return { column: 'price', ascending: false }
    case 'rating':      return { column: 'rating', ascending: false }
    case 'newest':      return { column: 'created_at', ascending: false }
    case 'popularity':  return { column: 'review_count', ascending: false }
    case 'relevance':
    default:            return { column: 'relevance_score', ascending: false }
  }
}

// ─── Full Text Search ────────────────────────────────────────────────────────

/**
 * Performs full-text search across products with optional filters.
 * Uses Postgres full-text search via Supabase's textSearch method.
 * Returns paginated results with suggestions and timing metrics.
 */
export async function searchProducts(
  rawQuery: string,
  filters: SearchFilters = {}
): Promise<SearchResponse> {
  const start = Date.now()
  const query = sanitizeQuery(rawQuery)
  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.min(48, Math.max(1, filters.limit ?? 24))
  const offset = (page - 1) * limit

  const empty: SearchResponse = {
    results: [],
    total: 0,
    page,
    total_pages: 0,
    query,
    filters_applied: filters,
    suggestions: [],
    took_ms: Date.now() - start,
  }

  if (!query) return empty

  const sb = getClient()
  if (!sb) return empty

  try {
    const sort = buildSortOrder(filters.sort)

    let dbQuery = sb
      .from('products_search_view')
      .select('*', { count: 'exact' })
      .textSearch('search_vector', query, { type: 'websearch', config: 'english' })

    if (filters.category) dbQuery = dbQuery.eq('category', filters.category)
    if (filters.brand?.length) dbQuery = dbQuery.in('brand', filters.brand)
    if (filters.min_price !== undefined) dbQuery = dbQuery.gte('price', filters.min_price)
    if (filters.max_price !== undefined) dbQuery = dbQuery.lte('price', filters.max_price)
    if (filters.min_rating !== undefined) dbQuery = dbQuery.gte('rating', filters.min_rating)
    if (filters.in_stock_only) dbQuery = dbQuery.eq('in_stock', true)

    dbQuery = dbQuery
      .order(sort.column, { ascending: sort.ascending })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await dbQuery
    if (error) throw error

    const total = count ?? 0
    const results = (data as SearchResult[]) ?? []
    const suggestions = await getAutocompleteSuggestions(query, 3)

    return {
      results,
      total,
      page,
      total_pages: Math.ceil(total / limit),
      query,
      filters_applied: filters,
      suggestions: suggestions.map((s) => s.text),
      took_ms: Date.now() - start,
    }
  } catch (err) {
    console.warn('[SmartSearch] searchProducts error:', err)
    return { ...empty, took_ms: Date.now() - start }
  }
}

// ─── Autocomplete / Suggestions ──────────────────────────────────────────────

/**
 * Returns autocomplete suggestions for a partial query.
 * Matches against product names, brands, and categories.
 * Limited to 8 results maximum for speed.
 */
export async function getAutocompleteSuggestions(
  partial: string,
  limit = 8
): Promise<SearchSuggestion[]> {
  const query = sanitizeQuery(partial)
  if (query.length < 2) return []

  const sb = getClient()
  if (!sb) return []

  try {
    const { data, error } = await sb
      .from('search_suggestions_view')
      .select('text, type, count')
      .ilike('text', `${query}%`)
      .order('count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as SearchSuggestion[]) ?? []
  } catch (err) {
    console.warn('[SmartSearch] getAutocompleteSuggestions error:', err)
    return []
  }
}

// ─── Trending Searches ───────────────────────────────────────────────────────

/**
 * Returns the most searched queries in the last N days.
 * Used for trending search chips on homepage and search page.
 */
export async function getTrendingSearches(
  limit = 10,
  days = 7
): Promise<TrendingSearch[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const since = new Date(Date.now() - days * 86400000).toISOString()

    const { data, error } = await sb
      .from('search_analytics')
      .select('query, category:filters->category')
      .gte('searched_at', since)
      .order('count', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as TrendingSearch[]) ?? []
  } catch (err) {
    console.warn('[SmartSearch] getTrendingSearches error:', err)
    return []
  }
}

// ─── Log Search Event ────────────────────────────────────────────────────────

/**
 * Logs a search event to the analytics table for trend analysis and ML.
 * Fails silently — never blocks the user experience.
 */
export async function logSearchEvent(
  entry: Omit<SearchAnalyticsEntry, 'searched_at'>
): Promise<void> {
  const sb = getAdminClient()
  if (!sb) return

  try {
    await sb.from('search_analytics').insert({
      ...entry,
      searched_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('[SmartSearch] logSearchEvent error:', err)
  }
}

// ─── Log Click-Through ───────────────────────────────────────────────────────

/**
 * Records which product a user clicked after a search.
 * Used to improve relevance ranking over time.
 */
export async function logSearchClick(
  sessionId: string,
  query: string,
  productId: string
): Promise<void> {
  const sb = getAdminClient()
  if (!sb) return

  try {
    await sb
      .from('search_analytics')
      .update({ clicked_product_id: productId })
      .eq('session_id', sessionId)
      .eq('query', query)
      .order('searched_at', { ascending: false })
      .limit(1)
  } catch (err) {
    console.warn('[SmartSearch] logSearchClick error:', err)
  }
}

// ─── Search Analytics Summary ─────────────────────────────────────────────────

/**
 * Returns aggregate search metrics for the admin analytics dashboard.
 */
export async function getSearchMetrics(days = 30): Promise<{
  total_searches: number
  unique_queries: number
  zero_result_rate: number
  avg_results_per_query: number
  click_through_rate: number
  top_queries: TrendingSearch[]
}> {
  const defaults = {
    total_searches: 0,
    unique_queries: 0,
    zero_result_rate: 0,
    avg_results_per_query: 0,
    click_through_rate: 0,
    top_queries: [],
  }

  const sb = getAdminClient()
  if (!sb) return defaults

  try {
    const since = new Date(Date.now() - days * 86400000).toISOString()

    const [metricsRes, topRes] = await Promise.all([
      sb.from('search_metrics_view').select('*').gte('period_start', since).single(),
      getTrendingSearches(10, days),
    ])

    if (metricsRes.error) throw metricsRes.error

    return {
      ...(metricsRes.data ?? defaults),
      top_queries: topRes,
    }
  } catch (err) {
    console.warn('[SmartSearch] getSearchMetrics error:', err)
    return defaults
  }
}
