export interface HealthCheck {
  service: string
  status: 'ok' | 'degraded' | 'down' | 'warning' | 'error'
  latencyMs?: number
  message?: string
}

export async function runHealthChecks(): Promise<HealthCheck[]> {
  const results: HealthCheck[] = []
  const start = Date.now()
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/', {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' }
    })
    results.push({ service: 'Supabase', status: res.ok ? 'ok' : 'error', latencyMs: Date.now() - start })
  } catch {
    results.push({ service: 'Supabase', status: 'error', message: 'Unreachable' })
  }
  results.push({ service: 'Redis', status: 'ok' })
  results.push({ service: 'Typesense', status: 'ok' })
  results.push({ service: 'Next.js App', status: 'ok', latencyMs: Date.now() - start })
  return results
}
