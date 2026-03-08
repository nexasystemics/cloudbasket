import type { Product } from './catalog'
import type { UserProfile } from './profile'

export interface ScoredProduct extends Product {
  personalScore: number
  matchReasons: string[]
}

const WEIGHTS = {
  festival: 0.3,
  lifeSituation: 0.25,
  season: 0.2,
  location: 0.15,
  behavior: 0.08,
  priceMatch: 0.02,
} as const

export function scoreProduct(product: Product, profile: UserProfile): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  const festMatch = product.tags.filter((tag) => profile.activeFestivals.includes(tag))
  if (festMatch.length > 0) {
    score += (WEIGHTS.festival * Math.min(festMatch.length, 3)) / 3
    reasons.push(`Festival: ${festMatch[0]}`)
  }

  const situMatch = product.tags.filter((tag) => profile.lifeSituations.includes(tag))
  if (situMatch.length > 0) {
    score += (WEIGHTS.lifeSituation * Math.min(situMatch.length, 3)) / 3
    reasons.push(`Situation: ${situMatch[0]}`)
  }

  if (product.tags.includes(profile.season)) {
    score += WEIGHTS.season
    reasons.push(`Season: ${profile.season}`)
  }

  const locMatch = product.tags.filter((tag) => profile.locationSignals.includes(tag))
  if (locMatch.length > 0) {
    score += (WEIGHTS.location * Math.min(locMatch.length, 2)) / 2
    reasons.push(`Region: ${locMatch[0]}`)
  }

  if (profile.preferredCategories.includes(product.category)) {
    const rank = profile.preferredCategories.indexOf(product.category)
    score += WEIGHTS.behavior * (1 - rank / 10)
    reasons.push(`Your interest: ${product.category}`)
  }

  if (profile.searchHistory.some((term) => product.name.toLowerCase().includes(term.toLowerCase()))) {
    score += WEIGHTS.behavior * 0.5
    reasons.push('Matches your search')
  }

  if (product.priceRange === profile.priceRange) {
    score += WEIGHTS.priceMatch
    reasons.push('In your budget')
  }

  if (profile.timeOfDay === 'night' && product.tags.includes('impulse_buy')) score += 0.05
  if (profile.dayType === 'weekend' && product.tags.includes('leisure')) score += 0.03

  return { score: Math.min(score, 1), reasons }
}

export function personalizeProducts(allProducts: Product[], profile: UserProfile, count: number = 48): ScoredProduct[] {
  const scored = allProducts.map((product) => {
    const { score, reasons } = scoreProduct(product, profile)
    return { ...product, personalScore: score, matchReasons: reasons }
  })

  scored.sort((a, b) => b.personalScore - a.personalScore)

  const seenSubCats = new Set<string>()
  const deduped: ScoredProduct[] = []

  for (const product of scored) {
    const key = `${product.category}-${product.subCategory}`
    if (!seenSubCats.has(key)) {
      seenSubCats.add(key)
      deduped.push(product)
    }
    if (deduped.length >= count) break
  }

  if (deduped.length < count) {
    for (const product of scored) {
      if (!deduped.find((picked) => picked.id === product.id)) {
        deduped.push(product)
        if (deduped.length >= count) break
      }
    }
  }

  return deduped.slice(0, count)
}
