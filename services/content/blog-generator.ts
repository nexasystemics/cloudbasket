// services/content/blog-generator.ts
// Automated blog content pipeline powered by Gemini AI.
// Stub-safe — returns empty drafts when GEMINI_API_KEY is not configured.

import { env, isConfigured } from '@/lib/env'

export interface BlogDraft {
  id: string
  title: string
  slug: string
  metaDescription: string
  content: string
  tags: string[]
  category: string
  status: 'draft' | 'scheduled' | 'published'
  generatedAt: string
  scheduledFor?: string
}

export interface BlogGeneratorInput {
  topic: string
  category: string
  keywords?: string[]
  targetLength?: 'short' | 'medium' | 'long'
}

const LENGTH_WORDS = {
  short: 400,
  medium: 800,
  long: 1500,
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function generateId(): string {
  return `blog-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

class BlogGenerator {
  private isReady(): boolean {
    return isConfigured('GEMINI_API_KEY')
  }

  async generate(input: BlogGeneratorInput): Promise<BlogDraft | null> {
    if (!this.isReady()) {
      console.warn('[BlogGenerator] GEMINI_API_KEY not configured — returning stub draft')
      return this.stubDraft(input)
    }

    const wordCount = LENGTH_WORDS[input.targetLength ?? 'medium']
    const keywordHint =
      input.keywords && input.keywords.length > 0
        ? `Focus keywords: ${input.keywords.join(', ')}.`
        : ''

    const prompt = `
You are a senior content writer for CloudBasket, India's smartest price comparison platform.
Write a complete blog post for the following:

Topic: ${input.topic}
Category: ${input.category}
${keywordHint}
Target length: ~${wordCount} words

Respond ONLY in this JSON format (no markdown, no extra text):
{
  "title": "SEO-optimised post title",
  "metaDescription": "150-160 char meta description",
  "content": "Full HTML blog content using <h2>, <p>, <ul>, <strong> tags",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
    `.trim()

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
        }
      )

      if (!response.ok) {
        console.warn('[BlogGenerator] Gemini API error:', response.status)
        return this.stubDraft(input)
      }

      const data = await response.json() as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> }
        }>
      }

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean) as {
        title: string
        metaDescription: string
        content: string
        tags: string[]
      }

      return {
        id: generateId(),
        title: parsed.title,
        slug: generateSlug(parsed.title),
        metaDescription: parsed.metaDescription,
        content: parsed.content,
        tags: parsed.tags ?? [],
        category: input.category,
        status: 'draft',
        generatedAt: new Date().toISOString(),
      }
    } catch (err) {
      console.warn('[BlogGenerator] Generation failed:', err)
      return this.stubDraft(input)
    }
  }

  async generateBatch(inputs: BlogGeneratorInput[]): Promise<BlogDraft[]> {
    const results: BlogDraft[] = []
    for (const input of inputs) {
      const draft = await this.generate(input)
      if (draft) results.push(draft)
    }
    return results
  }

  private stubDraft(input: BlogGeneratorInput): BlogDraft {
    const title = `Best ${input.topic} Deals in India 2026`
    return {
      id: generateId(),
      title,
      slug: generateSlug(title),
      metaDescription: `Discover the best ${input.topic} deals and offers in India. Compare prices and save money with CloudBasket.`,
      content: `<h2>Best ${input.topic} in India</h2><p>This is a stub post. Configure GEMINI_API_KEY to generate real content.</p>`,
      tags: [input.topic, input.category, 'india', 'deals', 'cloudbasket'],
      category: input.category,
      status: 'draft',
      generatedAt: new Date().toISOString(),
    }
  }
}

export const blogGenerator = new BlogGenerator()


