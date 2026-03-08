import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
  if (!maintenanceMode) return NextResponse.next()

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
      headers: { 'Content-Type': 'text/html' }
    }
  )
}

export const config = {
  matcher: ['/((?!_next|api|brand|favicon).*)']
}
