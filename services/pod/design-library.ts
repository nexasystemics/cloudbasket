// services/pod/design-library.ts
// POD design library — asset management and storage.

import { hasSupabase, env } from '@/lib/env'

export type PODDesignInput = { name:string; description?:string; category:string; theme:string; style:string; tags?:string[] }
export type PODDesign = PODDesignInput & { id:string; imageUrl:string; thumbnailUrl:string; approved:boolean; createdAt:Date; platforms:{} }

export class DesignLibraryService {
  async addDesign(design: PODDesignInput, imageUrl: string): Promise<PODDesign|null> {
    if (!hasSupabase()) return null
    try {
      const {createClient} = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      const id = `design-${Date.now()}-${Math.random().toString(36).substring(2)}`
      const {data,error} = await sb.from('pod_designs').insert({id,...design,image_url:imageUrl,thumbnail_url:imageUrl,approved:false,platforms:{},created_at:new Date().toISOString()}).select().single()
      if (error) throw error
      return {...design,id,imageUrl,thumbnailUrl:imageUrl,approved:false,createdAt:new Date(),platforms:{}}
    } catch { return null }
  }

  async searchDesigns(query: {text?:string;category?:string;theme?:string;approved?:boolean}): Promise<PODDesign[]> {
    if (!hasSupabase()) return []
    try {
      const {createClient} = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      let q = sb.from('pod_designs').select('*')
      if (query.category) q = q.eq('category',query.category)
      if (query.approved !== undefined) q = q.eq('approved',query.approved)
      if (query.text) q = q.ilike('name',`%${query.text}%`)
      const {data} = await q.order('created_at',{ascending:false}).limit(50)
      return (data||[]).map((d:any)=>({id:d.id,name:d.name||d.design_name,description:d.description,category:d.category,theme:d.theme,style:d.style,tags:d.tags,imageUrl:d.image_url,thumbnailUrl:d.thumbnail_url,approved:d.approved,createdAt:new Date(d.created_at),platforms:d.platforms||{}}))
    } catch { return [] }
  }

  async approveDesign(designId: string): Promise<void> {
    if (!hasSupabase()) return
    try {
      const {createClient} = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      await sb.from('pod_designs').update({approved:true,approved_at:new Date().toISOString()}).eq('id',designId)
    } catch { /* no-op */ }
  }
}

export const designLibrary = new DesignLibraryService()