'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Bell } from 'lucide-react'

const PriceAlertModal = dynamic(() => import('@/components/PriceAlertModal'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" aria-hidden="true">
      <div className="cb-card min-h-[320px] w-full max-w-md bg-[var(--cb-surface)]" />
    </div>
  ),
})

interface ProductActionsProps {
  productName: string
  currentPrice: number
}

export default function ProductActions({ productName, currentPrice }: ProductActionsProps) {
  const [showAlert, setShowAlert] = useState<boolean>(false)

  return (
    <>
      <button type="button" className="cb-btn cb-btn-ghost gap-2" onClick={() => setShowAlert(true)}>
        <Bell size={16} />
        Price Alert
      </button>
      {showAlert ? (
        <PriceAlertModal
          productName={productName}
          currentPrice={currentPrice}
          onClose={() => setShowAlert(false)}
        />
      ) : null}
    </>
  )
}
