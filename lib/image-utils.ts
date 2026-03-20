// lib/image-utils.ts
// Image URL resolution and placeholder generation for CloudBasket

const CATEGORY_GRADIENTS: Record<string, string> = {
  electronics: '#1F4E79',
  mobiles: '#1D4ED8',
  laptops: '#1e40af',
  fashion: '#9D174D',
  footwear: '#92400E',
  home: '#78350F',
  'home-appliances': '#713F12',
  beauty: '#831843',
  'personal-care': '#9D174D',
  sports: '#14532D',
  books: '#1E3A5F',
  toys: '#7C3AED',
  gaming: '#4C1D95',
  cameras: '#1C1917',
  'food-grocery': '#14532D',
  audio: '#0F172A',
}

export function getProductImageUrl(
  imageUrl: string | undefined | null,
  category?: string,
  size: 'thumbnail' | 'card' | 'detail' | 'og' = 'card'
): string {
  if (!imageUrl || imageUrl.trim() === '') return getPlaceholderImage(category ?? 'electronics')
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  if (imageUrl.startsWith('/')) return imageUrl
  return getPlaceholderImage(category ?? 'electronics')
}

export function getPlaceholderImage(category: string): string {
  const normalised = category.toLowerCase().replace(/\s+/g, '-')
  if (normalised in CATEGORY_GRADIENTS) return `/assets/placeholders/${normalised}.svg`
  return `/assets/placeholders/electronics.svg`
}

export function generateBlurDataUrl(hex: string): string {
  const color = hex.replace('#', '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="#${color}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export function getImageSizes(context: 'grid' | 'detail' | 'hero' | 'thumbnail'): string {
  switch (context) {
    case 'grid': return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
    case 'detail': return '(max-width: 1024px) 100vw, 50vw'
    case 'hero': return '100vw'
    case 'thumbnail': return '80px'
    default: return '(max-width: 768px) 100vw, 50vw'
  }
}