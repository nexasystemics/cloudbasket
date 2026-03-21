import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  return NextResponse.json({ productId, inStock: true, confidence: 'low', source: 'default' })
}