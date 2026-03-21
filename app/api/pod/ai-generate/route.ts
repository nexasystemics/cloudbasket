import { NextRequest, NextResponse } from 'next/server'
import { aiDesignGenerator } from '@/services/pod/ai-design-generator'
import type { DesignStyle } from '@/services/pod/ai-design-generator'

export async function POST(request: NextRequest) {
  try {
    const {prompt, style, generator} = await request.json()
    if (!prompt) return NextResponse.json({error:'Missing prompt'},{status:400})
    const designs = []
    if (generator==='dalle') {
      const design = await aiDesignGenerator.generateWithDALLE3(prompt, style as DesignStyle||'minimalist')
      if (design) designs.push(design)
    } else {
      const results = await aiDesignGenerator.generateWithStabilityAI(prompt)
      designs.push(...results)
    }
    return NextResponse.json({designs})
  } catch { return NextResponse.json({error:'Generation failed'},{status:500}) }
}