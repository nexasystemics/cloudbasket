'use client'

import dynamic from 'next/dynamic'

const FestivalBanner = dynamic(() => import('@/components/FestivalBanner'), {
  ssr: false,
  loading: () => <div className="min-h-12 w-full bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

export default function LayoutTopEnhancements() {
  return <FestivalBanner />
}
