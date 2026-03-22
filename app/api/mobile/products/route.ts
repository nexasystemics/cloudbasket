// E42: Mobile App API Endpoints (React Native ready)
import { NextRequest, NextResponse } from 'next/server'
import { getDailyDeals } from '@/lib/deals-engine'
import { searchProducts } from '@/lib/search'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 20)
  const sort = searchParams.get('sort') as any || 'relevance'

  const results = q || category
    ? searchProducts(q, { categories: category ? [category] : undefined, sortBy: sort })
    : getDailyDeals(limit).map(d => ({ id: d.id, name: d.title, price: d.dealPrice, originalPrice: d.originalPrice, discount: d.discountPercent, image: d.imageUrl, platform: d.platform, brand: d.brand, category: d.category }))

  const paginated = results.slice((page - 1) * limit, page * limit)
  return NextResponse.json({ data: paginated, total: results.length, page, limit, hasMore: page * limit < results.length }, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } })
}