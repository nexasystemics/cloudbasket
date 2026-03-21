import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.productId || !body.content || body.content.length < 20) return NextResponse.json({ error: 'Invalid content' }, { status: 400 })
    return NextResponse.json({ ok: true, id: Math.random().toString(36).substring(2), status: 'pending' })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}