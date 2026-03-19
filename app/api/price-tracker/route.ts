// app/api/price-tracker/route.ts
// Purpose: API endpoint for tracking and retrieving price history.
// A20: Integration with PriceTracker service.

import { NextRequest, NextResponse } from 'next/server'
import { priceTracker } from '@/services/price-engine/tracker'
import { supabase } from '@/lib/supabase'

/**
 * GET: Retrieve price history for a product.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  }

  const history = await priceTracker.getPriceHistory(productId, 30)
  return NextResponse.json(history)
}

/**
 * POST: Track a new price point.
 * Auth: Internal API Key or Valid Session.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Check for Internal API Key
    const authHeader = req.headers.get('Authorization')
    const internalKey = process.env.INTERNAL_API_KEY
    let isAuthorized = internalKey && authHeader === `Bearer ${internalKey}`

    // 2. Fallback to Supabase Session
    if (!isAuthorized) {
      const { data: { session } } = await supabase!.auth.getSession()
      if (session) isAuthorized = true
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, price, platform } = await req.json()

    if (!productId || typeof price !== 'number' || !platform) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await priceTracker.trackProduct(productId, price, platform)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API Error in price-tracker:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

