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
  DollarSign
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')

  const sidebarLinks = [
    { name: 'Product Manager', icon: Package, href: '#products' },
    { name: 'POD Lister', icon: Palette, href: '#pod' },
    { name: 'Associate CRM', icon: Users, href: '#crm' },
    { name: 'API Settings', icon: Settings, href: '#api' },
  ]

  const stats = [
    { label: 'Total Products', value: '2,000', icon: Package, color: 'text-skyline-primary' },
    { label: 'Total Commissions', value: '₹45,200', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Active Associates', value: '124', icon: Users, color: 'text-orange-500' },
    { label: 'Global Reach', value: '12 Countries', icon: Globe, color: 'text-purple-500' },
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
              placeholder="Quick find products or associates..."
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
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time status of your global affiliate network.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all">Download Report</button>
              <button className="px-6 py-2.5 bg-skyline-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all">Add New Item</button>
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
                {/* Subtle background flair */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Activity Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 h-96 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-skyline-primary/5 rounded-full flex items-center justify-center text-skyline-primary mb-6">
                  <TrendingUp size={40} />
               </div>
               <h3 className="text-xl font-black">Conversion Analytics</h3>
               <p className="text-gray-400 max-w-xs mt-2 text-sm font-medium leading-relaxed">Detailed click-through and sales data will be integrated with Supabase/CJ API here.</p>
            </div>
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col h-96 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black tracking-tighter mb-2">Cloud Status</h3>
                 <div className="flex items-center gap-2 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">All Systems Functional</span>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-400">CJ API Connection</span>
                       <span className="text-xs font-black text-emerald-400">Stable</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-400">Sync Frequency</span>
                       <span className="text-xs font-black">Every 5m</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-400">Database Load</span>
                       <span className="text-xs font-black">Low</span>
                    </div>
                 </div>
               </div>
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#009DFF33_0%,_transparent_70%)]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
