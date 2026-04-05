export interface ComparisonProduct {
  id: string
  name: string
  brand: string
  imageUrl: string
  platform: 'amazon' | 'flipkart' | 'cj'
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  availability: boolean
  deliveryDays: number
  warranty: string
  specs: Record<string, string>
  affiliateUrl: string
  pros: string[]
  cons: string[]
}

export interface ComparisonResult {
  products: ComparisonProduct[]
  winner: string | null
  bestPrice: string | null
  bestRating: string | null
  fastestDelivery: string | null
  summary: string
  scorecard: ComparisonScorecard[]
}

export interface ComparisonScorecard {
  productId: string
  productName: string
  priceScore: number
  ratingScore: number
  deliveryScore: number
  valueScore: number
  totalScore: number
}

export interface ComparisonCategory {
  key: string
  label: string
  winner: string | null
  values: ComparisonCategoryValue[]
}

export interface ComparisonCategoryValue {
  productId: string
  value: string | number
  isWinner: boolean
}

function scorePrices(products: ComparisonProduct[]): Map<string, number> {
  const scores = new Map<string, number>()
  const minPrice = Math.min(...products.map((p) => p.price))
  const maxPrice = Math.max(...products.map((p) => p.price))
  const range = maxPrice - minPrice || 1

  for (const p of products) {
    const score = ((maxPrice - p.price) / range) * 100
    scores.set(p.id, Math.round(score))
  }

  return scores
}

function scoreRatings(products: ComparisonProduct[]): Map<string, number> {
  const scores = new Map<string, number>()
  const maxRating = Math.max(...products.map((p) => p.rating))

  for (const p of products) {
    const reviewBonus = Math.min(20, (p.reviewCount / 1000) * 5)
    const score = (p.rating / maxRating) * 80 + reviewBonus
    scores.set(p.id, Math.round(score))
  }

  return scores
}

function scoreDelivery(products: ComparisonProduct[]): Map<string, number> {
  const scores = new Map<string, number>()
  const minDays = Math.min(...products.map((p) => p.deliveryDays))
  const maxDays = Math.max(...products.map((p) => p.deliveryDays))
  const range = maxDays - minDays || 1

  for (const p of products) {
    const availBonus = p.availability ? 10 : 0
    const score = ((maxDays - p.deliveryDays) / range) * 90 + availBonus
    scores.set(p.id, Math.round(score))
  }

  return scores
}

export function compareProducts(products: ComparisonProduct[]): ComparisonResult {
  if (products.length === 0) {
    return {
      products: [],
      winner: null,
      bestPrice: null,
      bestRating: null,
      fastestDelivery: null,
      summary: 'No products to compare.',
      scorecard: [],
    }
  }

  const priceScores = scorePrices(products)
  const ratingScores = scoreRatings(products)
  const deliveryScores = scoreDelivery(products)

  const scorecard: ComparisonScorecard[] = products.map((p) => {
    const priceScore = priceScores.get(p.id) ?? 0
    const ratingScore = ratingScores.get(p.id) ?? 0
    const deliveryScore = deliveryScores.get(p.id) ?? 0
    const valueScore = Math.round((p.discount / 100) * 100)
    const totalScore = Math.round(
      priceScore * 0.4 + ratingScore * 0.35 + deliveryScore * 0.15 + valueScore * 0.1
    )

    return {
      productId: p.id,
      productName: p.name,
      priceScore,
      ratingScore,
      deliveryScore,
      valueScore,
      totalScore,
    }
  })

  const winner = scorecard.reduce((best, s) =>
    s.totalScore > best.totalScore ? s : best
  )

  const bestPrice = products.reduce((min, p) => (p.price < min.price ? p : min))
  const bestRating = products.reduce((max, p) => (p.rating > max.rating ? p : max))
  const fastestDelivery = products.reduce((min, p) =>
    p.deliveryDays < min.deliveryDays ? p : min
  )

  const priceDiff = Math.max(...products.map((p) => p.price)) - bestPrice.price
  const summary = [
    `${winner.productName} scores highest overall (${winner.totalScore}/100) with the best balance of price and quality.`,
    `${bestPrice.name} offers the lowest price at ₹${bestPrice.price.toLocaleString('en-IN')}`,
    priceDiff > 0 ? ` — saving ₹${priceDiff.toLocaleString('en-IN')} vs the most expensive option.` : '.',
  ].join('')

  return {
    products,
    winner: winner.productId,
    bestPrice: bestPrice.id,
    bestRating: bestRating.id,
    fastestDelivery: fastestDelivery.id,
    summary,
    scorecard,
  }
}

