import { NextRequest, NextResponse } from 'next/server'
export async function POST(r: NextRequest) {
  try { const { mobile, consent } = await r.json(); if (!consent || !mobile?.match(/^[6-9]\d{9}$/)) return NextResponse.json({ error: 'Invalid' }, { status: 400 }); return NextResponse.json({ ok: true, mobile: `+91${mobile}` }) } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}