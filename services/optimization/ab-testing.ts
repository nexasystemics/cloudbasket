export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed'
export type VariantWeight = number // 0–100, all variants must sum to 100

export interface ExperimentVariant {
  id: string
  name: string
  description: string
  weight: VariantWeight
  config: Record<string, string | number | boolean>
}

export interface Experiment {
  id: string
  name: string
  description: string
  hypothesis: string
  targetMetric: 'click_rate' | 'conversion_rate' | 'revenue' | 'bounce_rate' | 'session_duration'
  status: ExperimentStatus
  variants: ExperimentVariant[]
  startedAt?: string
  endedAt?: string
  createdAt: string
  pageUrl?: string
  trafficPercent: number // 0–100 % of total traffic included in experiment
  minimumSampleSize: number
}

export interface ExperimentResult {
  experimentId: string
  variantId: string
  sessions: number
  conversions: number
  conversionRate: number
  revenue: number
  avgSessionDuration: number
  bounceRate: number
  isWinner: boolean
  confidenceLevel: number // 0–100
  uplift: number // % change vs control
}

export interface AssignedVariant {
  experimentId: string
  variantId: string
  variantConfig: Record<string, string | number | boolean>
}

export interface ExperimentSummary {
  experiment: Experiment
  results: ExperimentResult[]
  winner: ExperimentResult | null
  isStatisticallySignificant: boolean
  totalSessions: number
  runningDays: number
}

// Deterministic variant assignment using userId hash
function hashUserId(userId: string, experimentId: string): number {
  const str = `${experimentId}:${userId}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash) % 100
}

export function assignVariant(
  experiment: Experiment,
  userId: string
): AssignedVariant | null {
  if (experiment.status !== 'running') return null

  const userBucket = hashUserId(userId, experiment.id)

  // Check if user is in traffic percentage
  if (userBucket >= experiment.trafficPercent) return null

  // Assign to variant based on weights
  let cumulative = 0
  const scaledBucket = (userBucket / experiment.trafficPercent) * 100

  for (const variant of experiment.variants) {
    cumulative += variant.weight
    if (scaledBucket < cumulative) {
      return {
        experimentId: experiment.id,
        variantId: variant.id,
        variantConfig: variant.config,
      }
    }
  }

  // Fallback to last variant
  const last = experiment.variants[experiment.variants.length - 1]
  return last
    ? { experimentId: experiment.id, variantId: last.id, variantConfig: last.config }
    : null
}

export function calculateConfidence(
  controlConversions: number,
  controlSessions: number,
  variantConversions: number,
  variantSessions: number
): number {
  if (controlSessions === 0 || variantSessions === 0) return 0

  const p1 = controlConversions / controlSessions
  const p2 = variantConversions / variantSessions
  const pooled = (controlConversions + variantConversions) / (controlSessions + variantSessions)
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / controlSessions + 1 / variantSessions))

  if (se === 0) return 0

  const z = Math.abs(p2 - p1) / se

  // Approximate confidence from z-score
  if (z >= 2.576) return 99
  if (z >= 1.96) return 95
  if (z >= 1.645) return 90
  if (z >= 1.282) return 80
  return Math.round(z * 30)
}

export function summariseExperiment(
  experiment: Experiment,
  results: ExperimentResult[]
): ExperimentSummary {
  const totalSessions = results.reduce((sum, r) => sum + r.sessions, 0)

  const startedAt = experiment.startedAt ? new Date(experiment.startedAt) : null
  const runningDays = startedAt
    ? Math.ceil((Date.now() - startedAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const control = results[0]
  const significantResults = results.filter((r) => r.confidenceLevel >= 95)
  const isStatisticallySignificant = significantResults.length > 0

  let winner: ExperimentResult | null = null
  if (isStatisticallySignificant && results.length > 1) {
    winner = results
      .slice(1)
      .filter((r) => r.confidenceLevel >= 95 && r.uplift > 0)
      .sort((a, b) => b.uplift - a.uplift)[0] ?? null
  }

  const enrichedResults = results.map((r, i) => {
    const uplift =
      i === 0 || !control || control.conversionRate === 0
        ? 0
        : ((r.conversionRate - control.conversionRate) / control.conversionRate) * 100

    const confidence =
      i === 0 || !control
        ? 100
        : calculateConfidence(
            control.conversions,
            control.sessions,
            r.conversions,
            r.sessions
          )

    return { ...r, uplift: Math.round(uplift * 10) / 10, confidenceLevel: confidence }
  })

  return {
    experiment,
    results: enrichedResults,
    winner,
    isStatisticallySignificant,
    totalSessions,
    runningDays,
  }
}

export function validateExperiment(experiment: Partial<Experiment>): string[] {
  const errors: string[] = []

  if (!experiment.name?.trim()) errors.push('Experiment name is required')
  if (!experiment.hypothesis?.trim()) errors.push('Hypothesis is required')
  if (!experiment.variants || experiment.variants.length < 2) {
    errors.push('At least 2 variants (control + 1) are required')
  }

  if (experiment.variants && experiment.variants.length >= 2) {
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 100) > 0.1) {
      errors.push(`Variant weights must sum to 100 (currently ${totalWeight})`)
    }
  }

  if (
    typeof experiment.trafficPercent === 'number' &&
    (experiment.trafficPercent <= 0 || experiment.trafficPercent > 100)
  ) {
    errors.push('Traffic percent must be between 1 and 100')
  }

  return errors
}

export function createExperimentDefaults(
  partial: Partial<Experiment> = {}
): Experiment {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    hypothesis: '',
    targetMetric: 'conversion_rate',
    status: 'draft',
    trafficPercent: 50,
    minimumSampleSize: 1000,
    createdAt: now,
    variants: [
      {
        id: crypto.randomUUID(),
        name: 'Control',
        description: 'Original version',
        weight: 50,
        config: {},
      },
      {
        id: crypto.randomUUID(),
        name: 'Variant A',
        description: 'Test version',
        weight: 50,
        config: {},
      },
    ],
    ...partial,
  }
}
