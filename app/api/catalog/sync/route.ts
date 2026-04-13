import { NextRequest, NextResponse } from 'next/server'
import { catalogSync } from '@/services/catalog/sync-engine'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(r: NextRequest) {
  const ip = getRequestIp(r)
  const limit = await rateLimit(ip, 5, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const apiKey = r.headers.get('x-internal-api-key')
  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try { const { source } = await r.json(); if (!['amazon','flipkart','cj'].includes(source)) return NextResponse.json({ error: 'Invalid source' }, { status: 400 }); return NextResponse.json(await catalogSync.syncProductPrices(source as any)) } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
