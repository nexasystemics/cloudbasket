'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Truck, CreditCard, ChevronRight } from 'lucide-react'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate API call for "high-end" feel
    setTimeout(() => {
      clearCart()
      router.push('/order-success')
    }, 1500)
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-sm w-full">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowLeft size={32} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Your basket is empty</h1>
          <p className="text-gray-500 mb-8 font-medium">Add some items to start your checkout.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center w-full bg-[#039BE5] text-white py-4 rounded-2xl font-black hover:bg-[#0288D1] transition-all shadow-lg active:scale-95"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] pb-20 font-sans">
      {/* Mini Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter group">
            <span className="text-[#039BE5] group-hover:scale-110 transition-transform duration-300">Cloud</span>
            <span className="text-[#36454F]">Basket</span>
          </Link>
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <ShieldCheck size={14} className="text-emerald-500" />
            Secure Apple-Pay Style Checkout
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">
          <Link href="/" className="hover:text-[#039BE5] transition-colors">Basket</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Shipping</span>
          <ChevronRight size={12} />
          <span>Payment</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping Form */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black">1</div>
                <h2 className="text-2xl font-black tracking-tight">Shipping Details</h2>
              </div>
              
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#039BE5]/10 focus:border-[#039BE5] outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="rahul@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#039BE5]/10 focus:border-[#039BE5] outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Apartment, Suite, Street name"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#039BE5]/10 focus:border-[#039BE5] outline-none transition-all font-medium placeholder:text-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Mumbai"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#039BE5]/10 focus:border-[#039BE5] outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">State</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Maharashtra"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#039BE5]/10 focus:border-[#039BE5] outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">PIN Code</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="400001"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#039BE5]/10 focus:border-[#039BE5] outline-none transition-all font-medium placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </form>
            </section>

            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black">2</div>
                <h2 className="text-2xl font-black tracking-tight">Payment Method</h2>
              </div>
              
              <div className="p-6 border-2 border-[#039BE5] bg-[#039BE5]/5 rounded-3xl flex items-center justify-between group cursor-pointer transition-all hover:bg-[#039BE5]/10">
                <div className="flex items-center gap-5">
                  <div className="bg-[#039BE5] p-3 rounded-2xl text-white shadow-lg shadow-[#039BE5]/20">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pay ₹{totalPrice.toLocaleString('en-IN')} upon arrival</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-[#039BE5] flex items-center justify-center bg-white">
                  <div className="w-4 h-4 rounded-full bg-[#039BE5] animate-pulse" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-black tracking-tight mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-10 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-5 group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 group-hover:shadow-md transition-shadow">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-sm font-black text-gray-900 line-clamp-1 leading-tight">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-gray-400">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100">
                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-black">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-100">
                  <span className="text-lg font-black tracking-tight">Total</span>
                  <span className="text-3xl font-black text-[#039BE5]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className={`w-full mt-10 py-5 rounded-2xl font-black text-xl tracking-tight transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${
                  isProcessing 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowLeft size={20} className="rotate-180" />
                  </>
                )}
              </button>

              <div className="mt-8 flex flex-col items-center gap-4 py-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <Truck size={14} className="text-[#039BE5]" />
                  Delivery: 3-5 Working Days
                </div>
                <div className="flex gap-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-5 bg-gray-50 rounded border border-gray-100" />
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
