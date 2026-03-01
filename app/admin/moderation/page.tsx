'use client'

import React, { useState } from 'react'
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  ExternalLink, 
  ChevronLeft, 
  Search,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PendingItem {
  id: string
  title: string
  type: 'Product' | 'Design'
  creator: string
  date: string
  image: string
}

export default function AdminModerationQueue() {
  const [items, setItems] = useState<PendingItem[]>([
    { id: '1', title: 'Carbon Fiber Phone Case', type: 'Design', creator: 'PRIYA_POD', date: '2026-03-01', image: 'https://images.unsplash.com/photo-1586105251261-72a756657741?auto=format&fit=crop&q=80&w=200' },
    { id: '2', title: 'Ultra-Wide Gaming Monitor', type: 'Product', creator: 'AMIT_DEALS', date: '2026-03-01', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200' },
    { id: '3', title: 'Minimalist Skyline Poster', type: 'Design', creator: 'RAHUL2026', date: '2026-02-28', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=200' },
  ])

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    setItems(items.filter(i => i.id !== id))
    console.log(`Item ${id} ${action}d`)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Admin Dashboard
          </Link>
          <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-4 py-2 rounded-full border border-emerald-500/20 flex items-center gap-2">
            <ShieldCheck size={14} />
            Master Moderation Active
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/20">
            <div>
              <h2 className="text-3xl font-black tracking-tighter">Moderation Queue</h2>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">{items.length} Submissions Pending Review</p>
            </div>
            <div className="flex gap-3">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Filter Queue..." className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-11 pr-4 text-xs font-bold w-48 outline-none focus:ring-1 focus:ring-skyline-primary" />
               </div>
               <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-skyline-primary transition-colors">
                  <Filter size={18} />
               </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-10 py-4 font-black">Submission Details</th>
                  <th className="px-10 py-4 font-black text-center">Type</th>
                  <th className="px-10 py-4 font-black">Creator Node</th>
                  <th className="px-10 py-4 font-black">Date Submitted</th>
                  <th className="px-10 py-4 font-black text-right">Gatekeeper Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <CheckCircle className="text-emerald-500" size={48} />
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Queue Clear. All nodes synced.</p>
                       </div>
                    </td>
                  </tr>
                ) : items.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">REF: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        item.type === 'Design' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-skyline-primary/10 text-skyline-primary border-skyline-primary/20'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-10 py-6 font-bold text-xs text-gray-500 dark:text-gray-400">
                      {item.creator}
                    </td>
                    <td className="px-10 py-6 font-bold text-xs text-gray-500 dark:text-gray-400">
                      {item.date}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-skyline-primary rounded-xl transition-all border border-transparent hover:border-gray-200">
                          <Eye size={16} />
                        </button>
                        <button className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-skyline-primary rounded-xl transition-all border border-transparent hover:border-gray-200">
                          <Edit3 size={16} />
                        </button>
                        <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 mx-1" />
                        <button 
                          onClick={() => handleAction(item.id, 'Approve')}
                          className="p-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction(item.id, 'Reject')}
                          className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 bg-gray-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="relative z-10 space-y-2 text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                 <AlertCircle className="text-skyline-primary" size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-skyline-primary">Income Shield v1.0</span>
              </div>
              <h3 className="text-xl font-black">Gatekeeper Protocol</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-lg">Every item listed via CloudBasket undergoes verified moderation to ensure affiliate link integrity and brand alignment.</p>
           </div>
           <button className="relative z-10 px-8 py-4 bg-white text-gray-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-skyline-primary hover:text-white transition-all shadow-xl">Audit Moderation Logs</button>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#009DFF33_0%,_transparent_70%)]" />
        </div>
      </div>
    </div>
  )
}
