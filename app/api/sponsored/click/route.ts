import { NextRequest, NextResponse } from 'next/server'
import { sponsoredClickSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = sponsoredClickSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: zodError(parsed.error) }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
