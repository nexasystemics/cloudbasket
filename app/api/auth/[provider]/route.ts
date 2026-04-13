// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_PROVIDERS, type AuthProvider } from '@/lib/auth/providers'
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
  const config = AUTH_PROVIDERS[provider as AuthProvider]
  if (!config) return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
  const state = crypto.randomUUID()
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/${provider}/callback`
  const url = new URL(config.authUrl)
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', callbackUrl)
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)
  const response = NextResponse.redirect(url.toString())
  response.cookies.set('oauth_state', state, { httpOnly: true, secure: true, maxAge: 600 })
  return response
}
