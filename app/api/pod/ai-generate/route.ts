import { NextRequest, NextResponse } from 'next/server'
import { aiDesignGenerator } from '@/services/pod/ai-design-generator'
import type { DesignStyle } from '@/services/pod/ai-design-generator'
import { podAiGenerateSchema, zodError } from '@/lib/validation'

export async function POST(request: NextRequest) {
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
