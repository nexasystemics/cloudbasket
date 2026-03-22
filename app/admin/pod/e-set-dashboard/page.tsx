// E50: Complete System Handoff Documentation
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'E-Set System Docs — CloudBasket Admin' }
const E_SET_DOCS = [
  { code: 'E01', name: 'Bulk Image Upload Engine', file: 'services/pod/bulk-upload-engine.ts', status: '✅', apiKey: 'None — client-side' },
  { code: 'E02', name: 'Printify API', file: 'services/pod/printify.ts', status: '✅', apiKey: 'PRINTIFY_API_KEY' },
  { code: 'E03', name: 'Printful API', file: 'services/pod/printful.ts', status: '✅', apiKey: 'PRINTFUL_API_KEY' },
  { code: 'E04', name: 'Etsy OAuth2', file: 'services/pod/etsy.ts', status: '✅', apiKey: 'ETSY_API_KEY + ETSY_SHARED_SECRET' },
  { code: 'E05', name: 'Shopify API', file: 'services/pod/shopify.ts', status: '✅', apiKey: 'SHOPIFY_ADMIN_TOKEN' },
  { code: 'E06', name: 'Amazon Merch', file: 'services/pod/amazon-merch.ts', status: '✅', apiKey: 'None — manual upload' },
  { code: 'E07', name: 'Redbubble Manager', file: 'services/pod/redbubble.ts', status: '✅', apiKey: 'None — manual upload' },
  { code: 'E08', name: 'Cross-Platform Sync', file: 'services/pod/cross-platform-sync.ts', status: '✅', apiKey: 'Supabase' },
  { code: 'E09', name: 'AI Design Generator', file: 'services/pod/ai-design-generator.ts', status: '✅', apiKey: 'OPENAI_API_KEY + STABILITY_API_KEY' },
  { code: 'E10', name: 'Design Library', file: 'services/pod/design-library.ts', status: '✅', apiKey: 'Supabase Storage' },
  { code: 'E21', name: 'Seasonal Campaigns', file: 'services/pod/seasonal-campaigns.ts', status: '✅', apiKey: 'GEMINI_API_KEY (optional)' },
  { code: 'E23', name: 'Bundle Creator', file: 'services/pod/bundle-creator.ts', status: '✅', apiKey: 'Supabase' },
  { code: 'E24', name: 'Gift Cards', file: 'services/pod/gift-cards.ts', status: '✅', apiKey: 'Supabase + Razorpay' },
  { code: 'E28', name: 'AI Recommendations', file: 'services/pod/pod-recommendations.ts', status: '✅', apiKey: 'GEMINI_API_KEY' },
  { code: 'E29', name: 'Bulk Title Generator', file: 'services/pod/bulk-title-generator.ts', status: '✅', apiKey: 'GEMINI_API_KEY' },
  { code: 'E38', name: 'Redis Cache', file: 'lib/cache/redis.ts', status: '✅', apiKey: 'UPSTASH_REDIS_URL + TOKEN' },
]
export default function ESetDocsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">E-Set System Documentation</h1>
      <div className="cb-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[var(--cb-border)]">{['Code','Service','File','API Key Required','Status'].map(h => <th key={h} className="p-4 text-left font-black">{h}</th>)}</tr></thead>
          <tbody>{E_SET_DOCS.map(d => (
            <tr key={d.code} className="border-b border-[var(--cb-border)]">
              <td className="p-4 font-mono font-bold">{d.code}</td>
              <td className="p-4 font-bold">{d.name}</td>
              <td className="p-4 font-mono text-xs text-[var(--cb-text-muted)]">{d.file}</td>
              <td className="p-4 text-xs">{d.apiKey}</td>
              <td className="p-4">{d.status}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </main>
  )
}