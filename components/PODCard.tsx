'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, ShoppingBag, Maximize2, Share2 } from 'lucide-react'

interface PODCardProps {
  design: {
    id: number
    title: string
    image: string
    platforms: Record<string, string>
  }
}

export default function PODCard({ design }: PODCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const platformCount = Object.keys(design.platforms).length

  return (
    <div 
      className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-700 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mockup Background + Design Overlay */}
      <div className="relative aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
        {/* Subtle texture/mockup shadow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#000_0%,_transparent_70%)]" />
        
        {/* The Design - scaled and positioned to look like a shirt/poster */}
        <div className={`relative w-[70%] aspect-square transition-all duration-700 ${isHovered ? 'scale-110 -translate-y-4' : 'scale-100'}`}>
          <Image 
            src={design.image} 
            alt={design.title} 
            fill 
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        </div>

        {/* Floating Platform Badge */}
        <div className="absolute top-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
            Available on {platformCount} Stores
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className={`absolute bottom-6 left-0 right-0 flex justify-center gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <button className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl hover:text-skyline-primary active:scale-90 transition-all border border-gray-100 dark:border-gray-700">
              <Maximize2 size={18} />
           </button>
           <button className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl hover:text-skyline-primary active:scale-90 transition-all border border-gray-100 dark:border-gray-700">
              <Share2 size={18} />
           </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter mb-2 group-hover:text-skyline-primary transition-colors">
          {design.title}
        </h3>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-8">Exclusive POD Artwork</p>

        <div className="mt-auto space-y-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Choose Your Node</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(design.platforms).slice(0, 3).map(([name, url]) => (
              <button
                key={name}
                onClick={() => window.open(url, '_blank')}
                className="flex-1 bg-gray-50 dark:bg-gray-800 hover:bg-skyline-primary hover:text-white dark:hover:bg-skyline-primary py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border border-transparent hover:border-skyline-primary"
              >
                {name}
              </button>
            ))}
            {platformCount > 3 && (
              <Link 
                href={`/pod/${design.id}`}
                className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                + {platformCount - 3} More <ExternalLink size={10} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
