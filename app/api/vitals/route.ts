// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 120, 60)
  if (!rl.success) {
    return NextResponse.json({ ok: true })  // silently drop — vitals are fire-and-forget
  }

  try {
    const metrics = await request.json()
    if (process.env.NODE_ENV === 'development') console.log('[Vitals]', metrics)
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}
