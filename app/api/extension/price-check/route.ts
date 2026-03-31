// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/search'
export async function POST(request: NextRequest) {
  try {
    const { productName, currentPrice, site } = await request.json()
    if (!productName) return NextResponse.json({ error: 'productName required' }, { status: 400 })
    const results = searchProducts(productName, { sortBy: 'price-asc' }).slice(0, 5)
    const cheapest = results[0]
    const savings = cheapest && currentPrice ? currentPrice - cheapest.price : 0
    return NextResponse.json({ results, cheapest, savings, savingsPercent: currentPrice && savings > 0 ? Math.round((savings / currentPrice) * 100) : 0 }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
export async function OPTIONS() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
