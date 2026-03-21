'use client'
// components/pod/MockupViewer.tsx
// Interactive mockup viewer for POD product pages.

import { useState } from 'react'
import { ZoomIn } from 'lucide-react'

const PRODUCT_TYPES = [{id:'tshirt',label:'T-Shirt'},{id:'mug',label:'Mug'},{id:'phone-case',label:'Phone Case'},{id:'poster',label:'Poster'},{id:'hoodie',label:'Hoodie'},{id:'tote-bag',label:'Tote Bag'}]
const VIEWS = ['front','back','angle','lifestyle']
const COLORS = [{id:'white',hex:'#FFFFFF',label:'White'},{id:'black',hex:'#000000',label:'Black'},{id:'navy',hex:'#1F4E79',label:'Navy'},{id:'grey',hex:'#9CA3AF',label:'Grey'}]

interface MockupViewerProps { designId: string; designImageUrl?: string }

export default function MockupViewer({ designId, designImageUrl }: MockupViewerProps) {
  const [productType, setProductType] = useState('tshirt')
  const [view, setView] = useState('front')
  const [color, setColor] = useState('white')
  const [zoomed, setZoomed] = useState(false)

  const mockupUrl = designImageUrl || `/pod/templates/${productType}-${view}-${color}.jpg`

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-[var(--cb-surface-2)] rounded-2xl overflow-hidden group">
        <img src={mockupUrl} alt={`${productType} ${view} mockup`} className="w-full h-full object-contain" />
        <button type="button" onClick={()=>setZoomed(true)} className="absolute top-3 right-3 cb-btn cb-btn-ghost p-2 opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={16}/></button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {VIEWS.map(v=><button key={v} type="button" onClick={()=>setView(v)} className={`cb-btn text-xs flex-shrink-0 ${view===v?'cb-btn-primary':'cb-btn-ghost'}`}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}
      </div>

      <div className="flex gap-2 flex-wrap">
        {COLORS.map(c=><button key={c.id} type="button" onClick={()=>setColor(c.id)} title={c.label} className={`w-8 h-8 rounded-full border-2 transition-all ${color===c.id?'border-skyline-primary scale-110':'border-[var(--cb-border)]'}`} style={{backgroundColor:c.hex}} />)}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PRODUCT_TYPES.map(p=><button key={p.id} type="button" onClick={()=>setProductType(p.id)} className={`cb-btn text-xs flex-shrink-0 ${productType===p.id?'cb-btn-primary':'cb-btn-ghost'}`}>{p.label}</button>)}
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={()=>setZoomed(false)}>
          <img src={mockupUrl} alt="Zoomed mockup" className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  )
}