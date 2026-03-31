// © 2026 NEXQON HOLDINGS — CloudBasket | proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

type Role = 'user' | 'admin' | 'superadmin'
const ADMIN_ROLES: Role[] = ['admin', 'superadmin']

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // MAINTENANCE MODE → /offline (admin bypass)
  if (process.env.MAINTENANCE_MODE === 'true') {
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && pathname !== '/offline') {
      return NextResponse.redirect(new URL('/offline', request.url))
    }
  }

  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  if (!isProtected) return NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const dest = new URL('/login', request.url)
    dest.searchParams.set('redirect', pathname)
    dest.searchParams.set('reason', 'unauthenticated')
    return NextResponse.redirect(dest)
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → /login
  if (!user) {
    const dest = new URL('/login', request.url)
    dest.searchParams.set('redirect', pathname)
    dest.searchParams.set('reason', 'unauthenticated')
    return NextResponse.redirect(dest)
  }

  // Admin routes — role check
  if (pathname.startsWith('/admin')) {
    const role = (user.user_metadata?.role ?? 'user') as Role
    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/dashboard?reason=unauthorized', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next|api/webhook|brand|favicon).*)'],
}