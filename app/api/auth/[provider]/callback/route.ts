// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = request.cookies.get('oauth_state')?.value
  if (!code || state !== storedState) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?error=oauth_failed`)
  // Exchange code for token via Supabase Auth or custom handler
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?provider=${provider}`)
}
