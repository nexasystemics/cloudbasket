import { NextRequest, NextResponse } from 'next/server'
import { amazonAPI } from '@/services/apis/amazon-pa-api'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const q = request.nextUrl.searchParams.get('q') || ''
  const category = request.nextUrl.searchParams.get('category') || 'All'
  if (!q) return NextResponse.json({ error: 'Missing query param q' }, { status: 400 })
  try {
    const products = await amazonAPI.searchProducts(q, category)
    return NextResponse.json({ products, count: products.length })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}