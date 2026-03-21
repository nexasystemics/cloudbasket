import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try {
    const { campaignId } = await r.json()
    if (!campaignId) return NextResponse.json({ ok: false }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }) }
}