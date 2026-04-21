'use client'
// components/ABTest.tsx
// A/B test wrapper — renders assigned variant, tracks view on mount.

import { useEffect, useState } from 'react'
import { getVariant, trackConversion } from '@/lib/ab-testing'

interface ABTestProps {
  testId: string
  variants: { id: string; component: React.ReactNode }[]
}

export default function ABTest({ testId, variants }: ABTestProps) {
  const [variantId, setVariantId] = useState(variants[0]?.id || '')

  useEffect(() => {
    const assigned = getVariant(testId, variants.map(v => v.id))
    setVariantId(assigned)
    trackConversion(testId, assigned, 'view')
  }, [testId, variants])

  const variant = variants.find(v => v.id === variantId) || variants[0]
  return <>{variant?.component}</>
}
