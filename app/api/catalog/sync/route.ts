import { NextRequest, NextResponse } from 'next/server'
import { catalogSync } from '@/services/catalog/sync-engine'
import { env } from '@/lib/env'
export async function POST(r: NextRequest) {
  const apiKey = r.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try { const { source } = await r.json(); if (!['amazon','flipkart','cj'].includes(source)) return NextResponse.json({ error: 'Invalid source' }, { status: 400 }); return NextResponse.json(await catalogSync.syncProductPrices(source as any)) } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}