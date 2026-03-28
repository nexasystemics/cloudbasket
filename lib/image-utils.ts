// lib/image-utils.ts
// FIXED: /assets/products/ paths are local-only and don't exist in public/
// They now fall back to category CDN images instead of crashing the server

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'electronics':    'https://m.media-amazon.com/images/I/61QTGxoML2L._SX679_.jpg',
  'personal-care':  'https://m.media-amazon.com/images/I/61vNQL5DRWL._SX679_.jpg',
  'home-appliances':'https://m.media-amazon.com/images/I/71S3JZZ5TdL._SX679_.jpg',
  'fashion':        'https://m.media-amazon.com/images/I/71m1NxSZaEL._SX679_.jpg',
  'food-grocery':   'https://m.media-amazon.com/images/I/81Qy-zBnJDL._SX679_.jpg',
  'default':        'https://m.media-amazon.com/images/I/61QTGxoML2L._SX679_.jpg',
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  electronics:        '#1F4E79',
  mobiles:            '#1D4ED8',
  laptops:            '#1e40af',
  fashion:            '#9D174D',
  footwear:           '#92400E',
  home:               '#78350F',
  'home-appliances':  '#713F12',
  beauty:             '#831843',
  'personal-care':    '#9D174D',
  sports:             '#14532D',
  books:              '#1E3A5F',
  toys:               '#7C3AED',
  gaming:             '#4C1D95',
  cameras:            '#1C1917',
  'food-grocery':     '#14532D',
  audio:              '#0F172A',
}

/**
 * Returns true for local paths that reference files which don't exist
 * in the public/ directory (i.e. /assets/products/ which was never populated)
 */
function isMissingLocalImage(url: string): boolean {
  return url.startsWith('/assets/products/')
}

export function getProductImageUrl(
  imageUrl: string | undefined | null,
  category?: string,
  size: 'thumbnail' | 'card' | 'detail' | 'og' = 'card'
): string {
  const cat = category ?? 'electronics'

  // Empty / missing
  if (!imageUrl || imageUrl.trim() === '') {
    return CATEGORY_FALLBACK_IMAGES[cat] ?? CATEGORY_FALLBACK_IMAGES['default']
  }

  // External URL — use as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // FIXED: local /assets/products/ paths don't exist — use CDN fallback
  if (isMissingLocalImage(imageUrl)) {
    return CATEGORY_FALLBACK_IMAGES[cat] ?? CATEGORY_FALLBACK_IMAGES['default']
  }

  // Other local paths that actually exist (placeholder.svg, pod-*.svg etc)
  if (imageUrl.startsWith('/')) return imageUrl

  return CATEGORY_FALLBACK_IMAGES[cat] ?? CATEGORY_FALLBACK_IMAGES['default']
}

export function getPlaceholderImage(category: string): string {
  const normalised = category.toLowerCase().replace(/\s+/g, '-')
  // Use real existing placeholder files
  if (normalised in CATEGORY_GRADIENTS) return '/assets/placeholder.svg'
  return '/assets/placeholder.svg'
}

export function generateBlurDataUrl(hex: string): string {
  const color = hex.replace('#', '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="#${color}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export function getImageSizes(
  context: 'grid' | 'detail' | 'hero' | 'thumbnail'
): string {
  switch (context) {
    case 'grid':      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
    case 'detail':    return '(max-width: 1024px) 100vw, 50vw'
    case 'hero':      return '100vw'
    case 'thumbnail': return '80px'
    default:          return '(max-width: 768px) 100vw, 50vw'
  }
}
