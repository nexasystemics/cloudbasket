// services/social/content-generator.ts
// AI-powered social media content generation.
import { env, isConfigured } from '@/lib/env'
export type SocialPost = { id: string; platform: 'instagram' | 'twitter' | 'whatsapp'; content: string; hashtags?: string[]; status: 'draft'; generatedAt: Date }
async function callGemini(prompt: string): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) return ''
  try { const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 500 } }) }); return (await r.json())?.candidates?.[0]?.content?.parts?.[0]?.text || '' } catch { return '' }
}
export class SocialContentGenerator {
  async generateInstagramCaption(productName: string, price: number, dealPercent: number, brand: string): Promise<SocialPost> {
    const fallback = `🔥 DEAL ALERT!\n\n${productName} by ${brand} is now ${dealPercent}% OFF!\n💰 Only ₹${price.toLocaleString('en-IN')}\n\n✅ Compare on CloudBasket\n🔗 Link in bio\n\n#CloudBasket #BestDealsIndia #${brand.replace(/\s/g, '')} #PriceComparison #IndiaDeals`
    let content = fallback
    if (isConfigured('GEMINI_API_KEY')) { const ai = await callGemini(`Write Instagram caption for: ${productName} by ${brand} at ${dealPercent}% off, now ₹${price}. 10 hashtags, Indian audience. Include #CloudBasket`); if (ai) content = ai }
    return { id: `ig-${Date.now()}`, platform: 'instagram', content, hashtags: content.match(/#\w+/g) || [], status: 'draft', generatedAt: new Date() }
  }
  generateTweetThread(deals: { title: string; price: number; discount: number }[]): SocialPost[] {
    return [{ id: `tw-0`, platform: 'twitter', content: `🔥 Today's top ${deals.length} deals on CloudBasket 🧵👇`, status: 'draft', generatedAt: new Date() }, ...deals.slice(0, 5).map((d, i) => ({ id: `tw-${i + 1}`, platform: 'twitter' as const, content: `${i + 1}/ 🛍️ ${d.title.slice(0, 60)}\n💰 ₹${d.price.toLocaleString('en-IN')} (${d.discount}% OFF)\n🔗 cloudbasket.in/deals\n#CloudBasket`, status: 'draft' as const, generatedAt: new Date() }))]
  }
  generateWhatsAppStatus(title: string, discount: number, price: number): string { return `🔥 ${title.slice(0, 50)} - ${discount}% OFF! Now ₹${price.toLocaleString('en-IN')} | cloudbasket.in/deals`.slice(0, 140) }
}
export const socialGenerator = new SocialContentGenerator()