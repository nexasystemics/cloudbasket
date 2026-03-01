'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import { CheckCircle } from 'lucide-react'

export default function CartSuccessVideo() {
  const { showSuccessVideo } = useCart()

  if (!showSuccessVideo) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="relative aspect-square">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27cf34ea99567bc4ec0d473fdb0428d7399cf81&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center text-center px-6">
            <div className="bg-emerald-500 text-white p-3 rounded-full mb-4 shadow-lg shadow-emerald-500/40">
              <CheckCircle size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Item Secured</h3>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-2">Added to your basket</p>
          </div>
        </div>
      </div>
    </div>
  )
}
