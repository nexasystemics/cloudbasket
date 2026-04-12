import { NextRequest, NextResponse } from 'next/server'
import { amazonAPI } from '@/services/apis/amazon-pa-api'
import { env } from '@/lib/env'
import { amazonSearchQuerySchema, zodError } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = amazonSearchQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? '',
    category: request.nextUrl.searchParams.get('category') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  try {
    const products = await amazonAPI.searchProducts(parsed.data.q, parsed.data.category)
    return NextResponse.json({ products, count: products.length })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
