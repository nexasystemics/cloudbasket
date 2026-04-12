import { NextRequest, NextResponse } from 'next/server'
import { cjAPI } from '@/services/apis/cj-api'
import { rateLimit } from '@/lib/redis'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 30, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const q = request.nextUrl.searchParams.get('q') || ''
  if (!q) return NextResponse.json({ error: 'Missing q param' }, { status: 400 })
  const products = await cjAPI.searchProducts(q)
  return NextResponse.json({ products, count: products.length })
}
