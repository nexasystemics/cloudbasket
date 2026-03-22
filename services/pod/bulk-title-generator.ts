// E29: Automated POD Title + Tag Generator (500 designs bulk)
import { env, isConfigured } from '@/lib/env'

export type DesignMeta = { title: string; tags: string[]; description: string; platform: string }

async function callGemini(prompt: string): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) return ''
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1000 } })
    })
    return (await r.json())?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch { return '' }
}

export async function generateDesignMeta(designDescription: string, platform: 'amazon' | 'etsy' | 'redbubble' | 'printify'): Promise<DesignMeta> {
  const maxTitle = { amazon: 60, etsy: 140, redbubble: 80, printify: 80 }[platform]
  const maxTags = { amazon: 7, etsy: 13, redbubble: 15, printify: 10 }[platform]
  const fallback: DesignMeta = {
    title: `${designDescription.slice(0, maxTitle)} | ${platform} exclusive`,
    tags: designDescription.toLowerCase().split(' ').slice(0, maxTags),
    description: `Unique ${designDescription.toLowerCase()} design. Perfect for gifts and everyday use. Premium quality print.`,
    platform
  }
  const prompt = `Generate SEO-optimised metadata for POD listing on ${platform}. Design: "${designDescription}". Return only JSON: {title (max ${maxTitle} chars), tags (array of max ${maxTags} strings), description (max 300 chars)}. No markdown.`
  const text = await callGemini(prompt)
  if (!text) return fallback
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return { ...fallback, ...parsed, platform }
  } catch { return fallback }
}

export async function bulkGenerateMeta(designs: string[], platform: 'amazon' | 'etsy' | 'redbubble' | 'printify', onProgress?: (done: number, total: number) => void): Promise<DesignMeta[]> {
  const results: DesignMeta[] = []
  for (let i = 0; i < designs.length; i++) {
    const meta = await generateDesignMeta(designs[i], platform)
    results.push(meta)
    onProgress?.(i + 1, designs.length)
    if (i < designs.length - 1) await new Promise(r => setTimeout(r, 500))
  }
  return results
}

export function exportMetaAsCSV(metas: DesignMeta[]): string {
  const header = 'Platform,Title,Tags,Description'
  const rows = metas.map(m => [m.platform, m.title, m.tags.join('|'), m.description].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  return [header, ...rows].join('\n')
}