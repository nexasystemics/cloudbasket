'use client'

import dynamic from 'next/dynamic'

interface ProductPageClientWidgetsProps {
  productId: string
  productName: string
  currentPrice: number
}

const SocialProofWidget = dynamic(() => import('@/components/SocialProof'), {
  ssr: false,
  loading: () => <div className="mt-4 min-h-20 rounded-[var(--cb-radius-card)] bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

const ProductActions = dynamic(() => import('@/components/ProductActions'), {
  ssr: false,
  loading: () => <div className="min-h-10 min-w-32 rounded-full bg-[var(--cb-surface-2)]" aria-hidden="true" />,
})

export default function ProductPageClientWidgets({ productId, productName, currentPrice }: ProductPageClientWidgetsProps) {
  return (
    <>
      <div className="min-h-20">
        <SocialProofWidget productId={productId} className="mt-4" />
      </div>
      <ProductActions productName={productName} currentPrice={currentPrice} />
    </>
  )
}
