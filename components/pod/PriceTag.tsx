// components/pod/PriceTag.tsx
// POD product price tag with GST inclusive note.

interface PriceTagProps { basePrice: number; productType: string; showGST?: boolean; showComparison?: boolean; competitorPrice?: number; competitorName?: string }

export default function PriceTag({ basePrice, productType, showGST = true, showComparison = false, competitorPrice, competitorName = 'Redbubble' }: PriceTagProps) {
  const gstRate = 0.18
  const gstPrice = showGST ? Math.round(basePrice * (1 + gstRate)) : basePrice
  const savings = competitorPrice ? competitorPrice - gstPrice : 0

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black">₹{gstPrice.toLocaleString('en-IN')}</span>
        {showGST && <span className="text-xs text-[var(--cb-text-muted)]">incl. GST</span>}
      </div>
      {showComparison && competitorPrice && savings > 0 && (
        <p className="text-xs text-green-500 mt-0.5">Save ₹{savings.toLocaleString('en-IN')} vs {competitorName}</p>
      )}
    </div>
  )
}