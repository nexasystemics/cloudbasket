'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

const SIZES = [
  { size: 'XS', chestIn: '86–91', waistIn: '71–76', chest: '34–36', waist: '28–30' },
  { size: 'S', chestIn: '91–97', waistIn: '76–81', chest: '36–38', waist: '30–32' },
  { size: 'M', chestIn: '97–102', waistIn: '81–86', chest: '38–40', waist: '32–34' },
  { size: 'L', chestIn: '102–107', waistIn: '86–91', chest: '40–42', waist: '34–36' },
  { size: 'XL', chestIn: '107–112', waistIn: '91–97', chest: '42–44', waist: '36–38' },
  { size: 'XXL', chestIn: '112–117', waistIn: '97–102', chest: '44–46', waist: '38–40' },
]

export default function SizeGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black">Size Guide</h2>
          <button type="button" onClick={onClose} aria-label="Close size guide"><X size={20} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--cb-border)]">
                {['Size', 'Chest (cm)', 'Waist (cm)', 'Chest (in)', 'Waist (in)'].map((h) => (
                  <th key={h} className="py-2 px-3 text-left text-[10px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((row) => (
                <tr key={row.size} className="border-b border-[var(--cb-border)]/50 hover:bg-[var(--cb-surface-2)]">
                  <td className="py-2 px-3 font-black">{row.size}</td>
                  <td className="py-2 px-3">{row.chestIn}</td>
                  <td className="py-2 px-3">{row.waistIn}</td>
                  <td className="py-2 px-3">{row.chest}</td>
                  <td className="py-2 px-3">{row.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-[var(--cb-text-muted)]">Measurements are approximate. When in doubt, size up.</p>
      </div>
    </div>
  )
}