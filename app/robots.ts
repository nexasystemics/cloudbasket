import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://cloudbasket.vercel.app/sitemap.xml',
    host: 'https://cloudbasket.vercel.app',
  }
}
