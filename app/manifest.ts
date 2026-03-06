import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'CloudBasket',
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#039BE5',
    orientation: 'portrait',
    icons: [
      { src: '/brand/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    categories: ['shopping', 'finance', 'utilities'],
    lang: 'en-IN',
  }
}
