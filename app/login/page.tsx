'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, ShieldCheck, Github, Chrome } from 'lucide-react'
import Image from 'next/image'
import { useGlobal } from '@/context/GlobalContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useGlobal()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate Supabase Auth
    setTimeout(() => {
      // Mock logic: detect admin by email
      let role: 'Admin' | 'Associate' | 'User' = 'User'
      if (email.includes('admin')) role = 'Admin'
      else if (email.includes('partner')) role = 'Associate'

      setUser({ id: '123', email, role })
      setIsLoading(false)
      router.push(role === 'Admin' ? '/admin' : '/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full relative">
        {/* Decorative Background Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-skyline-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl rounded-[3rem] border border-white/20 dark:border-white/10 p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative z-10 overflow-hidden">
          <div className="mb-10 text-center space-y-2">
            <div className="relative w-[180px] h-[40px] mx-auto mb-6">
               <Image src="/brand/logo-light.svg" alt="CloudBasket" fill className="object-contain dark:hidden" />
               <Image src="/brand/logo-dark.svg" alt="CloudBasket" fill className="object-contain hidden dark:block" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">Welcome Back.</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Secure access to your global hub.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-skyline-primary transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none transition-all dark:text-white"
                />
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-skyline-primary transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-skyline-primary outline-none transition-all dark:text-white"
                />
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
              {isLoading ? 'Verifying Node...' : (
                <>
                  Access Hub
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
              <span className="absolute bg-white dark:bg-gray-900 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Or Connect Via</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 transition-colors">
                  <Chrome size={18} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-xs font-black uppercase tracking-tighter">Google</span>
               </button>
               <button className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 transition-colors">
                  <Github size={18} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-xs font-black uppercase tracking-tighter">GitHub</span>
               </button>
            </div>
          </div>

          <p className="mt-10 text-center text-xs font-bold text-gray-500">
            New to CloudBasket? <Link href="/register" className="text-skyline-primary hover:underline">Create an Identity</Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
           <ShieldCheck size={14} className="text-emerald-500" />
           256-bit Encrypted Session
        </div>
      </div>
    </div>
  )
}
