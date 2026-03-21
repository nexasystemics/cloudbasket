import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Print Quality — Admin | CloudBasket' }
export default function PrintQualityPage() {
  const grades = [{grade:'A',count:0,color:'text-green-500'},{grade:'B',count:0,color:'text-blue-500'},{grade:'C',count:0,color:'text-yellow-500'},{grade:'D',count:0,color:'text-orange-500'},{grade:'F',count:0,color:'text-red-500'}]
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Print Quality Dashboard</h1>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {grades.map(g=><div key={g.grade} className="cb-card p-5 text-center"><p className={`text-4xl font-black ${g.color}`}>{g.grade}</p><p className="text-2xl font-black mt-1">{g.count}</p><p className="text-xs text-[var(--cb-text-muted)]">designs</p></div>)}
      </div>
      <div className="cb-card p-8 text-center"><p className="text-[var(--cb-text-muted)]">Upload designs to analyse print quality. Requirements: min 3000×3000px, RGB/PNG, max 25MB.</p></div>
    </main>
  )
}