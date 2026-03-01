'use client'

import Link from 'next/link'
import { useGlobal, CountryCode } from '@/context/GlobalContext'
import AdBanner from './AdBanner'

export default function Footer() {
  const { country, setCountry } = useGlobal()

  const countries: { code: CountryCode; name: string }[] = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'EU', name: 'Europe' },
    { code: 'GB', name: 'United Kingdom' },
  ]

  return (
    <footer className="bg-[#36454F] dark:bg-black text-white py-24 transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-skyline-primary flex items-center justify-center text-white font-black text-xl shadow-lg">CB</div>
            <span className="text-3xl font-black tracking-tighter">CloudBasket</span>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed font-medium text-lg">
            The definitive global price aggregator and affiliate discovery hub.
          </p>
          <div className="mt-10">
             <AdBanner type="affiliate" label="Partner with CloudBasket & CJ" />
          </div>
        </div>

        <div>
          <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-white/40">Marketplace</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-300">
            <li><Link href="/products" className="hover:text-skyline-primary transition-colors">Global Catalog</Link></li>
            <li><Link href="/deals" className="hover:text-skyline-primary transition-colors">Daily Deals</Link></li>
            <li><Link href="/pod" className="hover:text-skyline-primary transition-colors">POD Designs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-white/40">Settings</h4>
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Region</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryCode)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-white outline-none focus:border-skyline-primary transition-all w-full appearance-none cursor-pointer"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-gray-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <ul className="space-y-4 text-sm font-bold text-gray-300">
              <li><Link href="/privacy" className="hover:text-skyline-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-skyline-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1800px] mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
           © 2026 CloudBasket Global. All rights reserved.
         </p>
         <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
           {country === 'IN' ? 'DPDPA 2023 Compliant' : 'GDPR & FTC Compliant'}
         </p>
      </div>
    </footer>
  )
}
