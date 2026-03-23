const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'electronics': 'https://m.media-amazon.com/images/I/61QTGxoML2L._SX679_.jpg',
  'personal-care': 'https://m.media-amazon.com/images/I/61vNQL5DRWL._SX679_.jpg',
  'home-appliances': 'https://m.media-amazon.com/images/I/71S3JZZ5TdL._SX679_.jpg',
  'fashion': 'https://m.media-amazon.com/images/I/71m1NxSZaEL._SX679_.jpg',
  'food-grocery': 'https://m.media-amazon.com/images/I/81Qy-zBnJDL._SX679_.jpg',
  'default': 'https://m.media-amazon.com/images/I/61QTGxoML2L._SX679_.jpg',
}

export function getProductImage(
  image: string | undefined,
  category: string
): string {
  if (image && image.startsWith('http')) return image
  return CATEGORY_FALLBACK_IMAGES[category] ?? CATEGORY_FALLBACK_IMAGES['default']
}
