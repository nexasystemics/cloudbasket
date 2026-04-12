import { NextRequest, NextResponse } from 'next/server'
import { reviewPostSchema, zodError } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId) {
    return NextResponse.json({ error: 'Missing productId query parameter' }, { status: 400 })
  }
  return NextResponse.json({ reviews: [], productId })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = reviewPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  try {
    const review = {
      ...parsed.data,
      id: Math.random().toString(36).substring(2),
      date: new Date().toISOString(),
      verified: false,
      helpful: 0,
    }
    return NextResponse.json({ ok: true, review })
  } catch (err) {
    console.error('[reviews] POST error:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
