import { NextRequest, NextResponse } from 'next/server'
import { associateProgram } from '@/services/associates/program'
import { associatesApplySchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = associatesApplySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  try {
    const result = await associateProgram.applyForProgram({
      name: parsed.data.name,
      email: parsed.data.email,
      websiteUrl: parsed.data.websiteUrl,
      platformType: 'website',
      niche: parsed.data.category || 'general',
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[associates/apply] Error:', err)
    return NextResponse.json({ error: 'Application failed' }, { status: 500 })
  }
}
