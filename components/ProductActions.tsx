'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import PriceAlertModal from '@/components/PriceAlertModal'

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
