'use client'

import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HeroVideo() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="https://player.vimeo.com/external/517090025.hd.mp4?s=63ef660066cd606bc06efcc6ba60ed0ba0df3ef1&profile_id=172&oauth2_token_id=57447761" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

      {/* Content */}
      <div className="relative h-full max-w-[1800px] mx-auto px-6 flex flex-col justify-center items-start">
        <div className="max-w-3xl backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-skyline-primary/20 backdrop-blur-xl px-4 py-2 rounded-full mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white">
              India&apos;s Premium Price Engine 2026
            </p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
            Global Marketplace. <br/> <span className="text-skyline-primary">Unified.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl leading-tight font-medium">
            2,000+ Verified Items. 100+ Categories. Real-time global specs & price tracking.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link 
              href="#shop"
              className="bg-skyline-primary text-white px-10 py-5 rounded-2xl font-black text-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
            >
              <Sparkles size={20} />
              Browse Catalog
            </Link>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-10 py-5 rounded-2xl font-black text-sm transition-all flex items-center gap-3 backdrop-blur-md active:scale-95">
              Watch Vision <ArrowRight size={20} className="rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
