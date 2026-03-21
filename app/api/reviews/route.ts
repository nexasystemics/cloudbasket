import { NextRequest, NextResponse } from 'next/server'
export async function GET(r: NextRequest) {
  const productId = r.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  return NextResponse.json({ reviews: [], productId })
}
export async function POST(r: NextRequest) {
  try {
    const b = await r.json()
    if (!b.productId || !b.body || !b.rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    return NextResponse.json({ ok: true, review: { ...b, id: Math.random().toString(36).substring(2), date: new Date().toISOString() } })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}