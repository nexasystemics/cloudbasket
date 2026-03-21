import { NextRequest, NextResponse } from 'next/server'
export async function GET(r: NextRequest) {
  const productId = r.nextUrl.searchParams.get('productId')
  return NextResponse.json({ productId, inStock: true, confidence: 'low' })
}