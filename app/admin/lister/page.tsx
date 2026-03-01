'use client'

import React, { useState } from 'react'
import { 
  Package, 
  Palette, 
  Plus, 
  ExternalLink, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck,
  Tag,
  Globe,
  Upload,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { useGlobal } from '@/context/GlobalContext'

export default function UnifiedListerPortal() {
  const { user } = useGlobal()
  const [listType, setListType] = useState<'product' | 'design'>('product')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Admin Hub
          </Link>
          <div className="bg-skyline-primary/10 text-skyline-primary text-[10px] font-black px-4 py-2 rounded-full border border-skyline-primary/20 flex items-center gap-2">
            <ShieldCheck size={14} />
            Verified Lister: {user?.id || 'CB-Node-01'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          <div className="p-10 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
            <h2 className="text-3xl font-black tracking-tighter mb-6">Unified Lister Portal</h2>
            
            <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 w-fit">
               <button 
                onClick={() => setListType('product')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${listType === 'product' ? 'bg-skyline-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
               >
                 <ShoppingBag size={14} /> Affiliate Product
               </button>
               <button 
                onClick={() => setListType('design')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${listType === 'design' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
               >
                 <Palette size={14} /> POD Design
               </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Item Title</label>
                  <input required type="text" placeholder="e.g. Ultra-Light Carbon Fiber Tripod" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category Hub</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-skyline-primary outline-none appearance-none">
                     <option>Mobiles</option>
                     <option>Laptops</option>
                     <option>Fashion</option>
                     <option>Home</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Master Redirect URL (Affiliate)</label>
               <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="url" placeholder="https://amazon.in/dp/..." className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none" />
               </div>
            </div>

            <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-skyline-primary transition-all">
               <Upload className="text-gray-300 group-hover:text-skyline-primary transition-colors mb-4" size={32} />
               <p className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Upload 4K Product Media</p>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-6">
               <div className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <p className="text-[9px] font-black uppercase tracking-widest">Sent to Moderation Queue upon deployment</p>
               </div>
               <button 
                disabled={isSubmitting}
                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 active:scale-95 ${isSubmitting ? 'bg-gray-100 text-gray-400' : success ? 'bg-emerald-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}
               >
                 {isSubmitting ? 'Processing Nodes...' : success ? 'Deployment Successful' : 'Request Listing'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
