interface EMIBadgeProps {
  price: number
}

export function EMIBadge({ price }: EMIBadgeProps) {
  if (price < 2000) return null
  const emi = Math.ceil(price / 12)

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 rounded px-2 py-1 w-fit">
      <span>💳</span>
      <span className="font-semibold">No Cost EMI from ₹{emi.toLocaleString('en-IN')}/mo</span>
    </div>
  )
}
