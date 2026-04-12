import { NextRequest, NextResponse } from 'next/server'
import { aiDesignGenerator } from '@/services/pod/ai-design-generator'
import type { DesignStyle } from '@/services/pod/ai-design-generator'
import { podAiGenerateSchema, zodError } from '@/lib/validation'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = podAiGenerateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { prompt, style, generator } = parsed.data

  try {
    const designs = []
    if (generator === 'dalle') {
      const design = await aiDesignGenerator.generateWithDALLE3(prompt, (style as DesignStyle) || 'minimalist')
      if (design) designs.push(design)
    } else {
      const results = await aiDesignGenerator.generateWithStabilityAI(prompt)
      designs.push(...results)
    }
    return NextResponse.json({ designs })
  } catch (err) {
    console.error('[pod/ai-generate] Error:', err)
    return NextResponse.json({ error: 'Design generation failed' }, { status: 500 })
  }
}
