'use client'
// components/RecentlySaved.tsx
// Shows social proof count seeded by productId.

function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) { h = Math.imul(31, h) + str.charCodeAt(i) | 0 }
  return Math.abs(h)
}

export default function RecentlySaved({ productId }: { productId: string }) {
  const count = (hashCode(productId) % 450) + 50
  return (
    <div className="flex items-center gap-1.5 text-sm text-[var(--cb-text-muted)]">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span><strong className="text-[var(--cb-text-primary)]">{count.toLocaleString('en-IN')}</strong> people saved this deal today</span>
    </div>
  )
}
