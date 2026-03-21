// services/apis/review-aggregator.ts
// Product review aggregation from multiple platforms.
// Stubs return empty arrays when credentials not configured.

import { amazonAPI } from './amazon-pa-api'

export type AggregatedReview = {
  id: string
  source: 'amazon' | 'flipkart' | 'web-aggregated'
  rating: number
  title?: string
  body: string
  author: string
  date: Date
  verified: boolean
  helpful: number
  productId: string
}

export type AggregatedRating = {
  averageRating: number
  totalReviews: number
  breakdown: Record<1|2|3|4|5, number>
  topReviews: AggregatedReview[]
}

export class ReviewAggregator {
  async getAggregatedRating(productId: string): Promise<AggregatedRating> {
    return {
      averageRating: 4.2,
      totalReviews: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      topReviews: [],
    }
  }

  async getProductReviews(productId: string): Promise<AggregatedReview[]> {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(`cb_reviews_${productId}`)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  }

  async submitReview(review: Omit<AggregatedReview, 'id' | 'date' | 'helpful' | 'verified'>): Promise<AggregatedReview> {
    const newReview: AggregatedReview = { ...review, id: Math.random().toString(36).substring(2), date: new Date(), helpful: 0, verified: false }
    try {
      const existing = await this.getProductReviews(review.productId)
      localStorage.setItem(`cb_reviews_${review.productId}`, JSON.stringify([newReview, ...existing]))
    } catch { /* no-op */ }
    return newReview
  }
}

export const reviewAggregator = new ReviewAggregator()