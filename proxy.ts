// proxy.ts — CloudBasket route guard (Next.js 16 proxy file)
// Protects: /admin/* (admin|superadmin only), /dashboard/* (any authed user)
// Enforces: MAINTENANCE_MODE env flag

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { type Role, isAdminRole } from '@/lib/roles'

// ─── Route classification ──────────────────────────────────────────────────

const ADMIN_PREFIX = '/admin'
const AUTH_PREFIXES = ['/dashboard']

// ─── Proxy ────────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Maintenance mode — show branded holding page
  //    Admin still accessible so you can disable it remotely
  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api')
  ) {
    return new Response(
      '<!DOCTYPE html><html><head><title>CloudBasket — Coming Soon</title>' +
        '<style>body{font-family:Arial,sans-serif;background:#09090B;color:#fff;' +
        'display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}' +
        '.box{text-align:center;}.title{font-size:48px;font-weight:900;color:#039BE5;}' +
        '.sub{color:#64748B;margin-top:12px;}</style></head>' +
        '<body><div class="box"><div class="title">CloudBasket</div>' +
        '<div class="sub">Coming Soon. Something amazing is loading.</div>' +
        '</div></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // 2. Skip auth entirely for public routes
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)
  const isAuthRoute = AUTH_PREFIXES.some(p => pathname.startsWith(p))

  if (!isAdminRoute && !isAuthRoute) {
    return NextResponse.next({ request })
  }

  // 3. Env guard — if Supabase not configured, block protected routes
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('reason', 'unauthenticated')
    return NextResponse.redirect(loginUrl)
  }

  // 4. Build Supabase client with correct cookie refresh pattern
  //    CRITICAL: must write cookies to BOTH request AND response
  //    so the refreshed session token propagates to the next render
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Write to request first
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        // Then rebuild response with updated request cookies
        supabaseResponse = NextResponse.next({ request })
        // Then write to response so browser gets updated token
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // 5. getUser() validates JWT server-side — more secure than getSession()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 6. Guard: /admin/* — must be logged in AND be admin/superadmin
  if (isAdminRoute) {
    if (!user || error) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'unauthenticated')
      return NextResponse.redirect(loginUrl)
    }

    // Role stored in Supabase user_metadata.role
    // If using a profiles DB table instead, see MIDDLEWARE-DEPLOY.md
    const role = (user.user_metadata?.role ?? 'user') as Role

    if (!isAdminRole(role)) {
      // Logged in but not an admin — send to dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      dashboardUrl.searchParams.set('reason', 'unauthorized')
      return NextResponse.redirect(dashboardUrl)
    }

    return supabaseResponse
  }

  // 7. Guard: /dashboard/* — any authenticated user
  if (isAuthRoute) {
    if (!user || error) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'unauthenticated')
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  return supabaseResponse
}

// ─── Matcher ───────────────────────────────────────────────────────────────

export const config = {
  matcher: ['/((?!_next|api|brand|favicon).*)'],
}
