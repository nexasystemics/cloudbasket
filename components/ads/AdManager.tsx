'use client'
// components/ads/AdManager.tsx
// Orchestrates all AdSense placements across a page.

import { usePathname } from 'next/navigation'
import { getPlacementsForRoute } from '@/lib/adsense/placement-engine'
import AdUnit from './AdUnit'

export default function AdManager() {
  const pathname = usePathname()
  const placements = getPlacementsForRoute(pathname)
  const limited = placements.slice(0, 3) // max 3 ads per page globally

  return (
    <>
      {limited.map((placement) => (
        <AdUnit key={placement.id} slotId={placement.slotId} format={placement.format} />
      ))}
    </>
  )
}
