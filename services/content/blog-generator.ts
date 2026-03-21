// services/content/blog-generator.ts
// Automated blog content pipeline using Google Gemini API.
// Stubs return placeholder content when GEMINI_API_KEY not configured.

import { env, isConfigured } from '@/lib/env'

export type BlogPost = {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
  relatedProductIds: string[]
  generatedAt: Date
  wordCount: number
  slug: string
}

async function callGemini(prompt: string, maxTokens = 2000): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) return ''
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens } }),
  })
  if (!res.ok) return ''
  const json = await res.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export class BlogContentPipeline {
  async generateBuyingGuide(category: string, productNames: string[]): Promise<BlogPost> {
    const fallback: BlogPost = {
      id: `blog-${Date.now()}`,
      title: `Best ${category} in India 2026`,
      content: `# Best ${category} in India 2026\n\nA comprehensive buying guide for Indian shoppers comparing the top products across Amazon, Flipkart and more.\n\n## Top Products\n\n${productNames.slice(0, 5).map((n, i) => `### ${i + 1}. ${n}\nExcellent choice for Indian consumers.\n`).join('\n')}\n\n## Buying Checklist\n- Compare prices across platforms\n- Check warranty and after-sales service\n- Read verified reviews\n- Look for ISI/BIS certification\n\n## FAQ\n**Q: Where to buy?**\nA: Compare on CloudBasket first.\n\n**Q: Best time to buy?**\nA: During sale seasons for best deals.\n\n**Q: What warranty should I expect?**\nA: Minimum 1 year manufacturer warranty.`,
      excerpt: `Compare the best ${category} options in India. Prices, features and expert recommendations for Indian shoppers.`,
      category,
      status: 'draft',
      relatedProductIds: [],
      generatedAt: new Date(),
      wordCount: 300,
      slug: slugify(`best-${category}-india-2026`),
    }

    if (!isConfigured('GEMINI_API_KEY')) return fallback

    try {
      const prompt = `Write a comprehensive 800-word buying guide titled "Best ${category} in India 2026" for an Indian price comparison website. Include: introduction with market overview, top 5 products with pros/cons (mention these products: ${productNames.slice(0, 5).join(', ')}), buying criteria checklist, FAQ section with 3 questions. Format with H2 and H3 headings using markdown. Write for Indian consumers. Be specific about Indian market conditions, prices in INR, and available brands.`
      const content = await callGemini(prompt, 2000)
      if (!content) return fallback
      return {
        ...fallback,
        content,
        wordCount: content.split(' ').length,
        status: 'pending_review',
      }
    } catch { return fallback }
  }

  async generateDealAlert(deals: { title: string; price: number; discount: number }[]): Promise<BlogPost> {
    const title = `Today's Best Deals — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
    const content = `# ${title}\n\n${deals.slice(0, 10).map(d => `## ${d.title}\n**${d.discount}% OFF** — Now at ₹${d.price.toLocaleString('en-IN')}\n`).join('\n')}`
    return { id: `deal-${Date.now()}`, title, content, excerpt: `Top ${deals.length} deals today — up to ${Math.max(...deals.map(d => d.discount))}% off.`, category: 'deal-alert', status: 'draft', relatedProductIds: [], generatedAt: new Date(), wordCount: content.split(' ').length, slug: slugify(title) }
  }

  async generateBrandReview(brand: string, products: { name: string; price: number }[]): Promise<BlogPost> {
    const title = `${brand} Products Review — Best Buys in India 2026`
    const fallbackContent = `# ${title}\n\n${brand} is one of India's trusted brands. Here are the top products worth buying.\n\n${products.slice(0, 5).map((p, i) => `## ${i + 1}. ${p.name}\nPrice: ₹${p.price.toLocaleString('en-IN')}\nA quality product from ${brand} suitable for Indian households.\n`).join('\n')}`
    return { id: `brand-${Date.now()}`, title, content: fallbackContent, excerpt: `Best ${brand} products in India with price comparison.`, category: 'brand-spotlight', status: 'draft', relatedProductIds: [], generatedAt: new Date(), wordCount: fallbackContent.split(' ').length, slug: slugify(title) }
  }

  async generateComparisonPost(product1: string, product2: string, category: string): Promise<BlogPost> {
    const title = `${product1} vs ${product2} — Which Should You Buy in India 2026?`
    const fallbackContent = `# ${title}\n\nA detailed head-to-head comparison to help Indian shoppers decide.\n\n## Design and Build Quality\nBoth products offer excellent build quality suitable for the Indian market.\n\n## Performance\nCompare performance metrics relevant to Indian usage patterns.\n\n## Price in India\nCompare current prices across Amazon, Flipkart and other platforms on CloudBasket.\n\n## Verdict\nBoth are excellent choices. Your decision depends on budget and specific needs.`
    return { id: `compare-${Date.now()}`, title, content: fallbackContent, excerpt: `${product1} vs ${product2} — detailed comparison for Indian buyers.`, category: 'buying-guide', status: 'draft', relatedProductIds: [], generatedAt: new Date(), wordCount: fallbackContent.split(' ').length, slug: slugify(title) }
  }
}

export const blogPipeline = new BlogContentPipeline()