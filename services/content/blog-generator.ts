// services/content/blog-generator.ts
// Automated blog content pipeline using Google Gemini API.
// Returns placeholder content when GEMINI_API_KEY not configured.

import { env, isConfigured } from '@/lib/env'

export type BlogPost = {
  id: string; title: string; content: string; excerpt: string
  category: string; status: 'draft' | 'pending_review' | 'published'
  slug: string; wordCount: number; generatedAt: Date
}

async function callGemini(prompt: string, maxTokens = 2000): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) return ''
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens } })
    })
    return (await r.json())?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch { return '' }
}

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }

export class BlogContentPipeline {
  async generateBuyingGuide(category: string, productNames: string[]): Promise<BlogPost> {
    const title = `Best ${category} in India 2026`
    const fallback = `# ${title}\n\nA comprehensive buying guide for Indian shoppers.\n\n${productNames.slice(0, 5).map((n, i) => `## ${i + 1}. ${n}\nExcellent choice for Indian consumers.\n`).join('\n')}\n\n## Buying Tips\n- Compare prices on CloudBasket\n- Check warranty and service\n- Read verified reviews`
    if (!isConfigured('GEMINI_API_KEY')) return { id: `blog-${Date.now()}`, title, content: fallback, excerpt: `Best ${category} for Indian shoppers.`, category, status: 'draft', slug: slugify(title), wordCount: fallback.split(' ').length, generatedAt: new Date() }
    try {
      const content = await callGemini(`Write 800-word buying guide: "Best ${category} in India 2026" for price comparison site. Include top 5 products: ${productNames.slice(0, 5).join(', ')}. H2/H3 headings, Indian market focus, prices in INR.`, 2000)
      return { id: `blog-${Date.now()}`, title, content: content || fallback, excerpt: `Best ${category} for Indian shoppers 2026.`, category, status: 'pending_review', slug: slugify(title), wordCount: (content || fallback).split(' ').length, generatedAt: new Date() }
    } catch { return { id: `blog-${Date.now()}`, title, content: fallback, excerpt: `Best ${category} for Indian shoppers.`, category, status: 'draft', slug: slugify(title), wordCount: fallback.split(' ').length, generatedAt: new Date() } }
  }

  async generateDealAlert(deals: { title: string; price: number; discount: number }[]): Promise<BlogPost> {
    const title = `Today's Best Deals — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
    const content = `# ${title}\n\n${deals.slice(0, 10).map(d => `## ${d.title}\n**${d.discount}% OFF** — Now ₹${d.price.toLocaleString('en-IN')}\n`).join('\n')}`
    return { id: `deal-${Date.now()}`, title, content, excerpt: `Top ${deals.length} deals today.`, category: 'deal-alert', status: 'draft', slug: slugify(title), wordCount: content.split(' ').length, generatedAt: new Date() }
  }
}

export const blogPipeline = new BlogContentPipeline()