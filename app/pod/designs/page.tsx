import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'CloudBasket Originals — Browse Designs', description: 'Browse all CloudBasket Originals POD designs. T-shirts, mugs, phone cases and more.' }
export default function DesignGalleryPage() {
  const designs = [{id:'sample-1',name:'Sunset Gradient',category:'tshirt',price:699},{id:'sample-2',name:'Mountain Minimal',category:'mug',price:399},{id:'sample-3',name:'Geometric Abstract',category:'phone-case',price:499}]
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">CloudBasket Originals</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Unique designs on premium products — printed on demand, shipped across India</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {designs.map(d=>(
          <Link key={d.id} href={`/pod/product/${d.id}`} className="cb-card p-4 hover:border-skyline-primary transition-colors">
            <div className="aspect-square bg-[var(--cb-surface-2)] rounded-xl mb-3 flex items-center justify-center"><span className="text-4xl">🎨</span></div>
            <p className="font-black text-sm truncate">{d.name}</p>
            <p className="text-xs text-[var(--cb-text-muted)]">{d.category}</p>
            <p className="text-sm font-black text-skyline-primary mt-1">₹{d.price}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}