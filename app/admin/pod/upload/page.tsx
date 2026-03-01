'use client'

import React, { useState } from 'react'
import { 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Image as ImageIcon,
  Globe,
  Tag as TagIcon,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'

const POD_PLATFORMS = [
  'Redbubble', 'Society6', 'Zazzle', 'Printful', 'Printify', 
  'Teespring', 'Teepublic', 'Spreadshirt', 'Fine Art America', 'CafePress',
  'Design By Humans', 'Threadless', 'Amazon Merch', 'Etsy', 'eBay',
  'Bonfire', 'Cotton Bureau', 'Inprnt', 'Society6', 'Displate'
]

export default function PODUploadPage() {
  const [designTitle, setDesignTitle] = useState('')
  const [tags, setTags] = useState('')
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleUrlChange = (platform: string, url: string) => {
    setPlatformUrls(prev => ({ ...prev, [platform]: url }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors mb-8 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Upload Zone */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-skyline-primary transition-all aspect-square relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-skyline-primary/10 rounded-2xl flex items-center justify-center text-skyline-primary mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight">Drop Master Design</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">PNG, SVG (Max 50MB)</p>
              </div>
              <div className="absolute inset-0 bg-skyline-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <ImageIcon size={14} /> Preview
              </h4>
              <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-300">
                <span className="text-[10px] font-black uppercase tracking-widest">No Design Selected</span>
              </div>
            </div>
          </div>

          {/* Right: Lister Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter mb-2">POD Multi-Lister</h2>
                  <p className="text-gray-400 font-medium text-sm">Deploy your design across 20+ global print-on-demand networks.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Design Title</label>
                    <input 
                      required
                      type="text" 
                      value={designTitle}
                      onChange={(e) => setDesignTitle(e.target.value)}
                      placeholder="e.g. Skyline Abstract Horizon v2"
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-skyline-primary outline-none font-bold transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                      <TagIcon size={12} /> Tags (Comma separated)
                    </label>
                    <input 
                      type="text" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="abstract, minimal, blue, skyline"
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-skyline-primary outline-none font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                    <Globe size={14} /> Platform Destinations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {POD_PLATFORMS.map((platform) => (
                      <div key={platform} className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">{platform}</label>
                        <div className="relative group">
                          <input 
                            type="url" 
                            placeholder={`URL for ${platform}`}
                            value={platformUrls[platform] || ''}
                            onChange={(e) => handleUrlChange(platform, e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[11px] font-bold outline-none focus:ring-1 focus:ring-skyline-primary transition-all"
                          />
                          {platformUrls[platform] && (
                            <ExternalLink size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isUploading}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
                    isUploading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-skyline-primary dark:hover:bg-skyline-primary dark:hover:text-white'
                  }`}
                >
                  {isUploading ? (
                    'Processing Nodes...'
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle2 size={20} /> Deploy Successful
                    </>
                  ) : (
                    <>
                      <Plus size={20} /> Deploy Global Listings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  )
}
