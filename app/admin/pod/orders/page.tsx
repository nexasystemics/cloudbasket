'use client'
import { useEffect, useState } from 'react'
export default function PODOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const STATUS_COLORS: Record<string,string> = {paid:'text-blue-500',processing:'text-orange-500',shipped:'text-purple-500',delivered:'text-green-500',cancelled:'text-red-500'}

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@supabase/supabase-js').then(({createClient})=>{
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        sb.from('pod_orders').select('*').order('created_at',{ascending:false}).limit(50).then(({data})=>setOrders(data||[]))
      }).catch(()=>{})
    }
  },[])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">POD Orders</h1>
      {orders.length===0?<div className="cb-card p-8 text-center"><p className="text-[var(--cb-text-muted)]">No orders yet. First order will appear here.</p></div>:(
        <div className="cb-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--cb-border)]">{['Order ID','Amount','Status','Fulfiller','Date'].map(h=><th key={h} className="p-4 text-left font-black">{h}</th>)}</tr></thead>
            <tbody>{orders.map(o=><tr key={o.id} className="border-b border-[var(--cb-border)]">
              <td className="p-4 font-mono text-xs">{o.id.slice(-8)}</td>
              <td className="p-4 font-black">₹{Number(o.amount||0).toLocaleString('en-IN')}</td>
              <td className="p-4"><span className={`font-bold ${STATUS_COLORS[o.status]||''}`}>{o.status}</span></td>
              <td className="p-4">{o.fulfiller||'—'}</td>
              <td className="p-4 text-[var(--cb-text-muted)]">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
    </main>
  )
}