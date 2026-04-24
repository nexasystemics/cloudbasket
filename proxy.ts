// © 2026 NEXQON HOLDINGS — CloudBasket proxy.ts
// Next.js 16 Turbopack: middleware uses proxy.ts (not middleware.ts)
// Updated: 2026-04-10 | E1 Chief Engineer
// Added: Rate limiting, CORS, security headers, bot blocking,
//        cron guard, auth guard for user routes, zero-checkout redirect

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { Role } from '@/lib/auth'

// ── Constants ─────────────────────────────────────────────────────────

const ADMIN_ROLES: Role[] = ['admin', 'superadmin']

const ALLOWED_ORIGINS = [
  'https://cloudbasket.co',
  'https://www.cloudbasket.co',
  'https://cloudbasket.co',
  'https://www.cloudbasket.co',
]

// Routes requiring a logged-in user (not just admin)
const AUTH_REQUIRED = [
  '/profile',
  '/wishlist',
  '/alerts',
  '/account',
  '/api/user',
  '/api/wishlist',
  '/api/price-alerts',
]

// Routes blocked by zero-checkout mandate → redirect to /feature-disabled
// NOTE: /admin and /dashboard are handled separately below (role-based)
const ZERO_CHECKOUT_BLOCKED = [
  '/checkout',
  '/vendor',
]

// Scraper bot patterns — block on affiliate/redirect routes
const BOT_PATTERNS = [
  /scrapy/i,
  /python-requests/i,
  /curl\/[0-9]/i,
  /wget/i,
  /go-http-client/i,
]

// ── Rate limiter (lazy init — fails open if keys missing) ────────────

let ratelimit: Ratelimit | null = null

function getRatelimiter(): Ratelimit | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    // IBF has not yet added Upstash keys — skip rate limiting silently
    return null
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(60, '60 s'),
      analytics: true,
      prefix: 'cb_rl',
    })
  }
  return ratelimit
}

// ── CORS helper ───────────────────────────────────────────────────────

function applyCORS(res: NextResponse, origin: string | null): void {
  const allowed =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) ||
      origin.startsWith('http://localhost:'))

  res.headers.set(
    'Access-Control-Allow-Origin',
    allowed && origin ? origin : 'https://cloudbasket.co'
  )
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-internal-api-key')
  res.headers.set('Access-Control-Max-Age', '86400')
  res.headers.set('Vary', 'Origin')
}

// ── Security headers helper ───────────────────────────────────────────

function applySecurityHeaders(res: NextResponse): void {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
}

// ── Main proxy function ───────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin')
  const userAgent = request.headers.get('user-agent') || ''

  // ── 1. CORS preflight ───────────────────────────────────────────────
  if (request.method === 'OPTIONS') {
    const pre = new NextResponse(null, { status: 204 })
    applyCORS(pre, origin)
    return pre
  }

  // ── 2. Bot blocking on affiliate + redirect routes ──────────────────
  if (pathname.startsWith('/go/') || pathname.startsWith('/api/affiliate')) {
    if (BOT_PATTERNS.some((p) => p.test(userAgent))) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // ── 3. Zero-checkout mandate redirect ───────────────────────────────
  if (ZERO_CHECKOUT_BLOCKED.some((p) => pathname.startsWith(p))) {
    const url = new URL('/feature-disabled', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // ── 4. Cron secret guard ────────────────────────────────────────────
  if (pathname.startsWith('/api/cron/')) {
    const cronSecret = request.headers.get('x-cron-secret')
    if (!process.env.CRON_SECRET || cronSecret !== process.env.CRON_SECRET) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized — invalid cron secret' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // ── 5. Rate limiting (API + redirect routes) ────────────────────────
  if (pathname.startsWith('/api/') || pathname.startsWith('/go/')) {
    const limiter = getRatelimiter()
    if (limiter) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'anonymous'

      try {
        const { success, limit, remaining, reset } = await limiter.limit(
          `${ip}_${pathname.split('/')[2] || 'api'}`
        )

        if (!success) {
          const res = new NextResponse(
            JSON.stringify({
              error: 'Too many requests — please slow down',
              retryAfter: Math.ceil((reset - Date.now()) / 1000),
            }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
          res.headers.set('X-RateLimit-Limit', String(limit))
          res.headers.set('X-RateLimit-Remaining', String(remaining))
          res.headers.set('Retry-After', String(Math.ceil((reset - Date.now()) / 1000)))
          applyCORS(res, origin)
          applySecurityHeaders(res)
          return res
        }
      } catch {
        // Fail open — Redis down should not take down the site
        console.warn('[proxy] Rate limit check skipped — Redis unavailable')
      }
    }
  }

  // ── 6. Build Supabase client with cookie forwarding ─────────────────
  // (ORIGINAL LOGIC — unchanged)
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // No Supabase config — block protected routes, pass public
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      AUTH_REQUIRED.some((p) => pathname.startsWith(p))
    ) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('reason', 'no-auth-config')
      return NextResponse.redirect(loginUrl)
    }
    applyCORS(response, origin)
    applySecurityHeaders(response)
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresh session — required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── 7. MAINTENANCE MODE ─────────────────────────────────────────────
  // (ORIGINAL LOGIC — unchanged)
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
  if (maintenanceMode) {
    const isAdminPath = pathname.startsWith('/admin')
    const isApiPath = pathname.startsWith('/api')
    const isOfflinePath = pathname === '/offline'

    if (!isAdminPath && !isApiPath && !isOfflinePath) {
      const role = (user?.user_metadata?.role ?? 'user') as Role
      if (!ADMIN_ROLES.includes(role)) {
        return NextResponse.redirect(new URL('/offline', request.url))
      }
    }
  }

  // ── 8. ADMIN ROUTES /admin/* ────────────────────────────────────────
  // (ORIGINAL LOGIC — unchanged)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', '/admin')
      loginUrl.searchParams.set('reason', 'unauthenticated')
      return NextResponse.redirect(loginUrl)
    }
    const role = (user.user_metadata?.role ?? 'user') as Role
    if (!ADMIN_ROLES.includes(role)) {
      const dashUrl = new URL('/dashboard', request.url)
      dashUrl.searchParams.set('reason', 'unauthorized')
      return NextResponse.redirect(dashUrl)
    }
    applyCORS(response, origin)
    applySecurityHeaders(response)
    return response
  }

  // ── 9. DASHBOARD ROUTES /dashboard/* ───────────────────────────────
  // (ORIGINAL LOGIC — unchanged)
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', '/dashboard')
      loginUrl.searchParams.set('reason', 'unauthenticated')
      return NextResponse.redirect(loginUrl)
    }
    applyCORS(response, origin)
    applySecurityHeaders(response)
    return response
  }

  // ── 10. AUTH-REQUIRED USER ROUTES ───────────────────────────────────
  // NEW — protects /profile, /wishlist, /alerts, /api/user/* etc.
  if (AUTH_REQUIRED.some((p) => pathname.startsWith(p))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'unauthenticated')
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── 11. PUBLIC ROUTES — pass through with headers ───────────────────
  applyCORS(response, origin)
  applySecurityHeaders(response)
  return response
}

// ── Matcher ───────────────────────────────────────────────────────────
// (ORIGINAL matcher — unchanged, it was already correct)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|api/webhook/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css|js)$).*)',
  ],
}
