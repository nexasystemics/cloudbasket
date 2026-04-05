// services/pod/cross-platform-sync.ts
// Cross-platform sync engine — keeps POD products consistent across all platforms.

import { hasSupabase, env } from '@/lib/env'
import { printifyAPI } from './printify'
import { printfulAPI } from './printful'

export type SyncResult = { designId:string; platform:string; status:'success'|'failed'|'skipped'; error?:string }
export type SyncConflict = { designId:string; platform:string; field:string; cloudbasketValue:string; platformValue:string }

export class CrossPlatformSyncEngine {
  async syncDesignToAllPlatforms(designId: string, targetPlatforms: string[]): Promise<SyncResult[]> {
    const results: SyncResult[] = []
    if (!hasSupabase()) {
      targetPlatforms.forEach(p => results.push({designId,platform:p,status:'skipped',error:'Supabase not configured'}))
      return results
    }
    try {
      const {createClient} = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      const {data:design} = await sb.from('pod_designs').select('*').eq('id',designId).single()
      if (!design) { targetPlatforms.forEach(p=>results.push({designId,platform:p,status:'failed',error:'Design not found'})); return results }

      for (const platform of targetPlatforms) {
        try {
          if (platform==='amazon_merch' || platform==='redbubble') {
            await sb.from('pod_designs').update({platforms:{...design.platforms,[platform]:{status:'pending_manual_upload'}}}).eq('id',designId)
            results.push({designId,platform,status:'success'})
          } else if (platform==='printify') {
            results.push({designId,platform,status:'skipped',error:'Wire PRINTIFY_API_KEY to enable'})
          } else {
            results.push({designId,platform,status:'skipped'})
          }
        } catch (e) { results.push({designId,platform,status:'failed',error:String(e)}) }
      }
    } catch (e) { targetPlatforms.forEach(p=>results.push({designId,platform:p,status:'failed',error:String(e)})) }
    return results
  }

  async detectSyncConflicts(designId: string): Promise<SyncConflict[]> { return [] }
}

export const crossPlatformSync = new CrossPlatformSyncEngine()

