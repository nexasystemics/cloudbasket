import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
  if (maintenanceMode) {
    return new Response(
      '<!DOCTYPE html><html><head><title>CloudBasket — Coming Soon</title>' +
        '<style>body{font-family:Arial,sans-serif;background:#09090B;color:#fff;' +
        'display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}' +
        '.box{text-align:center;}.title{font-size:48px;font-weight:900;color:#039BE5;}' +
        '.sub{color:#64748B;margin-top:12px;}</style></head>' +
        '<body><div class="box"><div class="title">CloudBasket</div>' +
        '<div class="sub">Coming Soon. Something sovereign is loading.</div>' +
        '</div></body></html>',
      {
        status: 503,
        headers: { 'Content-Type': 'text/html' },
      },
    )
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isProtected = ['/dashboard', '/admin'].some((path) => request.nextUrl.pathname.startsWith(path))

  if (!url || !key) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next|api|brand|favicon).*)'],
}
