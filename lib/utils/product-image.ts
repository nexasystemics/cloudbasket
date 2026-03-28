// lib/utils/product-image.ts
// FIXED: local /assets/products/ paths no longer exist in public/
// Treat them as missing and fall back to category CDN images

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'electronics':    'https://m.media-amazon.com/images/I/61QTGxoML2L._SX679_.jpg',
  'personal-care':  'https://m.media-amazon.com/images/I/61vNQL5DRWL._SX679_.jpg',
  'home-appliances':'https://m.media-amazon.com/images/I/71S3JZZ5TdL._SX679_.jpg',
  'fashion':        'https://m.media-amazon.com/images/I/71m1NxSZaEL._SX679_.jpg',
  'food-grocery':   'https://m.media-amazon.com/images/I/81Qy-zBnJDL._SX679_.jpg',
  'default':        'https://m.media-amazon.com/images/I/61QTGxoML2L._SX679_.jpg',
}

// Paths that look local but the files don't exist in public/
function isMissingLocalImage(image: string): boolean {
  return image.startsWith('/assets/products/')
}

export function getProductImage(
  image: string | undefined,
  category: string
): string {
  // No image provided
  if (!image) return CATEGORY_FALLBACK_IMAGES[category] ?? CATEGORY_FALLBACK_IMAGES['default']
  // External URL — use as-is
  if (image.startsWith('http')) return image
  // Local /assets/products/ paths — files don't exist, use CDN fallback
  if (isMissingLocalImage(image)) {
    return CATEGORY_FALLBACK_IMAGES[category] ?? CATEGORY_FALLBACK_IMAGES['default']
  }
  // Other local paths (placeholder.svg etc) — use as-is
  return image
}
