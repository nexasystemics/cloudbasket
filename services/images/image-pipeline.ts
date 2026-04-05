// services/images/image-pipeline.ts
import { hasSupabase, env } from '@/lib/env'
export class ImagePipeline {
  async getOptimisedUrl(productId: string, width: 400 | 800 | 1200): Promise<string | null> {
    if (!hasSupabase()) return null
    try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY); const { data } = await sb.from('product_images').select(`size_${width}_url`).eq('product_id', productId).single(); return (data as any)?.[`size_${width}_url`] || null } catch { return null }
  }
  generatePlaceholderSVG(category: string): string {
    const colors: Record<string, string> = { electronics: '#1F4E79', fashion: '#9D174D', 'food-grocery': '#14532D', 'home-appliances': '#713F12', 'personal-care': '#831843' }
    return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${colors[category] || '#1F4E79'}"/><text x="200" y="210" font-family="sans-serif" font-size="48" fill="white" text-anchor="middle" opacity="0.5">${category.charAt(0).toUpperCase()}</text></svg>`).toString('base64')}`
  }
}
export const imagePipeline = new ImagePipeline()

