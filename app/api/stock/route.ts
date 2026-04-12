import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/redis'
import { productIdSchema, zodError } from '@/lib/validation'
import { z } from 'zod'

const stockQuerySchema = z.object({ productId: productIdSchema })

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(r: NextRequest) {
  const ip = getRequestIp(r)
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const parsed = stockQuerySchema.safeParse({
    productId: r.nextUrl.searchParams.get('productId') ?? '',
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  return NextResponse.json({ productId: parsed.data.productId, inStock: true, confidence: 'low' })
}