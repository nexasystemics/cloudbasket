// F82: Mobile-First Performance
export function getOptimizedImageUrl(src: string, width: number, quality = 75): string {
  if (!src) return '/images/placeholder.jpg'
  if (src.startsWith('data:')) return src
  if (src.includes('_next/image')) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

export const RESPONSIVE_SIZES = { thumbnail: 64, card: 300, hero: 800, full: 1200 } as const

export function getImageSizes(variant: 'card' | 'hero' | 'thumbnail' | 'full'): string {
  const map = { thumbnail: '64px', card: '(max-width:640px) 50vw, (max-width:1024px) 33vw, 300px', hero: '(max-width:768px) 100vw, 800px', full: '100vw' }
  return map[variant]
}