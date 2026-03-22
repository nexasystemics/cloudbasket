'use client'
import { useState } from 'react'
import { SIZE_CHARTS, getSizeRecommendation } from '@/lib/pod/size-charts'

export default function SizeChart({ productType = 'tshirt' }: { productType?: string }) {
  const [chest, setChest] = useState('')
  const [height, setHeight] = useState('')
  const chart = SIZE_CHARTS[productType]
  const recommended = chest && height ? getSizeRecommendation(Number(chest), Number(height), productType) : null
  if (!chart) return null
  return (
    <div className="space-y-4">
      <h3 className="font-black">Size Guide — {chart.product}</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div><label className="text-xs font-bold block mb-1">Chest ({chart.unit})</label><input type="number" className="cb-input w-full" placeholder="e.g. 96" value={chest} onChange={e => setChest(e.target.value)} /></div>
        <div><label className="text-xs font-bold block mb-1">Height (cm)</label><input type="number" className="cb-input w-full" placeholder="e.g. 175" value={height} onChange={e => setHeight(e.target.value)} /></div>
      </div>
      {recommended && <div className="p-3 bg-green-500/10 rounded-xl text-green-600 font-black text-center">Recommended Size: {recommended}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="bg-[var(--cb-surface-2)]"><th className="p-2 text-left font-black">Size</th>{Object.keys(Object.values(chart.sizes)[0]).map(m => <th key={m} className="p-2 font-black capitalize">{m}</th>)}</tr></thead>
          <tbody>{Object.entries(chart.sizes).map(([size, measurements]) => (
            <tr key={size} className={`border-b border-[var(--cb-border)] ${size === recommended ? 'bg-green-500/5 font-bold' : ''}`}>
              <td className="p-2 font-black">{size}</td>
              {Object.values(measurements).map((val, i) => <td key={i} className="p-2 text-center">{val}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}