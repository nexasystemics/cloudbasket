'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, ShoppingBag, Download, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function OrderSuccessPage() {
  const [orderId] = useState(() => `CB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-lg w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
        {/* Apple-style background accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        
        <div className="mb-10 flex justify-center relative">
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-150" />
          <div className="bg-emerald-50 p-6 rounded-full relative animate-in zoom-in duration-500">
            <CheckCircle size={80} className="text-emerald-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Success!
        </h1>
        <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
          Your order has been placed. We&apos;re getting it ready for shipment.
        </p>

        <div className="bg-gray-50 rounded-[2rem] p-8 mb-10 text-left space-y-4 border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">Order Number</span>
            <span className="text-sm font-black text-gray-900 font-mono">{orderId}</span>
          </div>
          <div className="h-px bg-gray-200/50 w-full" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">Payment</span>
            <span className="text-xs font-black bg-white text-gray-600 px-4 py-1.5 rounded-full border border-gray-200">COD (Pending)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">Estimated Delivery</span>
            <span className="text-sm font-black text-[#039BE5]">March 5 - March 7</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl font-black tracking-tight transition-all shadow-xl active:scale-95 group"
          >
            Return Home
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/products"
            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-100 hover:border-gray-900 text-gray-900 py-5 rounded-2xl font-black tracking-tight transition-all active:scale-95"
          >
            <ShoppingBag size={20} />
            Shop More
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 animate-in fade-in duration-1000">
           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
             <Download size={14} /> Receipt
           </button>
           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
             <Share2 size={14} /> Share
           </button>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-gray-400 font-bold uppercase tracking-widest">
        Questions? <Link href="/contact" className="text-[#039BE5] hover:underline">Chat with us</Link>
      </p>
    </div>
  )
}
