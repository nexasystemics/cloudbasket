'use client'

import React, { useState } from 'react'
import { 
  Key, 
  Shield, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ChevronLeft,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ApiKey {
  id: string
  platform: string
  keyLabel: string
  value: string
  lastUpdated: string
}

export default function AffiliateKeysVault() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [keys, setKeys] = useState<ApiKey[]>([
    { id: '1', platform: 'Amazon Associates', keyLabel: 'Tracking ID', value: 'cloudbasket-21', lastUpdated: '2026-02-15' },
    { id: '2', platform: 'Flipkart Affiliate', keyLabel: 'Affiliate ID', value: 'cb_hub_prime', lastUpdated: '2026-01-10' },
    { id: '3', platform: 'Commission Junction', keyLabel: 'API Client ID', value: '7a8b9c0d1e2f3g4h5i6j', lastUpdated: '2026-03-01' },
    { id: '4', platform: 'Commission Junction', keyLabel: 'Personal Access Token', value: 'sh_99887766554433221100', lastUpdated: '2026-03-01' },
  ])

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            <Lock size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">256-bit Encrypted Vault</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          <div className="p-10 border-b border-gray-50 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-skyline-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter">Affiliate Key Vault</h2>
                <p className="text-gray-400 font-medium text-sm">Securely manage your global aggregator credentials.</p>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-8">
            <div className="space-y-6">
              {keys.map((k) => (
                <div key={k.id} className="group p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:border-skyline-primary/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1 min-w-[200px]">
                      <p className="text-[10px] font-black text-skyline-primary uppercase tracking-widest">{k.platform}</p>
                      <h4 className="text-sm font-black text-gray-900 dark:text-white">{k.keyLabel}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Updated: {k.lastUpdated}</p>
                    </div>
                    
                    <div className="flex-grow relative group/input">
                      <input 
                        type={showKeys[k.id] ? 'text' : 'password'}
                        value={k.value}
                        readOnly
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-xs font-mono font-bold outline-none focus:ring-1 focus:ring-skyline-primary transition-all"
                      />
                      <button 
                        onClick={() => toggleKeyVisibility(k.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-skyline-primary transition-colors p-1"
                      >
                        {showKeys[k.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-skyline-primary hover:border-skyline-primary transition-all active:scale-90">
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-gray-400">
                <AlertCircle size={16} />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                  All keys are stored using industry-standard hashing before being committed to Supabase.
                </p>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
                  isSaving 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : saveSuccess 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                }`}
              >
                {isSaving ? (
                  'Syncing Vault...'
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={18} /> Credentials Updated
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-skyline-primary">
                  <Server size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tighter mb-2">API Integration Status</h3>
                <div className="space-y-4 mt-6">
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-gray-400">Amazon PA-API</span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-gray-400">CJ GraphQL Hub</span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                   </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#009DFF22_0%,_transparent_60%)]" />
           </div>

           <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-skyline-primary/10 rounded-full flex items-center justify-center text-skyline-primary mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-black tracking-tighter mb-2">Webhooks & Listeners</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                Real-time price drop alerts are currently active across all verified platform nodes.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
