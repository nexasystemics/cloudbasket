'use client'

import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  Palette, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Globe,
  DollarSign,
  Upload,
  Link as LinkIcon,
  MousePointer2,
  Lock,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Megaphone
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')

  const sidebarLinks = [
    { name: 'Product Manager', icon: Package, href: '#products' },
    { name: 'POD Lister', icon: Palette, href: '/admin/pod/upload' },
    { name: 'Associate CRM', icon: Users, href: '/admin/associates' },
    { name: 'Marketing Studio', icon: Megaphone, href: '/admin/marketing' },
    { name: 'Affiliate Vault', icon: Lock, href: '/admin/affiliate-keys' },
    { name: 'API Settings', icon: Settings, href: '#api' },
  ]

  const stats = [
    { label: 'Total Products', value: '2,000', icon: Package, color: 'text-skyline-primary' },
    { label: 'Click Redirects', value: '12,402', icon: MousePointer2, color: 'text-purple-500' },
    { label: 'Active Associates', value: '124', icon: Users, color: 'text-orange-500' },
    { label: 'Total Revenue', value: '₹45,200', icon: DollarSign, color: 'text-emerald-500' },
  ]

  const platformClicks = [
    { name: 'Amazon India', clicks: 5420, trend: '+12%' },
    { name: 'Flipkart', clicks: 3210, trend: '+5%' },
    { name: 'Redbubble', clicks: 1850, trend: '+24%' },
    { name: 'Printful', clicks: 1922, trend: '-2%' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] flex font-sans text-[#1D1D1F] dark:text-[#F5F5F7]">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-skyline-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="font-black tracking-tighter text-lg">Command</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Center v1.0</p>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-skyline-primary dark:hover:text-white transition-all group active:scale-95"
            >
              <link.icon size={18} className="group-hover:scale-110 transition-transform" />
              {link.name}
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search command center..."
              className="bg-transparent border-none outline-none text-xs font-bold w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
              <div className="text-right">
                <p className="text-sm font-black">Admin Access</p>
                <p className="text-[10px] font-bold text-skyline-primary uppercase tracking-widest">Master Cloud</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-skyline-primary to-sky-600 rounded-full border-2 border-white dark:border-gray-800 shadow-md" />
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="p-10 space-y-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tighter">Marketplace Insights</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Step 5: Omni-Channel Marketing Engine Active.</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/admin/marketing"
                className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
              >
                <Megaphone size={14} /> Marketing Studio
              </Link>
              <Link 
                href="/admin/pod/upload"
                className="px-6 py-2.5 bg-skyline-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Upload size={14} /> New Design
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Click Analytics Dashboard */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 flex flex-col">
               <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase">Click Analytics</h3>
                    <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-widest">Real-time Platform Redirects</p>
                  </div>
                  <TrendingUp className="text-skyline-primary" />
               </div>
               
               <div className="space-y-6">
                  {platformClicks.map((p) => (
                    <div key={p.name} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-skyline-primary" />
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{p.name}</span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className="text-sm font-black">{p.clicks.toLocaleString()}</p>
                             <p className="text-[10px] font-black text-emerald-500">{p.trend}</p>
                          </div>
                          <ArrowUpRight size={16} className="text-gray-300 group-hover:text-skyline-primary transition-colors" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-auto pt-10">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full flex overflow-hidden">
                     <div className="bg-skyline-primary w-[45%]" />
                     <div className="bg-purple-500 w-[25%]" />
                     <div className="bg-orange-500 w-[20%]" />
                     <div className="bg-gray-300 w-[10%]" />
                  </div>
               </div>
            </div>

            {/* Admin Payment Log Preview */}
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 flex flex-col shadow-sm">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="text-xl font-black tracking-tighter uppercase">Due Payouts</h3>
               </div>

               <div className="space-y-4">
                  {[
                    { name: 'Amit Verma', amount: '₹8,900', time: '2h ago' },
                    { name: 'Rahul Sharma', amount: '₹4,500', time: '5h ago' }
                  ].map((pay, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                       <div>
                          <p className="text-xs font-black">{pay.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{pay.time}</p>
                       </div>
                       <p className="text-sm font-black text-emerald-500">{pay.amount}</p>
                    </div>
                  ))}
               </div>

               <Link 
                href="/admin/associates" 
                className="mt-8 w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-skyline-primary dark:hover:bg-skyline-primary dark:hover:text-white transition-all"
               >
                 Review All Requests
               </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
