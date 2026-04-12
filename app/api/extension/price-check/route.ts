// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/redis'
import { searchProducts } from '@/lib/search'
import { zodError } from '@/lib/validation'

const priceCheckSchema = z.object({
  productName:  z.string().trim().min(1, 'productName is required').max(200, 'productName too long'),
  currentPrice: z.number().positive().optional(),
  site:         z.string().trim().max(100).optional(),
})

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 20, 60)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  const parsed = priceCheckSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: zodError(parsed.error) },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }

  const { productName, currentPrice } = parsed.data
  const results = searchProducts(productName, { sortBy: 'price-asc' }).slice(0, 5)
  const cheapest = results[0]
  const savings = cheapest && currentPrice ? currentPrice - cheapest.price : 0
  return NextResponse.json(
    {
      results,
      cheapest,
      savings,
      savingsPercent: currentPrice && savings > 0 ? Math.round((savings / currentPrice) * 100) : 0,
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } },
  )
}
export async function OPTIONS() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
