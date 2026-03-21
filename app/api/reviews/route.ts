import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  return NextResponse.json({ reviews: [], productId })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.productId || !body.body || !body.rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    return NextResponse.json({ ok: true, review: { ...body, id: Math.random().toString(36).substring(2), date: new Date().toISOString() } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}