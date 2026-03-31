import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const hmac = request.headers.get('x-shopify-hmac-sha256')
    if (!env.SHOPIFY_WEBHOOK_SECRET || !hmac) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const expected = crypto.createHmac('sha256', env.SHOPIFY_WEBHOOK_SECRET).update(body, 'utf8').digest('base64')
    if (expected !== hmac) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    const data = JSON.parse(body)
    console.info('[Shopify Webhook] topic:', request.headers.get('x-shopify-topic'), 'order:', data?.id)
    return NextResponse.json({ok:true})
  } catch { return NextResponse.json({ok:true}) }
}
