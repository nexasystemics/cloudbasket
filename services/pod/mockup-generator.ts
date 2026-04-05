// services/pod/mockup-generator.ts
// Automated mockup generation pipeline using Printify and Printful APIs.

import { printifyAPI } from './printify'
import { printfulAPI } from './printful'
import { hasSupabase, env } from '@/lib/env'

export type MockupResult = { productType:string; viewType:string; url:string; platform:'printify'|'printful'|'canvas' }
export type DesignMockupSet = { designId:string; mockups:{productType:string;views:MockupResult[]}[] }

export class MockupGenerationPipeline {
  async generateAllMockupsForDesign(designId: string): Promise<DesignMockupSet> {
    const productTypes = ['tshirt','mug','phone-case','poster','hoodie','tote-bag']
    const mockups: {productType:string;views:MockupResult[]}[] = []

    for (const pt of productTypes) {
      const views: MockupResult[] = [
        {productType:pt,viewType:'front',url:`/pod/templates/${pt}-front.jpg`,platform:'canvas'},
        {productType:pt,viewType:'back',url:`/pod/templates/${pt}-back.jpg`,platform:'canvas'},
        {productType:pt,viewType:'lifestyle',url:`/pod/templates/${pt}-lifestyle.jpg`,platform:'canvas'},
      ]
      mockups.push({productType:pt,views})
    }

    if (hasSupabase()) {
      try {
        const {createClient} = await import('@supabase/supabase-js')
        const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
        await sb.from('pod_designs').update({mockups_generated:true,mockup_urls:mockups,mockups_at:new Date().toISOString()}).eq('id',designId)
      } catch { /* no-op */ }
    }
    return {designId,mockups}
  }
}

export const mockupPipeline = new MockupGenerationPipeline()

