// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/affiliate-disclosure/PrintButton.tsx
'use client'

export default function PrintButton({
  className,
  label,
}: {
  className: string
  label: string
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
    </button>
  )
}
