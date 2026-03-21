import { NextRequest, NextResponse } from 'next/server'
import { priceTracker } from '@/services/price-engine/tracker'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { productId, price, platform } = await request.json()
    if (!productId || typeof price !== 'number') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    await priceTracker.trackProduct(productId, price, platform || 'manual')
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  const days = parseInt(request.nextUrl.searchParams.get('days') || '30')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const history = await priceTracker.getPriceHistory(productId, days)
  const drop = await priceTracker.getPriceDrop(productId)
  return NextResponse.json({ history, priceDrop: drop })
}