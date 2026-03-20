import { NextRequest, NextResponse } from 'next/server'
import { cjAPI } from '@/services/apis/cj-api'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  if (!q) return NextResponse.json({ error: 'Missing q param' }, { status: 400 })
  const products = await cjAPI.searchProducts(q)
  return NextResponse.json({ products, count: products.length })
}