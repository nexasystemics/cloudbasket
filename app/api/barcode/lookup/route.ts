// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
// F96: Barcode / QR Product Lookup
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/redis'
import { searchProducts } from '@/lib/search'

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

  const barcode = request.nextUrl.searchParams.get('barcode') || ''
  if (!barcode) return NextResponse.json({ error: 'barcode required' }, { status: 400 })
  // Search by barcode in catalog — in production wire to Open Food Facts or UPC Database API
  const results = searchProducts(barcode, { sortBy: 'price-asc' }).slice(0, 5)
  return NextResponse.json({ barcode, results, found: results.length > 0 })
}
