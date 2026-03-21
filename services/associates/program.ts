// services/associates/program.ts
// Associates program backend — tracking, approvals, commissions.

import { hasSupabase, env } from '@/lib/env'

export type AssociateApplication = {
  name: string; email: string; websiteUrl: string; platformType: string
  monthlyTraffic: string; niche: string; source: string
}

export class AssociateProgramService {
  generateTrackingCode(): string {
    return 'CB' + Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  generateTrackingUrl(trackingCode: string, targetPath: string): string {
    return `${env.NEXT_PUBLIC_SITE_URL}${targetPath}?ref=${trackingCode}`
  }

  async applyForProgram(application: AssociateApplication): Promise<{ id: string; status: string; trackingCode: string }> {
    const trackingCode = this.generateTrackingCode()
    if (!hasSupabase()) {
      try { localStorage.setItem('cb_associate_application', JSON.stringify({ ...application, trackingCode, status: 'pending', appliedAt: new Date().toISOString() })) } catch { /* no-op */ }
      return { id: trackingCode, status: 'pending', trackingCode }
    }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      const { data, error } = await supabase.from('associates').insert({ ...application, tracking_code: trackingCode, status: 'pending', applied_at: new Date().toISOString(), commission_rate: 0.03 }).select().single()
      if (error) throw error
      return { id: data.id, status: 'pending', trackingCode }
    } catch { return { id: trackingCode, status: 'pending', trackingCode } }
  }

  async trackAssociateClick(trackingCode: string, productId: string, sourceUrl: string): Promise<void> {
    if (!hasSupabase()) return
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      const { data: associate } = await supabase.from('associates').select('id').eq('tracking_code', trackingCode).single()
      if (associate) await supabase.from('associate_clicks').insert({ associate_id: associate.id, product_id: productId, source_url: sourceUrl, clicked_at: new Date().toISOString(), converted: false })
    } catch { /* no-op */ }
  }
}

export const associateProgram = new AssociateProgramService()