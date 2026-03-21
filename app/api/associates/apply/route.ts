import { NextRequest, NextResponse } from 'next/server'
import { associateProgram } from '@/services/associates/program'
export async function POST(r: NextRequest) {
  try {
    const b = await r.json()
    if (!b.name || !b.email || !b.websiteUrl) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    return NextResponse.json(await associateProgram.applyForProgram(b))
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}