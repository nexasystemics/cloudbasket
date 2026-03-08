import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CloudBasket — Best Deals in India',
    short_name: 'CloudBasket',
    description: "India's smartest price comparison and deal discovery",
    start_url: '/',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#039BE5',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    categories: ['shopping', 'lifestyle'],
    lang: 'en-IN',
    shortcuts: [
      { name: 'Flash Deals', url: '/deals/flash', description: "Today's flash deals" },
      { name: 'Compare Products', url: '/compare', description: 'Compare products side by side' },
    ],
  }
}
