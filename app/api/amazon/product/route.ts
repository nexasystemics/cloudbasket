import { NextRequest, NextResponse } from 'next/server'
import { amazonAPI } from '@/services/apis/amazon-pa-api'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const asin = request.nextUrl.searchParams.get('asin')
  if (!asin) return NextResponse.json({ error: 'Missing asin param' }, { status: 400 })
  try {
    const product = await amazonAPI.getProduct(asin)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}