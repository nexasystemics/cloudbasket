// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/redis'

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const limit = await rateLimit(ip, 30, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const { provider } = await params
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = request.cookies.get('oauth_state')?.value
  if (!code || state !== storedState) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=oauth_failed`)
  // Exchange code for token via Supabase Auth or custom handler
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?provider=${provider}`)
}
