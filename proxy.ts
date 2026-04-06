// © 2026 NEXQON HOLDINGS — CloudBasket proxy.ts
// Next.js 16 Turbopack: middleware uses proxy.ts (not middleware.ts)
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Role } from '@/lib/auth'

const ADMIN_ROLES: Role[] = ['admin', 'superadmin']

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // --- Build Supabase client with cookie forwarding ---
  let response = NextResponse.next({ request })

  // Check if Supabase env vars are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are missing, allow public routes but redirect auth routes
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('reason', 'no-auth-config')
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required for Server Components to have up-to-date auth state
  const { data: { user } } = await supabase.auth.getUser()

  // --- MAINTENANCE MODE ---
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

  // --- ADMIN ROUTES: /admin/* ---
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
    return response
  }

  // --- DASHBOARD ROUTES: /dashboard/* ---
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', '/dashboard')
      loginUrl.searchParams.set('reason', 'unauthenticated')
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // --- PUBLIC ROUTES: pass through ---
  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, robots.txt, sitemap.xml, manifest.json
     * - /api/webhook/* (raw body needed — excluded from proxy)
     * - Public asset extensions
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|api/webhook/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css|js)$).*)',
  ],
}
