import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 120, 60)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  return NextResponse.json({ publicKey: env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || null })
}
