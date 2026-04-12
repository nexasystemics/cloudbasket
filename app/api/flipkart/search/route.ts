import { NextRequest, NextResponse } from 'next/server'
import { flipkartAPI } from '@/services/apis/flipkart-affiliate'
import { flipkartSearchQuerySchema, zodError } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const parsed = flipkartSearchQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? '',
    category: request.nextUrl.searchParams.get('category') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const products = await flipkartAPI.searchProducts(parsed.data.q, parsed.data.category)
  return NextResponse.json({ products, count: products.length })
}
