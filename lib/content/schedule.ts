// lib/content/schedule.ts
// Content generation schedule configuration.

export const CONTENT_SCHEDULE = {
  buyingGuides: 'weekly',
  dealAlerts: 'daily',
  brandReviews: 'biweekly',
  comparisons: 'weekly',
} as const

export const BLOG_CATEGORIES = ['buying-guide', 'deal-alert', 'product-review', 'brand-spotlight', 'how-to'] as const