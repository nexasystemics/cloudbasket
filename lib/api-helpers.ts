import { NextRequest, NextResponse } from 'next/server'

export function getTenantFromRequest(request: NextRequest): string {
  return request.headers.get('x-tenant') || 'cloudbasket'
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  }, { status })
}

export function validateRequired(
  body: Record<string, unknown>,
  fields: string[]
): string | null {
  for (const field of fields) {
    if (!body[field]) {
      return `Missing required field: ${field}`
    }
  }
  return null
}
