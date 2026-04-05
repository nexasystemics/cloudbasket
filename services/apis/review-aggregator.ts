// services/apis/review-aggregator.ts
// Product review aggregation from multiple platforms.

export type AggregatedReview = { id: string; source: 'amazon' | 'flipkart' | 'internal'; rating: number; title?: string; body: string; author: string; date: Date; verified: boolean; helpful: number; productId: string }

export class ReviewAggregator {
  async getProductReviews(productId: string): Promise<AggregatedReview[]> {
    try { const s = localStorage.getItem(`cb_reviews_${productId}`); return s ? JSON.parse(s) : [] } catch { return [] }
  }
  async submitReview(review: Omit<AggregatedReview, 'id' | 'date' | 'helpful' | 'verified'>): Promise<AggregatedReview> {
    const n: AggregatedReview = { ...review, id: Math.random().toString(36).substring(2), date: new Date(), helpful: 0, verified: false }
    try { const e = await this.getProductReviews(review.productId); localStorage.setItem(`cb_reviews_${review.productId}`, JSON.stringify([n, ...e])) } catch { /* no-op */ }
    return n
  }
  async getAggregatedRating(productId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const reviews = await this.getProductReviews(productId)
    return { averageRating: reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0, totalReviews: reviews.length }
  }
}
export const reviewAggregator = new ReviewAggregator()

