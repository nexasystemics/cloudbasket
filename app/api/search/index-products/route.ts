// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ ok: false, message: 'Search indexing not configured' }, { status: 501 })
}
