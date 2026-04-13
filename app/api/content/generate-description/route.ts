import { NextRequest, NextResponse } from 'next/server'
import { descriptionGenerator } from '@/services/content/description-generator'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const apiKey = request.headers.get('x-internal-api-key')
  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { productId } = await request.json()
    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

    const product = INDIA_CATALOG.find((p) => p.id === productId)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const content = await descriptionGenerator.generateDescription(product)

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
        await supabase.from('generated_content').upsert({
          product_id: productId,
          description: content.description,
          seo_title: content.seoTitle,
          meta_description: content.metaDescription,
          tags: content.tags,
          generated_at: content.generatedAt.toISOString(),
        })
      } catch { /* no-op */ }
    }

    return NextResponse.json({ content })
  } catch (err) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
