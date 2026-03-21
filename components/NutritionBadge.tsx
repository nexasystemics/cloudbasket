// components/NutritionBadge.tsx
// Displays nutriscore badge for food products.

const NUTRISCORE_CONFIG = {
  a: { bg: '#1a7a3c', label: 'A', text: 'Excellent' },
  b: { bg: '#5b9c2a', label: 'B', text: 'Good' },
  c: { bg: '#f5c518', label: 'C', text: 'Moderate' },
  d: { bg: '#e67e22', label: 'D', text: 'Poor' },
  e: { bg: '#c0392b', label: 'E', text: 'Bad' },
}

export default function NutritionBadge({ grade }: { grade: 'a' | 'b' | 'c' | 'd' | 'e' }) {
  const config = NUTRISCORE_CONFIG[grade] || NUTRISCORE_CONFIG.c
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[10px] font-black text-[var(--cb-text-muted)] uppercase tracking-widest">Nutri-Score</span>
      <div className="flex items-center rounded-lg overflow-hidden">
        {(['a', 'b', 'c', 'd', 'e'] as const).map(g => (
          <div key={g} style={{ backgroundColor: NUTRISCORE_CONFIG[g].bg }} className={`w-6 h-6 flex items-center justify-center text-white text-[10px] font-black ${g === grade ? 'w-8 h-8 text-xs' : 'opacity-40'}`}>
            {g.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}