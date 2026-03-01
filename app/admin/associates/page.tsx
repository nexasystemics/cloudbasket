'use client'

import React, { useState } from 'react'
import { 
  Users, 
  UserPlus, 
  Search, 
  Link as LinkIcon, 
  Copy, 
  CheckCircle2, 
  CreditCard, 
  ChevronLeft,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface Associate {
  id: string
  name: string
  pan: string
  upi: string
  refCode: string
  clicks: number
  payoutDue: number
}

export default function AssociateCRM() {
  const [search, setSearch] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [generateUrl, setGenerateUrl] = useState('')
  const [selectedAssociateCode, setSelectedAssociateCode] = useState('CB-REF-001')

  const associates: Associate[] = [
    { id: '1', name: 'Rahul Sharma', pan: 'ABCDE1234F', upi: 'rahul@okaxis', refCode: 'RAHUL2026', clicks: 1240, payoutDue: 4500 },
    { id: '2', name: 'Priya Patel', pan: 'FGHIJ5678K', upi: 'priya@paytm', refCode: 'PRIYA_POD', clicks: 850, payoutDue: 2100 },
    { id: '3', name: 'Amit Verma', pan: 'LMNOP9012Q', upi: 'amit@ybl', refCode: 'AMIT_DEALS', clicks: 2100, payoutDue: 8900 },
  ]

  const paymentRequests = [
    { id: 'PR-001', name: 'Amit Verma', amount: 5000, date: '2026-03-01', status: 'Pending' },
    { id: 'PR-002', name: 'Rahul Sharma', amount: 3000, date: '2026-02-28', status: 'Completed' },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const generatedRefLink = `${generateUrl}${generateUrl.includes('?') ? '&' : '?'}ref=${selectedAssociateCode}`

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Admin Dashboard
          </Link>
          <button className="bg-skyline-primary text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2">
            <UserPlus size={16} /> Register Associate
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Associate Directory */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter">Associate Directory</h2>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Managing {associates.length} Influencers</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Name or Ref Code..."
                    className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold w-64 outline-none focus:ring-1 focus:ring-skyline-primary transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">
                      <th className="px-8 py-4">Associate</th>
                      <th className="px-8 py-4">Financials</th>
                      <th className="px-8 py-4">Ref Code</th>
                      <th className="px-8 py-4">Performance</th>
                      <th className="px-8 py-4">Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {associates.map((assoc) => (
                      <tr key={assoc.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 dark:text-white">{assoc.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">ID: {assoc.id}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">PAN: {assoc.pan}</p>
                          <p className="text-[10px] font-black text-skyline-primary uppercase tracking-tighter mt-1">UPI: {assoc.upi}</p>
                        </td>
                        <td className="px-8 py-6">
                          <button 
                            onClick={() => copyToClipboard(assoc.refCode)}
                            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-[10px] font-black group-hover:bg-skyline-primary group-hover:text-white transition-all active:scale-90"
                          >
                            {assoc.refCode}
                            {copiedCode === assoc.refCode ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                          </button>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight size={14} className="text-emerald-500" />
                            <span className="text-sm font-black">{assoc.clicks.toLocaleString()}</span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Lifetime Redirects</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-black text-emerald-500">₹{assoc.payoutDue.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ref Link Generator */}
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-skyline-primary rounded-xl flex items-center justify-center">
                      <LinkIcon size={20} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter">Ref Link Generator</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target CloudBasket URL</label>
                      <input 
                        type="text" 
                        value={generateUrl}
                        onChange={(e) => setGenerateUrl(e.target.value)}
                        placeholder="https://cloudbasket.in/products/..."
                        className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-1 focus:ring-skyline-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Associate</label>
                      <select 
                        value={selectedAssociateCode}
                        onChange={(e) => setSelectedAssociateCode(e.target.value)}
                        className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-xs font-bold focus:ring-1 focus:ring-skyline-primary outline-none appearance-none"
                      >
                        {associates.map(a => (
                          <option key={a.id} value={a.refCode} className="bg-gray-900">{a.name} ({a.refCode})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {generateUrl && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <code className="text-[10px] font-bold text-skyline-primary break-all">{generatedRefLink}</code>
                       <button 
                        onClick={() => copyToClipboard(generatedRefLink)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-skyline-primary hover:text-white transition-all active:scale-95 shrink-0 flex items-center gap-2"
                       >
                         {copiedCode === generatedRefLink ? <CheckCircle2 size={14} /> : <Copy size={14} />} Copy
                       </button>
                    </div>
                  )}
               </div>
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#009DFF33_0%,_transparent_70%)]" />
            </div>
          </div>

          {/* Payment Request Log */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tighter">Payment Log</h3>
              </div>

              <div className="space-y-4">
                {paymentRequests.map((req) => (
                  <div key={req.id} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 relative group overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-xs font-black mb-1">{req.name}</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">₹{req.amount.toLocaleString()}</p>
                      </div>
                      <div className={`p-1.5 rounded-full ${
                        req.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600 animate-pulse'
                      }`}>
                        {req.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 relative z-10">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{req.date}</p>
                      {req.status === 'Pending' && (
                        <div className="flex gap-2">
                           <button className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"><CheckCircle size={14} /></button>
                           <button className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"><XCircle size={14} /></button>
                        </div>
                      )}
                    </div>
                    {/* Hover flair */}
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-skyline-primary hover:text-skyline-primary transition-all">
                View Full Audit History
              </button>
            </div>

            <div className="bg-skyline-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-sky-500/20">
               <h4 className="text-lg font-black tracking-tighter mb-2">Payout Threshold</h4>
               <p className="text-white/70 text-xs font-medium leading-relaxed mb-6">Associates become eligible for payout once their balance exceeds ₹1,000.</p>
               <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[75%]" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest mt-3">₹45,200 Total Paid to Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
