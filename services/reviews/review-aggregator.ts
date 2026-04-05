// services/reviews/review-aggregator.ts
// Aggregates product reviews from multiple sources.
// Stub-safe — returns mock reviews when API keys are not configured.

import { isConfigured } from '@/lib/env'

export interface Review {
  id: string
  productId: string
  productName: string
  source: 'amazon' | 'flipkart' | 'cloudbasket' | 'stub'
  rating: number // 1-5
  title: string
  body: string
  author: string
  verified: boolean
  helpful: number
  date: string // ISO
}

export interface AggregatedReviews {
  productId: string
  productName: string
  totalReviews: number
  averageRating: number
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>
  reviews: Review[]
  lastUpdated: string
}

function generateId(): string {
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function calcAverage(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

function calcBreakdown(
  reviews: Review[]
): Record<1 | 2 | 3 | 4 | 5, number> {
  const breakdown: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  }
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
    breakdown[key]++
  }
  return breakdown
}

// Stub reviews for when APIs are not configured
function stubReviews(productId: string, productName: string): Review[] {
  return [
    {
      id: generateId(),
      productId,
      productName,
      source: 'stub',
      rating: 5,
      title: 'Excellent product!',
      body: 'Really happy with this purchase. Great quality and fast delivery.',
      author: 'Rahul M.',
      verified: true,
      helpful: 24,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      productId,
      productName,
      source: 'stub',
      rating: 4,
      title: 'Good value for money',
      body: 'Works as described. Build quality is solid. Would recommend.',
      author: 'Priya S.',
      verified: true,
      helpful: 18,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      productId,
      productName,
      source: 'stub',
      rating: 4,
      title: 'Satisfied with purchase',
      body: 'Packaging was good. Product matches the description on the site.',
      author: 'Amit K.',
      verified: false,
      helpful: 9,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      productId,
      productName,
      source: 'stub',
      rating: 3,
      title: 'Average product',
      body: 'Decent but expected better finish. Delivery was on time though.',
      author: 'Sneha R.',
      verified: true,
      helpful: 5,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      productId,
      productName,
      source: 'stub',
      rating: 5,
      title: 'Best in this price range',
      body: 'Compared many options on CloudBasket. This was the best deal.',
      author: 'Vikram D.',
      verified: true,
      helpful: 31,
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

class ReviewAggregator {
  private isAmazonReady(): boolean {
    return isConfigured('AMAZON_ACCESS_KEY')
  }

  private isFlipkartReady(): boolean {
    return isConfigured('FLIPKART_AFFILIATE_ID')
  }

  // Fetch Amazon reviews (stub when not configured)
  private async fetchAmazonReviews(
    productId: string
  ): Promise<Review[]> {
    if (!this.isAmazonReady()) {
      console.warn('[ReviewAggregator] Amazon PA-API not configured — skipping')
      return []
    }
    try {
      // Wire real Amazon PA-API call here when credentials available
      console.warn('[ReviewAggregator] Amazon review fetch — stub (wire PA-API)')
      return []
    } catch (err) {
      console.warn('[ReviewAggregator] Amazon fetch error:', err)
      return []
    }
  }

  // Fetch Flipkart reviews (stub when not configured)
  private async fetchFlipkartReviews(
    productId: string
  ): Promise<Review[]> {
    if (!this.isFlipkartReady()) {
      console.warn('[ReviewAggregator] Flipkart not configured — skipping')
      return []
    }
    try {
      // Wire real Flipkart API call here when credentials available
      console.warn('[ReviewAggregator] Flipkart review fetch — stub (wire API)')
      return []
    } catch (err) {
      console.warn('[ReviewAggregator] Flipkart fetch error:', err)
      return []
    }
  }

  // Main aggregation method
  async aggregate(
    productId: string,
    productName: string
  ): Promise<AggregatedReviews> {
    try {
      const [amazonReviews, flipkartReviews] = await Promise.all([
        this.fetchAmazonReviews(productId),
        this.fetchFlipkartReviews(productId),
      ])

      let allReviews = [...amazonReviews, ...flipkartReviews]

      // Fall back to stubs if no real reviews available
      if (allReviews.length === 0) {
        allReviews = stubReviews(productId, productName)
      }

      // Sort by most helpful
      allReviews.sort((a, b) => b.helpful - a.helpful)

      return {
        productId,
        productName,
        totalReviews: allReviews.length,
        averageRating: calcAverage(allReviews),
        ratingBreakdown: calcBreakdown(allReviews),
        reviews: allReviews,
        lastUpdated: new Date().toISOString(),
      }
    } catch (err) {
      console.warn('[ReviewAggregator] Aggregation error:', err)
      const fallback = stubReviews(productId, productName)
      return {
        productId,
        productName,
        totalReviews: fallback.length,
        averageRating: calcAverage(fallback),
        ratingBreakdown: calcBreakdown(fallback),
        reviews: fallback,
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  // Aggregate reviews for multiple products
  async aggregateBatch(
    products: Array<{ id: string; name: string }>
  ): Promise<AggregatedReviews[]> {
    const results: AggregatedReviews[] = []
    for (const product of products) {
      const result = await this.aggregate(product.id, product.name)
      results.push(result)
    }
    return results
  }
}

export const reviewAggregator = new ReviewAggregator()


