import { NextRequest, NextResponse } from 'next/server'
import { priceAlertSender } from '@/services/email/price-alert-sender'
import { env } from '@/lib/env'
export async function POST(r: NextRequest) {
  const apiKey = r.headers.get('x-internal-api-key'); if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try { const { email, productName, productImage, newPrice, oldPrice, affiliateUrl, platform } = await r.json(); if (!email || !productName) return NextResponse.json({ error: 'Missing fields' }, { status: 400 }); return NextResponse.json(await priceAlertSender.sendPriceDropAlert(email, productName, productImage || '', newPrice, oldPrice, affiliateUrl, platform)) } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}