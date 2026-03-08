interface CODBadgeProps {
  platform: 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'
}

export function CODBadge({ platform }: CODBadgeProps) {
  const supportsCOD = platform === 'amazon' || platform === 'flipkart'
  if (!supportsCOD) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#F5C842] bg-[#F5C842]/10 border border-[#F5C842]/20 rounded px-2 py-1 w-fit">
      <span>📦</span>
      <span className="font-semibold">Cash on Delivery Available</span>
    </div>
  )
}
