// services/pod/redbubble.ts
// Redbubble upload manager — metadata generation for marketplace listings.

import { env, isConfigured } from '@/lib/env'

export type RedbubbleMetadata = { title:string; tags:string[]; description:string; productTypes:string[]; defaultMedia:string }
export type RedbubbleImageValidation = { valid:boolean; issues:string[]; recommendations:string[]; estimatedPrintSizes:Record<string,string> }
export type BulkUploadPackage = { manifest:{designId:string;filename:string;metadata:RedbubbleMetadata}[]; totalDesigns:number; estimatedUploadTimeMinutes:number }

async function callGemini(prompt: string): Promise<string> {
  if (!isConfigured('GEMINI_API_KEY')) return ''
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.8,maxOutputTokens:400}})})
    return (await r.json())?.candidates?.[0]?.content?.parts?.[0]?.text||''
  } catch { return '' }
}

export class RedbubbleUploadManager {
  PRODUCT_TYPE_MAP: Record<string,string> = {'tshirt':'tshirts','mug':'mugs','phone-case':'iphone_cases android_cases','poster':'prints','hoodie':'hoodies','tote-bag':'totes'}

  async generateMetadata(designDescription: string): Promise<RedbubbleMetadata> {
    const fallback: RedbubbleMetadata = {
      title: `${designDescription.slice(0,80)} Design`,
      tags: designDescription.toLowerCase().split(' ').slice(0,15),
      description: `Unique ${designDescription.toLowerCase()} design available on multiple products. Perfect for gifting and everyday use.`,
      productTypes: Object.keys(this.PRODUCT_TYPE_MAP),
      defaultMedia: 'tshirts',
    }
    if (!isConfigured('GEMINI_API_KEY')) return fallback
    try {
      const tagsPrompt = `Generate exactly 15 Redbubble tags for design: "${designDescription}". Include: style, colors, occasion, subject, mood. Return as JSON array of strings only.`
      const tagsText = await callGemini(tagsPrompt)
      const tags = JSON.parse(tagsText.replace(/```json|```/g,'').trim())
      if (Array.isArray(tags)) fallback.tags = tags.slice(0,15)
    } catch { /* no-op */ }
    return fallback
  }

  validateImageForRedbubble(file: {name:string;size:number;type:string}): RedbubbleImageValidation {
    const issues: string[] = []; const recommendations: string[] = []
    if (file.size > 60*1024*1024) issues.push('File too large — max 60MB for Redbubble')
    if (file.type !== 'image/png') recommendations.push('Use PNG for transparent backgrounds')
    return {valid:issues.length===0,issues,recommendations,estimatedPrintSizes:{'t-shirt':'Front print ~25cm wide at 300DPI','poster':'A1 at 150DPI minimum'}}
  }

  generateBulkUploadPackage(designs: {id:string;name:string;metadata:RedbubbleMetadata}[]): BulkUploadPackage {
    return {
      manifest: designs.map(d=>({designId:d.id,filename:`${d.id}.png`,metadata:d.metadata})),
      totalDesigns: designs.length,
      estimatedUploadTimeMinutes: Math.ceil(designs.length * 2),
    }
  }
}

export const redbubbleManager = new RedbubbleUploadManager()

