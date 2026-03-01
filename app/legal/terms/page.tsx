'use client'

import React from 'react'
import { Scale, ChevronLeft, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
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
                <Scale size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Terms of Service</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Operational Protocol v1.0</p>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">1. Usage Protocol</h2>
                <p>
                  By accessing the CloudBasket Global Hub, you acknowledge our role as a content aggregator and price discovery platform. 
                  Users are permitted to use our tools for personal, non-commercial price comparison and POD design exploration only.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">2. Affiliate Link Integrity</h2>
                <p>
                  Our outbound links use the dynamic &quot;Income Shield&quot; redirect system. Users agree that CloudBasket and its verified 
                  associates may earn a commission on qualifying purchases made through these nodes. This does not affect the price you pay.
                </p>
              </section>

              <div className="bg-red-500/5 p-8 rounded-[2rem] border border-red-500/10">
                 <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="text-red-500" size={20} />
                    <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Crucial Liability Limitation</h3>
                 </div>
                 <p className="text-xs leading-relaxed italic">
                   CLOUD BASKET IS NOT A RETAILER. WE DO NOT SELL PRODUCTS. WE EXPRESSLY DISCLAIM ALL LIABILITY RELATED TO PRODUCT DEFECTS, 
                   SHIPPING DELAYS, FULFILLMENT ERRORS, OR THIRD-PARTY FRAUD. USERS MUST RESOLVE ALL PRODUCT DISPUTES DIRECTLY WITH THE 
                   VENDOR AT THE DESTINATION NODE.
                 </p>
              </div>

              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">3. Intellectual Property</h2>
                <p>
                  All POD designs and mockup renders are protected under global copyright law. Unauthorized scraping or mirroring of the 
                  CloudBasket Global Catalog is strictly prohibited.
                </p>
              </section>

              <section className="pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verifiably Complaint Node</span>
                 </div>
                 <div className="flex gap-6">
                    <Link href="/legal/privacy" className="text-[10px] font-black uppercase tracking-widest text-skyline-primary hover:underline">View Privacy Policy</Link>
                    <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-skyline-primary hover:underline">Support Hub</Link>
                 </div>
              </section>
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#FF6D0011_0%,_transparent_70%)]" />
        </div>
      </div>
    </div>
  )
}
