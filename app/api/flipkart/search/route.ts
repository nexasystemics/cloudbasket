import { NextRequest, NextResponse } from 'next/server'
import { flipkartAPI } from '@/services/apis/flipkart-affiliate'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  const category = request.nextUrl.searchParams.get('category') || undefined
  if (!q) return NextResponse.json({ error: 'Missing q param' }, { status: 400 })
  const products = await flipkartAPI.searchProducts(q, category)
  return NextResponse.json({ products, count: products.length })
}