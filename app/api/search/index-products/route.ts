import { NextRequest, NextResponse } from 'next/server'
import { indexProductsToTypesense } from '@/lib/search/typesense-client'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { env } from '@/lib/env'
export async function POST(request: NextRequest) {
  const key = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && key !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await indexProductsToTypesense(INDIA_CATALOG as any[])
  return NextResponse.json({ ok: true, ...result })
}