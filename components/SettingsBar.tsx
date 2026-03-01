'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon, Languages, ArrowLeftRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useGlobal } from '@/context/GlobalContext'

export default function SettingsBar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { direction, setDirection } = useGlobal()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 px-6 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-skyline-primary dark:hover:text-white transition-all group"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} className="group-hover:rotate-90 transition-transform" />
              Light Mode
            </>
          ) : (
            <>
              <Moon size={16} className="group-hover:-rotate-12 transition-transform" />
              Dark Mode
            </>
          )}
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />

        {/* Direction Toggle */}
        <button
          onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-skyline-primary dark:hover:text-white transition-all group"
        >
          <ArrowLeftRight size={16} className="group-hover:scale-110 transition-transform" />
          {direction === 'ltr' ? 'Switch to RTL' : 'Switch to LTR'}
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
           <Languages size={16} />
           Global Hub v1.0
        </div>
      </div>
    </div>
  )
}
