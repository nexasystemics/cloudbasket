// services/associates/program.ts
import { hasSupabase, env } from '@/lib/env'
export type AssociateApplication = { name: string; email: string; websiteUrl: string; platformType: string; niche: string }
export class AssociateProgramService {
  generateTrackingCode(): string { return 'CB' + Math.random().toString(36).substring(2, 10).toUpperCase() }
  generateTrackingUrl(trackingCode: string, targetPath: string): string { return `${env.NEXT_PUBLIC_SITE_URL}${targetPath}?ref=${trackingCode}` }
  async applyForProgram(app: AssociateApplication): Promise<{ id: string; status: string; trackingCode: string }> {
    const trackingCode = this.generateTrackingCode()
    if (!hasSupabase()) { try { localStorage.setItem('cb_associate_application', JSON.stringify({ ...app, trackingCode, status: 'pending', appliedAt: new Date().toISOString() })) } catch { /* no-op */ }; return { id: trackingCode, status: 'pending', trackingCode } }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      await sb.from('associates').insert({ ...app, tracking_code: trackingCode, status: 'pending', applied_at: new Date().toISOString(), commission_rate: 0.03 })
      return { id: trackingCode, status: 'pending', trackingCode }
    } catch { return { id: trackingCode, status: 'pending', trackingCode } }
  }
}
export const associateProgram = new AssociateProgramService()

