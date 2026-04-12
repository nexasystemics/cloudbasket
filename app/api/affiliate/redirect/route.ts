// © 2026 NEXQON HOLDINGS — CloudBasket
// app/api/affiliate/redirect/route.ts — Affiliate link redirect with click logging.
// GET /api/affiliate/redirect?url=<affiliate-url>&productId=<id>&platform=<name>
//
// Validates the target URL against an allowlist of known affiliate domains,
// logs the click to attributed_clicks, then issues a 302 redirect.
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/redis'
import { affiliateRedirectSchema, zodError } from '@/lib/validation'

// ---------------------------------------------------------------------------
// Domain allowlist — only these affiliate networks may be redirected to
// ---------------------------------------------------------------------------
const ALLOWED_DOMAINS: readonly string[] = [
  'amazon.in',
  'amazon.com',
  'amzn.to',
  'flipkart.com',
  'fkrt.it',
  'cj.com',
  'dpbolvw.net',
  'anrdoezrs.net',
  'jdoqocy.com',
  'myntra.com',
  'meesho.com',
  'ajio.com',
]

function isAllowedDomain(rawUrl: string): boolean {
  try {
    const { hostname } = new URL(rawUrl)
    return ALLOWED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`),
    )
  } catch {
    return false
  }
}

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  const parsed = affiliateRedirectSchema.safeParse({
    url:       request.nextUrl.searchParams.get('url')       ?? '',
    productId: request.nextUrl.searchParams.get('productId') ?? undefined,
    platform:  request.nextUrl.searchParams.get('platform')  ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const { url, productId, platform } = parsed.data

  if (!isAllowedDomain(url)) {
    return NextResponse.json({ error: 'Redirect target not allowed' }, { status: 400 })
  }

  // Fire-and-forget click attribution — never block the redirect on DB errors
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    productId
  ) {
    import('@supabase/supabase-js')
      .then(({ createClient }) => {
        const sb = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        )
        return sb.from('attributed_clicks').insert({
          product_id:  productId,
          platform:    platform ?? 'unknown',
          page_url:    request.headers.get('referer') ?? null,
          clicked_at:  new Date().toISOString(),
        })
      })
      .catch((err: unknown) => {
        console.warn('[affiliate/redirect] Click log error:', err)
      })
  }

  return NextResponse.redirect(url, { status: 302 })
}
