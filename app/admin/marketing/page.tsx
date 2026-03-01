'use client'

import React, { useState } from 'react'
import { 
  Megaphone, 
  Upload, 
  Smartphone, 
  Monitor, 
  Calendar, 
  Clock, 
  Share2, 
  ChevronLeft,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  MessageSquare,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

const PLATFORMS = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { name: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-500' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'X (Twitter)', icon: Twitter, color: 'text-gray-900 dark:text-white' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { name: 'Telegram', icon: Send, color: 'text-sky-500' },
  { name: 'Pinterest', icon: ImageIcon, color: 'text-red-500' },
  { name: 'TikTok', icon: Share2, color: 'text-cyan-400' },
  { name: 'Threads', icon: MessageSquare, color: 'text-gray-900 dark:text-white' },
]

export default function MarketingStudio() {
  const [activePlatform, setActiveTab] = useState('Instagram')
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [caption, setCaption] = useState('')
  const [affiliateLink, setAffiliateLink] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    setIsScheduling(true)
    setTimeout(() => {
      setIsScheduling(false)
      setScheduleSuccess(true)
      setTimeout(() => setScheduleSuccess(false), 3000)
    }, 2000)
  }

  const finalCaption = `${caption}

Shop via CloudBasket: ${affiliateLink || 'https://cloudbasket.in/deals'}
#CloudBasket #SmartShopping #Deals2026`

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] p-6 md:p-12 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-3 bg-skyline-primary/10 px-4 py-2 rounded-full border border-skyline-primary/20">
            <Megaphone size={14} className="text-skyline-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-skyline-primary">Omni-Channel Studio</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Creator Tools */}
          <div className="xl:col-span-7 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm space-y-10">
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-2 text-gray-900 dark:text-white">Content Composer</h2>
                <p className="text-gray-400 font-medium text-sm">One upload. Ten platforms. Automated branding.</p>
              </div>

              <div className="space-y-8">
                {/* Single Upload Multi-Format */}
                <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-skyline-primary transition-all relative overflow-hidden">
                  <div className="w-16 h-16 bg-skyline-primary/10 rounded-2xl flex items-center justify-center text-skyline-primary mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Upload Master Media</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">MP4 (4K), PNG, or MOV</p>
                  <div className="absolute inset-0 bg-skyline-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Caption</label>
                    <textarea 
                      rows={5}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Enter the hype for your content..."
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-skyline-primary outline-none font-bold transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Affiliate / Redirect Link</label>
                      <div className="relative">
                        <ExternalLink size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="url"
                          value={affiliateLink}
                          onChange={(e) => setAffiliateLink(e.target.value)}
                          placeholder="https://cloudbasket.in/..."
                          className="w-full px-6 py-4 pl-12 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-skyline-primary outline-none font-bold transition-all text-xs"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-skyline-primary/5 rounded-2xl border border-skyline-primary/10">
                       <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 size={12} className="text-skyline-primary" />
                          <span className="text-[10px] font-black uppercase text-skyline-primary">Auto-Inject Active</span>
                       </div>
                       <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
                         CloudBasket branding and your unique tracking ID will be appended to all outgoing platform requests.
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Schedule Drip-Feed</h3>
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                    <Clock size={12} />
                    <span className="text-[9px] font-black uppercase">Drip Logic Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                      <Calendar className="text-gray-400" size={20} />
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-gray-400 uppercase">Post Date</span>
                         <input type="date" className="bg-transparent border-none outline-none font-black text-xs" defaultValue="2026-03-01" />
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                      <Clock className="text-gray-400" size={20} />
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-gray-400 uppercase">Release Time</span>
                         <input type="time" className="bg-transparent border-none outline-none font-black text-xs" defaultValue="12:00" />
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleSchedule}
                  disabled={isScheduling}
                  className={`w-full mt-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${
                    isScheduling 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : scheduleSuccess 
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-skyline-primary dark:hover:bg-skyline-primary dark:hover:text-white'
                  }`}
                >
                  {isScheduling ? 'Engaging API Nodes...' : scheduleSuccess ? 'Content Scheduled' : 'Deploy Omni-Channel'}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Preview Hub */}
          <div className="xl:col-span-5 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col shadow-xl">
              <div className="p-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {PLATFORMS.map((p) => (
                    <button 
                      key={p.name}
                      onClick={() => setActiveTab(p.name)}
                      className={`p-2 rounded-xl transition-all ${activePlatform === p.name ? 'bg-white dark:bg-gray-900 shadow-sm scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                    >
                      <p.icon size={20} className={p.color} />
                    </button>
                  ))}
                </div>
                <div className="flex bg-white dark:bg-gray-900 p-1 rounded-xl shadow-inner">
                   <button 
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-skyline-primary text-white shadow-md' : 'text-gray-400'}`}
                   >
                     <Smartphone size={16} />
                   </button>
                   <button 
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-skyline-primary text-white shadow-md' : 'text-gray-400'}`}
                   >
                     <Monitor size={16} />
                   </button>
                </div>
              </div>

              <div className="flex-grow p-10 flex items-center justify-center min-h-[600px] bg-gray-100 dark:bg-black/20">
                 {/* Mock Social Feed Item */}
                 <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden ${previewMode === 'mobile' ? 'w-72 h-[500px]' : 'w-full max-w-md h-[400px]'}`}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-skyline-primary" />
                       <span className="text-[10px] font-black">cloudbasket_india</span>
                    </div>
                    <div className="aspect-square bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                       <ImageIcon className="text-gray-200" size={48} />
                    </div>
                    <div className="p-4 space-y-2">
                       <div className="flex gap-3 mb-2">
                          <CheckCircle2 size={16} className="text-gray-400" />
                          <MessageSquare size={16} className="text-gray-400" />
                          <Share2 size={16} className="text-gray-400" />
                       </div>
                       <p className="text-[10px] font-bold text-gray-900 dark:text-white line-clamp-3">
                          <span className="font-black mr-2">cloudbasket_india</span>
                          {finalCaption}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                 <AlertCircle size={14} className="text-skyline-primary" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                   Preview approximates platform-specific cropping and UI overlay.
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-8 bg-emerald-500 rounded-[2.5rem] text-white flex flex-col justify-center shadow-xl shadow-emerald-500/20">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Sync Status</p>
                  <h4 className="text-2xl font-black">All APIs Hot</h4>
                  <div className="mt-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Listening for triggers</span>
                  </div>
               </div>
               <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] flex flex-col justify-center shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-gray-400">Drip Queue</p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">12 Posts</h4>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-skyline-primary mt-2">Next: 14:00 (YouTube)</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
