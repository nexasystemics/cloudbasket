import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try {
    const b = await r.json()
    if (!b.productId || !b.content || b.content.length < 20) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    return NextResponse.json({ ok: true, id: Math.random().toString(36).substring(2), status: 'pending' })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}