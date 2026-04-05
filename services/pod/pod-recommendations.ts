// E28: POD Product Recommendation Engine (AI-powered)
import { env, isConfigured } from '@/lib/env'

export type DesignRecommendation = { designId: string; score: number; reasons: string[]; targetAudience: string; bestPlatforms: string[]; suggestedPrice: number }

export async function getAIRecommendations(designDescription: string, category: string): Promise<DesignRecommendation[]> {
  const fallback: DesignRecommendation[] = [
    { designId: 'rec-1', score: 92, reasons: ['High search volume for this theme', 'Low competition on Redbubble', 'Trending on Pinterest'], targetAudience: 'Age 18-35, urban, fashion-conscious', bestPlatforms: ['Redbubble', 'Etsy', 'Amazon Merch'], suggestedPrice: 799 },
    { designId: 'rec-2', score: 78, reasons: ['Seasonal demand spike expected', 'Good margin potential'], targetAudience: 'Gift buyers, age 25-45', bestPlatforms: ['Etsy', 'Amazon Merch'], suggestedPrice: 599 },
  ]
  if (!isConfigured('GEMINI_API_KEY')) return fallback
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are a POD market analyst. For design: "${designDescription}" in category "${category}", provide 3 product recommendations as JSON array. Each item: {designId, score (0-100), reasons (array of 3 strings), targetAudience, bestPlatforms (array), suggestedPrice (INR)}. Return only valid JSON, no markdown.` }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 800 } })
    })
    const json = await r.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return Array.isArray(parsed) ? parsed : fallback
  } catch { return fallback }
}