export function buildComparisonCategories(
  products: ComparisonProduct[]
): ComparisonCategory[] {
  if (products.length === 0) return []

  const categories: ComparisonCategory[] = []

  // Price
  const minPrice = Math.min(...products.map((p) => p.price))
  categories.push({
    key: 'price',
    label: 'Price',
    winner: products.find((p) => p.price === minPrice)?.id ?? null,
    values: products.map((p) => ({
      productId: p.id,
      value: `₹${p.price.toLocaleString('en-IN')}`,
      isWinner: p.price === minPrice,
    })),
  })

  // Rating
  const maxRating = Math.max(...products.map((p) => p.rating))
  categories.push({
    key: 'rating',
    label: 'Rating',
    winner: products.find((p) => p.rating === maxRating)?.id ?? null,
    values: products.map((p) => ({
      productId: p.id,
      value: `${p.rating}/5 (${p.reviewCount.toLocaleString()} reviews)`,
      isWinner: p.rating === maxRating,
    })),
  })

  // Delivery
  const minDays = Math.min(...products.map((p) => p.deliveryDays))
  categories.push({
    key: 'delivery',
    label: 'Delivery',
    winner: products.find((p) => p.deliveryDays === minDays)?.id ?? null,
    values: products.map((p) => ({
      productId: p.id,
      value: p.deliveryDays === 1 ? 'Tomorrow' : `${p.deliveryDays} days`,
      isWinner: p.deliveryDays === minDays,
    })),
  })

  // Warranty
  categories.push({
    key: 'warranty',
    label: 'Warranty',
    winner: null,
    values: products.map((p) => ({
      productId: p.id,
      value: p.warranty,
      isWinner: false,
    })),
  })

  // Discount
  const maxDiscount = Math.max(...products.map((p) => p.discount))
  categories.push({
    key: 'discount',
    label: 'Discount',
    winner: products.find((p) => p.discount === maxDiscount)?.id ?? null,
    values: products.map((p) => ({
      productId: p.id,
      value: `${p.discount}% off`,
      isWinner: p.discount === maxDiscount,
    })),
  })

  // Availability
  categories.push({
    key: 'availability',
    label: 'In Stock',
    winner: null,
    values: products.map((p) => ({
      productId: p.id,
      value: p.availability ? 'In Stock' : 'Out of Stock',
      isWinner: p.availability,
    })),
  })

  // Dynamic specs from first product (up to 5)
  const specKeys = Object.keys(products[0]?.specs ?? {}).slice(0, 5)
  for (const key of specKeys) {
    categories.push({
      key: `spec_${key}`,
      label: key,
      winner: null,
      values: products.map((p) => ({
        productId: p.id,
        value: p.specs[key] ?? '—',
        isWinner: false,
      })),
    })
  }

  return categories
}

export function getWinnerHighlights(result: ComparisonResult): string[] {
  const highlights: string[] = []
  const winner = result.products.find((p) => p.id === result.winner)
  const bestPriceProduct = result.products.find((p) => p.id === result.bestPrice)

  if (winner) {
    highlights.push(`🏆 Best overall: ${winner.name}`)
  }
  if (bestPriceProduct) {
    highlights.push(`💰 Best price: ${bestPriceProduct.name} at ₹${bestPriceProduct.price.toLocaleString('en-IN')}`)
  }

  const fastestProduct = result.products.find((p) => p.id === result.fastestDelivery)
  if (fastestProduct) {
    const label = fastestProduct.deliveryDays === 1 ? 'tomorrow' : `in ${fastestProduct.deliveryDays} days`
    highlights.push(`🚚 Fastest delivery: ${fastestProduct.name} (${label})`)
  }

  return highlights
}
