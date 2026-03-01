'use client'

import React, { useState } from 'react'
import { 
  Heart, 
  Bookmark, 
  BookOpen, 
  Settings, 
  User, 
  ChevronRight, 
  ArrowRight,
  Zap,
  TrendingUp,
  Layout,
  ExternalLink,
  LogOut,
  MousePointer2,
  DollarSign,
  ArrowUpRight,
  Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useGlobal } from '@/context/GlobalContext'
import { useRouter } from 'next/navigation'

export default function UserDashboard() {
  const { user, setUser } = useGlobal()
  const router = useRouter()
  const isAssociate = user?.role === 'Associate' || user?.role === 'Admin'

  const handleLogout = () => {
    setUser(null)
    router.push('/')
  }

  const savedDeals = [
    { id: 1, name: 'Premium Wireless Earbuds', price: '₹2,499', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Ergonomic Office Chair', price: '₹8,999', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=400' },
  ]

  const followedBlogs = [
    { title: 'Top 10 Tech Deals of 2026', author: 'Cloud Hub', date: 'March 1' },
    { title: 'The Future of POD Designs', author: 'Artisan Pro', date: 'Feb 28' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] font-sans text-[#1D1D1F] dark:text-white pb-20">
      {/* Dashboard Nav */}
      <nav className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-skyline-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <Layout size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Sovereign Node</h1>
        </div>
        <div className="flex items-center gap-6">
           <Link href="/products" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors">Explore</Link>
           <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-xl transition-all">
             <LogOut size={16} />
             Logout
           </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-skyline-primary mb-2">Authenticated Identity</p>
              <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Welcome, {user?.email?.split('@')[0] || 'Cloud Shopper'}</h2>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed">Your sovereign discovery hub is active. {isAssociate ? 'Performance metrics are synced.' : 'Your bookmarks are safe.'}</p>
           </div>
           <div className="flex gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                 <p className="text-2xl font-black tracking-tighter">142</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Trust Score</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                 <p className="text-2xl font-black tracking-tighter">4</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Badges</p>
              </div>
           </div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#009DFF33_0%,_transparent_70%)]" />
        </div>

        {/* Associate Performance Hub (Conditional) */}
        {isAssociate && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h3 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-3">
               <TrendingUp size={24} className="text-skyline-primary" /> Performance telemetry
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                         <MousePointer2 size={20} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">+12%</span>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Redirects</p>
                      <p className="text-3xl font-black tracking-tighter">1,240</p>
                   </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                         <DollarSign size={20} />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Pending</span>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Potential Revenue</p>
                      <p className="text-3xl font-black tracking-tighter">₹4,500</p>
                   </div>
                </div>
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-center space-y-4 relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-skyline-primary mb-1">Your ref link</p>
                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                         <code className="text-[10px] font-bold text-gray-300">.../?ref={user?.id || 'CB-REF'}</code>
                         <LinkIcon size={14} className="text-skyline-primary" />
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#009DFF22_0%,_transparent_70%)]" />
                </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* User Specifics */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              <Bookmark size={24} className="text-skyline-primary" /> Vaulted Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {savedDeals.map((deal) => (
                 <div key={deal.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-50 dark:bg-gray-800">
                       <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-sm font-black line-clamp-1">{deal.name}</h4>
                       <p className="text-skyline-primary font-black">{deal.price}</p>
                       <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                         View Deal <ExternalLink size={12} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                <h3 className="text-xl font-black tracking-tighter flex items-center gap-3">
                  <Settings size={20} className="text-gray-400" /> Identity Settings
                </h3>
                <div className="space-y-4">
                   <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center gap-3">
                         <User size={18} className="text-gray-400 group-hover:text-skyline-primary" />
                         <span className="text-xs font-black uppercase tracking-widest">Protocol Node</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                   </button>
                   <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center gap-3">
                         <Zap size={18} className="text-gray-400 group-hover:text-skyline-primary" />
                         <span className="text-xs font-black uppercase tracking-widest">Alert Filters</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
