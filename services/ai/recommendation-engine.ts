// services/ai/recommendation-engine.ts
// D20: Product Recommendation AI — Gemini powered, stub-safe

import { isConfigured } from '@/lib/env'

export type RecommendationInput = {
  userId?: string
  productId?: string
  category?: string
  priceRange?: { min: number; max: number }
  recentlyViewed?: string[]
  wishlist?: string[]
}

export type RecommendedProduct = {
  productId: string
  score: number
  reason: string
  source: 'ai' | 'rule' | 'trending'
}

export type RecommendationResult = {
  recommendations: RecommendedProduct[]
  generatedAt: string
  source: 'gemini' | 'fallback'
}

const FALLBACK_RECOMMENDATIONS: RecommendedProduct[] = [
  { productId: 'IN-ELEC-001', score: 0.95, reason: 'Trending in Electronics', source: 'trending' },
  { productId: 'IN-FASH-001', score: 0.88, reason: 'Popular in Fashion', source: 'trending' },
  { productId: 'IN-HOME-001', score: 0.82, reason: 'Best seller in Home', source: 'rule' },
  { productId: 'IN-GROC-001', score: 0.79, reason: 'Frequently bought together', source: 'rule' },
  { productId: 'IN-SPRT-001', score: 0.74, reason: 'Similar to your interests', source: 'rule' },
]

class RecommendationEngine {
  private isGeminiReady(): boolean {
    return isConfigured('GEMINI_API_KEY')
  }

  private buildPrompt(input: RecommendationInput): string {
    return `You are a product recommendation engine for CloudBasket, India's price comparison platform.

User context:
- Category interest: ${input.category ?? 'general'}
- Price range: ${input.priceRange ? `₹${input.priceRange.min}–₹${input.priceRange.max}` : 'any'}
- Recently viewed product IDs: ${input.recentlyViewed?.join(', ') ?? 'none'}
- Wishlist product IDs: ${input.wishlist?.join(', ') ?? 'none'}

Return a JSON array of 5 recommended product IDs with scores and reasons.
Format: [{"productId":"...","score":0.95,"reason":"...","source":"ai"}]
Only return the JSON array, nothing else.`
  }

  async getRecommendations(input: RecommendationInput): Promise<RecommendationResult> {
    const generatedAt = new Date().toISOString()

    if (!this.isGeminiReady()) {
      console.warn('[recommendation-engine] Gemini not configured — using fallback recommendations')
      return { recommendations: FALLBACK_RECOMMENDATIONS, generatedAt, source: 'fallback' }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: this.buildPrompt(input) }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
          }),
        }
      )

      if (!response.ok) {
        console.warn('[recommendation-engine] Gemini API error:', response.status)
        return { recommendations: FALLBACK_RECOMMENDATIONS, generatedAt, source: 'fallback' }
      }

      const data = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
      const clean = text.replace(/```json|```/g, '').trim()
      const recommendations = JSON.parse(clean) as RecommendedProduct[]

      return { recommendations, generatedAt, source: 'gemini' }
    } catch (err) {
      console.warn('[recommendation-engine] Gemini call failed:', err)
      return { recommendations: FALLBACK_RECOMMENDATIONS, generatedAt, source: 'fallback' }
    }
  }

  async getSimilarProducts(productId: string, limit = 5): Promise<RecommendedProduct[]> {
    const result = await this.getRecommendations({ productId })
    return result.recommendations.slice(0, limit)
  }

  async getPersonalized(userId: string, recentlyViewed: string[]): Promise<RecommendationResult> {
    return this.getRecommendations({ userId, recentlyViewed })
  }
}

export const recommendationEngine = new RecommendationEngine()
