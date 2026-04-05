// services/pod/ai-design-generator.ts
// AI-powered POD design generation — DALL-E 3 + Stability AI.

import { env, isConfigured } from '@/lib/env'

export type DesignStyle = 'minimalist'|'vintage'|'geometric'|'watercolor'|'line-art'|'bold-graphic'|'typography'|'illustrative'
export type GeneratedDesign = { id:string; originalUrl:string; transparentUrl?:string; upscaledUrl?:string; prompt:string; style:string; generator:string; generatedAt:Date; readyForPrint:boolean }

function buildPrompt(userPrompt: string, style: DesignStyle): string {
  const styleMap: Record<DesignStyle,string> = {
    minimalist:'clean minimal flat design, simple lines, white space',
    vintage:'retro vintage grunge texture, aged look, classic typography',
    geometric:'geometric shapes, bold angles, mathematical patterns',
    watercolor:'soft watercolor wash, hand-painted texture, flowing colors',
    'line-art':'fine line art, single line drawing, elegant contours',
    'bold-graphic':'bold graphic design, high contrast, street art style',
    typography:'text-based design, creative typography, lettering art',
    illustrative:'detailed illustration, character design, storybook style',
  }
  return `${userPrompt}, ${styleMap[style]} style, transparent background preferred, print-ready design, high contrast, clean edges, commercial use, isolated design element, centered composition, suitable for t-shirt and merchandise printing, professional quality`
}

export class AIDesignGenerator {
  async generateWithDALLE3(prompt: string, style: DesignStyle): Promise<GeneratedDesign|null> {
    if (!isConfigured('OPENAI_API_KEY')) { console.warn('[AIDesign] OPENAI_API_KEY not configured'); return null }
    try {
      const r = await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.OPENAI_API_KEY}`},body:JSON.stringify({model:'dall-e-3',prompt:buildPrompt(prompt,style),size:'1024x1024',quality:'hd',n:1,response_format:'url'})})
      if (!r.ok) { console.warn('[AIDesign] DALL-E error:', r.status); return null }
      const json = await r.json()
      const url = json.data?.[0]?.url
      if (!url) return null
      const id = Math.random().toString(36).substring(2)
      return {id,originalUrl:url,prompt,style,generator:'dall-e-3',generatedAt:new Date(),readyForPrint:false}
    } catch (err) { console.warn('[AIDesign] Error:', err); return null }
  }

  async generateWithStabilityAI(prompt: string, negativePrompt?: string): Promise<GeneratedDesign[]> {
    if (!isConfigured('STABILITY_API_KEY')) return []
    try {
      const r = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',{method:'POST',headers:{Authorization:`Bearer ${env.STABILITY_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({text_prompts:[{text:prompt,weight:1},{text:negativePrompt||'watermark, text, blurry, low quality, distorted',weight:-1}],cfg_scale:7,height:1024,width:1024,samples:4,steps:30})})
      if (!r.ok) return []
      const json = await r.json()
      return (json.artifacts||[]).map((a:any,i:number)=>({id:Math.random().toString(36).substring(2),originalUrl:`data:image/png;base64,${a.base64}`,prompt,style:'illustrative',generator:'stability-ai',generatedAt:new Date(),readyForPrint:false}))
    } catch { return [] }
  }

  async removeBackground(imageUrl: string): Promise<string|null> {
    if (!isConfigured('REMOVE_BG_API_KEY')) return null
    try {
      const form = new FormData(); form.append('image_url',imageUrl); form.append('size','auto')
      const r = await fetch('https://api.remove.bg/v1.0/removebg',{method:'POST',headers:{'X-Api-Key':env.REMOVE_BG_API_KEY},body:form})
      if (!r.ok) return null
      const buf = await r.arrayBuffer()
      return `data:image/png;base64,${Buffer.from(buf).toString('base64')}`
    } catch { return null }
  }
}

export const aiDesignGenerator = new AIDesignGenerator()

