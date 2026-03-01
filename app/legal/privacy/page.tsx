'use client'

import React from 'react'
import { Shield, ChevronLeft, Lock, Globe, Scale } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] font-sans text-[#1D1D1F] dark:text-white pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors mb-8 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-10 md:p-16 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-skyline-primary/10 rounded-2xl flex items-center justify-center text-skyline-primary shadow-inner">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Privacy Policy</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Last Updated: March 1, 2026</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">1. Global Compliance Standards</h2>
                <p>
                  CloudBasket Global Hub operates under the strict guidelines of the Digital Personal Data Protection (DPDPA) Act 2023 (India), 
                  General Data Protection Regulation (GDPR) (EU), and various global privacy frameworks. We are committed to absolute transparency 
                  regarding how your data is collected and utilized within our affiliate aggregator engine.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">2. Affiliate & Redirect Disclosure</h2>
                <div className="bg-skyline-primary/5 p-6 rounded-2xl border border-skyline-primary/10">
                  <p className="text-sm font-black text-skyline-primary mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} /> Zero-Fulfillment Disclaimer
                  </p>
                  <p className="text-xs">
                    CloudBasket is a pure discovery engine and price aggregator. We do not stock, ship, or process payments for any physical 
                    products listed on our platform. All transactions occur on third-party verified partner nodes (e.g., Amazon, Flipkart, Redbubble). 
                    Your relationship for fulfillment, returns, and warranties is exclusively with the destination platform.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">3. Data Collection & Node Usage</h2>
                <p>
                  We collect minimal identifier data (ID, Browser Type, Region) primarily to optimize the Global Scaling Engine and ensure 
                  accurate localized price rendering. No sensitive financial information is ever requested or stored on our nodes.
                </p>
              </section>

              <section className="space-y-4 pt-10 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Lock className="text-emerald-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">256-bit Encrypted Session Node</span>
                 </div>
                 <button className="text-[10px] font-black uppercase tracking-widest text-skyline-primary hover:underline">Download Full PDF</button>
              </section>
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#009DFF11_0%,_transparent_70%)]" />
        </div>
      </div>
    </div>
  )
}
