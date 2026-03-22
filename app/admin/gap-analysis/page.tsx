import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'GAP Analysis — Admin | CloudBasket' }
const GAPS = [
  { area: 'Authentication', status: '⚠️', issue: 'Social OAuth not wired to Supabase Auth — needs GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID', priority: 'CRITICAL' },
  { area: 'Payments', status: '⚠️', issue: 'Razorpay test mode only — needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET in production', priority: 'CRITICAL' },
  { area: 'Email', status: '⚠️', issue: 'PLUNK_API_KEY not set — transactional emails disabled', priority: 'HIGH' },
  { area: 'CRM', status: '⚠️', issue: 'HUBSPOT_API_KEY + ZOHO_ACCESS_TOKEN not configured', priority: 'HIGH' },
  { area: 'POD Fulfillment', status: '⚠️', issue: 'PRINTIFY_API_KEY required for live order fulfillment', priority: 'HIGH' },
  { area: 'Push Notifications', status: '⚠️', issue: 'VAPID keys not generated — run: npx web-push generate-vapid-keys', priority: 'MEDIUM' },
  { area: 'Search', status: '✅', issue: 'India catalog search working — 1000 products indexed', priority: 'DONE' },
  { area: 'Affiliate Links', status: '✅', issue: 'Amazon + Flipkart + CJ routing working', priority: 'DONE' },
  { area: 'POD Pages', status: '✅', issue: 'E-set complete — Printify, Printful, Etsy, Shopify, Amazon Merch, Redbubble', priority: 'DONE' },
  { area: 'Supabase Local', status: '⚠️', issue: 'Using local Supabase — needs cloud project for production', priority: 'CRITICAL' },
]
const COLORS: Record<string, string> = { CRITICAL: 'bg-red-500/10 text-red-500', HIGH: 'bg-orange-500/10 text-orange-500', MEDIUM: 'bg-yellow-500/10 text-yellow-500', DONE: 'bg-green-500/10 text-green-500' }
export default function GapAnalysisPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">GAP Analysis & Missing Features Audit</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">F21 — Complete platform audit. Fix CRITICAL items before launch.</p>
      <div className="space-y-3">
        {GAPS.map((g, i) => (
          <div key={i} className="cb-card p-5 flex items-start gap-4">
            <span className="text-xl">{g.status}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><p className="font-black text-sm">{g.area}</p><span className={`cb-badge text-[9px] ${COLORS[g.priority]}`}>{g.priority}</span></div>
              <p className="text-sm text-[var(--cb-text-muted)]">{g.issue}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cb-card p-6 mt-8 bg-[var(--cb-surface-2)]">
        <h2 className="font-black mb-3">Pre-Launch Checklist</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['Set NEXT_PUBLIC_SUPABASE_URL to cloud project','Set RAZORPAY live keys','Set PLUNK_API_KEY','Generate VAPID keys','Set GOOGLE_CLIENT_ID for OAuth','Wire PRINTIFY_API_KEY','Set AMAZON_ASSOCIATE_TAG','Deploy to Vercel/Railway','Point cloudbasket.co DNS','Run pnpm build final check'].map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /><span>{item}</span></label>
          ))}
        </div>
      </div>
    </main>
  )
}