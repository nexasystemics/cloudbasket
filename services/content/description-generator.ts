// services/content/description-generator.ts
// Automated product description generation using Google Gemini API.
// Stubs return placeholder content when GEMINI_API_KEY is not configured.

import { env, isConfigured } from '@/lib/env'
import type { IndiaProduct } from '@/lib/india-catalog/types'

export type GeneratedContent = {
  description: string
  seoTitle: string
  metaDescription: string
  tags: string[]
  generatedAt: Date
}

export type BlogOutline = {
  title: string
  metaDescription: string
  headings: string[]
  suggestedProducts: string[]
  estimatedWordCount: number
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(prompt: string, maxTokens = 500): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) {
    console.warn('[Gemini] API key not configured')
    return ''
  }
  const res = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
    }),
  })
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const json = await res.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function buildProductPrompt(product: IndiaProduct | any): string {
  return `Write a compelling 150-word product description for an Indian e-commerce affiliate site for: ${product.name || product.title} by ${product.brand}. Category: ${product.category}. Price: ₹${product.price}. Include: key benefits, ideal customer, one specific use case. Tone: helpful, concise, SEO-friendly. Do not include price. End with a call-to-action phrase.`
}

function buildSEOTitlePrompt(product: IndiaProduct | any): string {
  return `Write a compelling SEO title (max 60 chars) for this product page: ${product.name || product.title} by ${product.brand}. Format: Buy [Product] at Best Price in India | CloudBasket`
}

function buildMetaDescriptionPrompt(product: IndiaProduct | any): string {
  return `Write a meta description (max 155 chars) for: ${product.name || product.title} by ${product.brand} at ₹${product.price}. Include the brand, a key feature, and a call to compare prices.`
}

function generateFallbackContent(product: IndiaProduct | any): GeneratedContent {
  const name = product.name || product.title || 'Product'
  return {
    description: `${name} by ${product.brand} — a quality product available in India. Compare prices across Amazon, Flipkart and more on CloudBasket. Find the best deal and save money on every purchase.`,
    seoTitle: `Buy ${name} at Best Price in India | CloudBasket`,
    metaDescription: `${name} by ${product.brand} at ₹${product.price}. Compare prices across top Indian platforms. Find the lowest price on CloudBasket.`,
    tags: product.tags || [product.brand, product.category],
    generatedAt: new Date(),
  }
}

export class ProductDescriptionGenerator {
  async generateDescription(product: IndiaProduct | any): Promise<GeneratedContent> {
    if (!isConfigured('GEMINI_API_KEY')) return generateFallbackContent(product)
    try {
      const [description, seoTitle, metaDescription] = await Promise.all([
        callGemini(buildProductPrompt(product)),
        callGemini(buildSEOTitlePrompt(product), 100),
        callGemini(buildMetaDescriptionPrompt(product), 200),
      ])
      return {
        description: description || generateFallbackContent(product).description,
        seoTitle: seoTitle || generateFallbackContent(product).seoTitle,
        metaDescription: metaDescription || generateFallbackContent(product).metaDescription,
        tags: product.tags || [],
        generatedAt: new Date(),
      }
    } catch (err) {
      console.warn('[Gemini] Generation failed:', err)
      return generateFallbackContent(product)
    }
  }

  async generateBulk(products: (IndiaProduct | any)[]): Promise<Map<string, GeneratedContent>> {
    const results = new Map<string, GeneratedContent>()
    const batches: (IndiaProduct | any)[][] = []
    for (let i = 0; i < products.length; i += 10) batches.push(products.slice(i, i + 10))

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (product) => {
          const content = await this.generateDescription(product)
          results.set(product.id, content)
        })
      )
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise((r) => setTimeout(r, 1000))
      }
    }
    return results
  }

  async generateBlogOutline(topic: string, targetKeywords: string[]): Promise<BlogOutline> {
    if (!isConfigured('GEMINI_API_KEY')) {
      return {
        title: `Complete Guide: ${topic}`,
        metaDescription: `Everything you need to know about ${topic} for Indian shoppers.`,
        headings: [`What is ${topic}?`, `Best options for ${topic}`, `How to choose`, `FAQ`],
        suggestedProducts: [],
        estimatedWordCount: 1200,
      }
    }
    try {
      const prompt = `Create a blog post outline for an Indian price comparison website about: "${topic}". Target keywords: ${targetKeywords.join(', ')}. Return JSON with: title (string), metaDescription (string, 155 chars max), headings (array of 5-7 H2s), suggestedProducts (array of 3 product types to feature), estimatedWordCount (number). Return only valid JSON, no markdown.`
      const text = await callGemini(prompt, 800)
      const clean = text.replace(/```json|```/g, '').trim()
      return JSON.parse(clean)
    } catch {
      return {
        title: `Best ${topic} in India 2026`,
        metaDescription: `Compare prices and find the best ${topic} deals in India on CloudBasket.`,
        headings: [`Introduction to ${topic}`, `Top Products`, `Price Comparison`, `Buying Guide`, `FAQ`],
        suggestedProducts: [],
        estimatedWordCount: 1000,
      }
    }
  }
}

export const descriptionGenerator = new ProductDescriptionGenerator()

