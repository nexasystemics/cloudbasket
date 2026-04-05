// services/pod/amazon-merch.ts
// Amazon Merch on Demand — semi-automated workflow (no public API).

import { env, isConfigured } from '@/lib/env'

export type AmazonMerchProductType = 'standard-t-shirt'|'premium-t-shirt'|'pullover-hoodie'|'sweatshirt'|'tank-top'|'long-sleeve-shirt'|'raglan'|'phone-case'|'tote-bag'|'throw-pillow'|'pop-socket'

export type AmazonMerchSubmission = {
  title: string; brandName: string; description: string
  bulletPoints: string[]; keywords: string[]; colorVariants: string[]
  priceRecommendation: number; fitType?: string; department?: string
}

export type ValidationResult = { valid: boolean; errors: string[]; score: number }

const PROHIBITED_WORDS = ['nike','adidas','supreme','gucci','prada','louis vuitton','copyright','trademark','®','™']
const PRICE_RANGES: Record<string, [number,number]> = {
  'standard-t-shirt':[599,2999],'premium-t-shirt':[799,3999],'pullover-hoodie':[1299,5999],
  'phone-case':[499,1999],'tote-bag':[699,2499]
}

async function callGemini(prompt: string): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) return ''
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:500}})})
    const json = await r.json()
    return json?.candidates?.[0]?.content?.parts?.[0]?.text||''
  } catch { return '' }
}

export class AmazonMerchService {
  async generateSubmission(designDescription: string, productType: AmazonMerchProductType): Promise<AmazonMerchSubmission> {
    const fallback: AmazonMerchSubmission = {
      title: `${designDescription.slice(0,50)} | ${productType.replace(/-/g,' ')}`,
      brandName: 'CloudBasket Originals',
      description: `Premium quality ${productType.replace(/-/g,' ')} featuring unique ${designDescription.toLowerCase()} design. Perfect gift for all occasions.`,
      bulletPoints: ['Premium quality print','Comfortable fit for everyday wear','Unique original design','Machine washable','Great gift idea'],
      keywords: designDescription.toLowerCase().split(' ').slice(0,7),
      colorVariants: ['Black','White','Navy Blue','Heather Grey'],
      priceRecommendation: PRICE_RANGES[productType]?.[0]||999,
    }

    if (!isConfigured('GEMINI_API_KEY')) return fallback

    try {
      const titlePrompt = `Generate an Amazon product title for a custom ${productType} with design: "${designDescription}". Under 60 chars. Format: {Style} {Theme} {ProductType} - {Feature}. Return only the title.`
      const title = (await callGemini(titlePrompt)).trim().slice(0,60)
      if (title) fallback.title = title

      const bulletsPrompt = `Write 5 benefit-focused bullet points for Amazon listing of ${productType} with design: "${designDescription}". Each bullet max 200 chars. Return as JSON array.`
      const bulletsText = await callGemini(bulletsPrompt)
      try { const bullets = JSON.parse(bulletsText.replace(/```json|```/g,'').trim()); if (Array.isArray(bullets)) fallback.bulletPoints = bullets.slice(0,5) } catch { /* no-op */ }
    } catch { /* no-op */ }

    return fallback
  }

  validateForAmazon(submission: AmazonMerchSubmission): ValidationResult {
    const errors: string[] = []
    if (submission.title.length > 60) errors.push(`Title too long: ${submission.title.length} chars (max 60)`)
    if (submission.description.length > 4000) errors.push('Description too long (max 4000 chars)')
    if (submission.keywords.length > 7) errors.push('Too many keywords (max 7)')
    const lower = (submission.title + submission.description).toLowerCase()
    PROHIBITED_WORDS.forEach(w => { if (lower.includes(w)) errors.push(`Prohibited word: "${w}"`) })
    const score = Math.max(0, 100 - errors.length * 20)
    return {valid:errors.length===0,errors,score}
  }

  generateCSVBulkUpload(submissions: AmazonMerchSubmission[]): string {
    const header = 'Title,BrandName,Description,Bullet1,Bullet2,Bullet3,Bullet4,Bullet5,Keywords,Marketplace,Price'
    const rows = submissions.map(s => [s.title,s.brandName,s.description,...s.bulletPoints.slice(0,5),s.keywords.join(' '),'www.amazon.in',s.priceRecommendation].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))
    return [header,...rows].join('\n')
  }
}

export const amazonMerchService = new AmazonMerchService()

