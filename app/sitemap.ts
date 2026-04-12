// app/sitemap.ts
// A18: Added brand page routes for all 10 India Catalog brands.
// A20: Added missing static routes.

import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-data'
import { CATALOG_PRODUCTS, CATEGORY_DEFINITIONS } from '@/lib/cloudbasket-data'
import { INDIA_CATALOG } from '@/lib/india-catalog'

const BASE_URL = 'https://cloudbasket.in'
const LAST_MODIFIED = new Date()

const INDIA_BRANDS = ['HUL', 'Dabur', 'ITC', 'Godrej', 'Bajaj', 'Havells', 'Philips', 'Prestige', 'boAt', 'Noise']

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/deals`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/best-deals`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/careers`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/pod`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/affiliate`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/associates`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/compare`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/deals/flash`, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/pod/tshirts`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/pod/mugs`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/pod/phone-cases`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/terms`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/cookies`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryRoutes = CATEGORY_DEFINITIONS.map(category => ({
    url: category.slug === 'pod' ? `${BASE_URL}/pod` : `${BASE_URL}/category/${category.slug}`,
    lastModified: LAST_MODIFIED, changeFrequency: 'daily' as const, priority: 0.8,
  }))

  const productRoutes = CATALOG_PRODUCTS.map(product => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: new Date(product.publishedAt),
    changeFrequency: 'weekly' as const, priority: 0.6,
  }))

  const indiaProductRoutes = INDIA_CATALOG.map(product => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: LAST_MODIFIED, changeFrequency: 'weekly' as const, priority: 0.6,
  }))

  // A18: Brand pages
  const brandRoutes = INDIA_BRANDS.map(brand => ({
    url: `${BASE_URL}/brand/${encodeURIComponent(brand)}`,
    lastModified: LAST_MODIFIED, changeFrequency: 'weekly' as const, priority: 0.7,
  }))

  const blogRoutes = BLOG_POSTS.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: LAST_MODIFIED, changeFrequency: 'weekly' as const, priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...indiaProductRoutes, ...brandRoutes, ...blogRoutes]
}
