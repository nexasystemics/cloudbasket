import { NextRequest, NextResponse } from 'next/server'
import { cjAPI } from '@/services/apis/cj-api'
import { rateLimit } from '@/lib/redis'
import { amazonSearchQuerySchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 30, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const parsed = amazonSearchQuerySchema.safeParse({
    q:        request.nextUrl.searchParams.get('q')        ?? '',
    category: request.nextUrl.searchParams.get('category') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const products = await cjAPI.searchProducts(parsed.data.q)
  return NextResponse.json({ products, count: products.length })
}
