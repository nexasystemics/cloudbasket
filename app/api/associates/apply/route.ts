import { NextRequest, NextResponse } from 'next/server'
import { associateProgram } from '@/services/associates/program'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || !body.email || !body.websiteUrl) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    const result = await associateProgram.applyForProgram(body)
    return NextResponse.json(result)
  } catch { return NextResponse.json({ error: 'Application failed' }, { status: 500 }) }
}