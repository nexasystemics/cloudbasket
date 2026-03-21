const CFG = { a: { bg: '#1a7a3c', label: 'A' }, b: { bg: '#5b9c2a', label: 'B' }, c: { bg: '#f5c518', label: 'C' }, d: { bg: '#e67e22', label: 'D' }, e: { bg: '#c0392b', label: 'E' } }
export default function NutritionBadge({ grade }: { grade: 'a'|'b'|'c'|'d'|'e' }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[10px] font-black text-[var(--cb-text-muted)] uppercase">Nutri-Score</span>
      <div className="flex items-center rounded-lg overflow-hidden">
        {(['a','b','c','d','e'] as const).map(g => <div key={g} style={{ backgroundColor: CFG[g].bg }} className={`flex items-center justify-center text-white text-[10px] font-black ${g === grade ? 'w-8 h-8 text-xs' : 'w-6 h-6 opacity-40'}`}>{g.toUpperCase()}</div>)}
      </div>
    </div>
  )
}