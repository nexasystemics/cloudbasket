'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, User, Briefcase, UserCircle, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export default function RegisterPage() {
  const [role, setRole] = useState<'User' | 'Associate'>('User')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push('/login')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-skyline-primary/20 rounded-full blur-[100px]" />
        
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl rounded-[3rem] border border-white/20 dark:border-white/10 p-10 md:p-12 shadow-2xl relative z-10">
          <div className="mb-10 text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">Create Identity.</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Select your path in the Global Scaling Engine.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-4">
               <button 
                type="button"
                onClick={() => setRole('User')}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${role === 'User' ? 'border-skyline-primary bg-skyline-primary/5' : 'border-gray-100 dark:border-gray-800'}`}
               >
                  <UserCircle size={32} className={role === 'User' ? 'text-skyline-primary' : 'text-gray-400'} />
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest">Standard User</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Shop & Bookmark</p>
                  </div>
               </button>
               <button 
                type="button"
                onClick={() => setRole('Associate')}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${role === 'Associate' ? 'border-orange-500 bg-orange-500/5' : 'border-gray-100 dark:border-gray-800'}`}
               >
                  <Briefcase size={32} className={role === 'Associate' ? 'text-orange-500' : 'text-gray-400'} />
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest">Associate</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">List & Earn</p>
                  </div>
               </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" placeholder="Full Name" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none transition-all dark:text-white" />
              </div>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="email" placeholder="Email Address" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none transition-all dark:text-white" />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="password" placeholder="Secure Password" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none transition-all dark:text-white" />
              </div>
            </div>

            <button
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-skyline-primary dark:hover:bg-skyline-primary dark:hover:text-white'
              }`}
            >
              {isLoading ? 'Creating Node...' : 'Initialize Identity'}
            </button>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-gray-500">
            Already have an ID? <Link href="/login" className="text-skyline-primary hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
