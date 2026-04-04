// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/grievance-officer/PrintButton.tsx
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
