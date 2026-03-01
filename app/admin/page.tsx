'use client'

import React, { useState, useMemo } from 'react'
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
  Megaphone,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useGlobal } from '@/context/GlobalContext'

// Simplified mock data for the Sovereign Audit
const PLATFORM_METRICS = [
  { name: 'Amazon Node', clicks: 8420, avgCommission: 0.04, revenue: 12400 },
  { name: 'Flipkart Node', clicks: 5210, avgCommission: 0.05, revenue: 8900 },
  { name: 'Redbubble Node', clicks: 2150, avgCommission: 0.12, revenue: 15600 },
  { name: 'Direct/Sovereign', clicks: 1200, avgCommission: 0.15, revenue: 8300 },
]

export default function AdminDashboard() {
  const { user } = useGlobal()
  const [activeView, setActiveView] = useState('insights')

  const stats = [
    { label: 'Total Products', value: '2,000', icon: Package, color: 'text-skyline-primary' },
    { label: 'Click Exit Node', value: '16,980', icon: MousePointer2, color: 'text-purple-500' },
    { label: 'Verified Associates', value: '124', icon: Users, color: 'text-orange-500' },
    { label: 'Master Revenue', value: '₹45,200', icon: DollarSign, color: 'text-emerald-500' },
  ]

  const potentialCommission = useMemo(() => {
    return PLATFORM_METRICS.reduce((acc, p) => acc + (p.clicks * p.avgCommission * 10), 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] flex font-sans text-[#1D1D1F] dark:text-[#F5F5F7]">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-skyline-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="font-black tracking-tighter text-lg uppercase italic">Sovereign</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Admin Hub v1.0</p>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Master Nodes</p>
          {[
            { name: 'Marketplace Insights', icon: LayoutDashboard, view: 'insights' },
            { name: 'Income Dashboard', icon: BarChart3, view: 'income' },
            { name: 'Associate CRM', icon: Users, href: '/admin/associates' },
            { name: 'Unified Lister', icon: Package, href: '/admin/lister' },
            { name: 'Marketing Studio', icon: Megaphone, href: '/admin/marketing' },
            { name: 'Credential Vault', icon: Lock, href: '/admin/affiliate-keys' },
          ].map((link) => (
            link.href ? (
              <Link key={link.name} href={link.href} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-skyline-primary dark:hover:text-white transition-all group">
                <link.icon size={18} />
                {link.name}
              </Link>
            ) : (
              <button key={link.name} onClick={() => setActiveView(link.view!)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeView === link.view ? 'bg-skyline-primary/10 text-skyline-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <link.icon size={18} />
                {link.name}
              </button>
            )
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95">
            <LogOut size={18} /> Exit Hub
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto h-screen custom-scrollbar">
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Scan global item nodes..." className="bg-transparent border-none outline-none text-xs font-bold w-full" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
              <div className="text-right">
                <p className="text-sm font-black">Master Admin</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Status: Fully Sovereign</p>
              </div>
              <div className="w-10 h-10 bg-skyline-primary rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center text-white font-black text-xs">MA</div>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {activeView === 'insights' ? (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">Marketplace Protocol</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time telemetry from 2,000 verified affiliate nodes.</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-skyline-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all">Export Sovereignty Report</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm group relative overflow-hidden transition-all hover:shadow-xl">
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 flex flex-col">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase">Platform Clicks</h3>
                        <p className="text-xs font-medium text-gray-400 mt-1">Sovereign redirection metrics across nodes.</p>
                      </div>
                      <TrendingUp className="text-skyline-primary" />
                   </div>
                   <div className="space-y-6">
                      {PLATFORM_METRICS.map((p) => (
                        <div key={p.name} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-skyline-primary" />
                              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{p.name}</span>
                           </div>
                           <div className="flex items-center gap-6 text-right">
                              <p className="text-sm font-black">{p.clicks.toLocaleString()} Exits</p>
                              <ArrowUpRight size={16} className="text-gray-300 group-hover:text-skyline-primary" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                   <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-2">
                         <Zap className="text-skyline-primary fill-skyline-primary" size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-skyline-primary">Auto-Optimization</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter mb-6">Redirect Insurance</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium italic">
                        &quot;Income Shield is active. All platform tags are verifiably correctly injected into outbound nodes.&quot;
                      </p>
                      <div className="mt-auto space-y-4">
                         <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Latency</span>
                            <span className="text-xs font-black text-emerald-400">12ms</span>
                         </div>
                         <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Uptime</span>
                            <span className="text-xs font-black text-emerald-400">99.99%</span>
                         </div>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#009DFF22_0%,_transparent_70%)]" />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">Income Dashboard</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Sovereign projection of potential aggregator commissions.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-center items-center text-center space-y-6">
                     <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                        <DollarSign size={48} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Projected Monthly Potential</p>
                        <h3 className="text-6xl font-black tracking-tighter">₹{potentialCommission.toLocaleString()}</h3>
                     </div>
                     <p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">Based on current click-through rate across all nodes and average category commission percentages.</p>
                  </div>

                  <div className="space-y-6">
                     {PLATFORM_METRICS.map(p => (
                       <div key={p.name} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.name}</p>
                             <p className="text-lg font-black mt-1 tracking-tighter">₹{p.revenue.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-emerald-500">+{(p.avgCommission * 100).toFixed(1)}%</p>
                             <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Avg Node Rate</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
        }
      `}</style>
    </div>
  )
}
