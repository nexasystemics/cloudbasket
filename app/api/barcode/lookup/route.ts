// F96: Barcode / QR Product Lookup
import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/search'
export async function GET(request: NextRequest) {
  const barcode = request.nextUrl.searchParams.get('barcode') || ''
  if (!barcode) return NextResponse.json({ error: 'barcode required' }, { status: 400 })
  // Search by barcode in catalog — in production wire to Open Food Facts or UPC Database API
  const results = searchProducts(barcode, { sortBy: 'price-asc' }).slice(0, 5)
  return NextResponse.json({ barcode, results, found: results.length > 0 })
}