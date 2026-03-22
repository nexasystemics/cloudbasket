import { NextRequest, NextResponse } from 'next/server'
import { AUTH_PROVIDERS, type AuthProvider } from '@/lib/auth/providers'
export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
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