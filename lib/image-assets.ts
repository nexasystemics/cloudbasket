export const IMAGE_ASSETS = {
  brandMark: '/brand/logo-small.svg',
  placeholder: '/assets/placeholder.svg',
  noImage: '/assets/no-image.webp',
  pod: {
    tshirts: '/assets/pod-tshirts.svg',
    mugs: '/assets/pod-mugs.svg',
    'phone-cases': '/assets/pod-phone-cases.svg',
    posters: '/assets/pod-posters.svg',
    hoodies: '/assets/pod-hoodies.svg',
    'tote-bags': '/assets/pod-tote-bags.svg',
    'laptop-bags': '/assets/pod-laptop-bags.svg',
  },
} as const

export function resolveImageSource(src: string | null | undefined, fallback: string = IMAGE_ASSETS.placeholder): string {
  if (typeof src !== 'string') {
    return fallback
  }

  const normalized = src.trim()
  return normalized.length > 0 ? normalized : fallback
}
