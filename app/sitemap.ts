import type { MetadataRoute } from 'next'

const BASE_URL = 'https://cloudbasket.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/products',
    '/categories',
    '/deals',
    '/deals/flash',
    '/compare',
    '/blog',
    '/about',
    '/contact',
    '/careers',
    '/associates',
    '/pod',
    '/pod/tshirts',
    '/pod/mugs',
    '/pod/phone-cases',
    '/pod/posters',
    '/pod/hoodies',
    '/pod/tote-bags',
    '/cj',
    '/search',
    '/faq',
    '/affiliate-disclosure',
    '/legal/privacy',
    '/legal/terms',
    '/cookies',
    '/api/feed/google',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '/' ? 1 : 0.8,
  }))

  const categoryRoutes = [
    'mobiles',
    'laptops',
    'fashion',
    'home',
    'beauty',
    'sports',
    'toys',
    'grocery',
    'automotive',
    'books',
  ].map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryRoutes]
}
