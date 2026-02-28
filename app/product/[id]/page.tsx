'use client'

import React, { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { PRODUCTS } from '@/lib/mock-data'
import { useCart } from '@/context/CartContext'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params)
  const product = PRODUCTS.find((p) => p.id === parseInt(resolvedParams.id))
  const { addToCart } = useCart()

  if (!product) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#039BE5] transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Link>
      </div>

      {/* Product Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-block bg-[#039BE5]/10 text-[#039BE5] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-3xl font-black text-gray-900 tracking-tighter">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                  In Stock
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {product.description}
              </p>
              
              <div className="pt-6 border-t border-gray-100 space-y-6">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#039BE5] hover:bg-[#0288D1] text-white py-5 rounded-2xl font-black text-lg tracking-tight transition-all shadow-xl shadow-[#039BE5]/20 active:scale-95 flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag size={24} className="group-hover:rotate-12 transition-transform" />
                  Add to Basket
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <Truck size={20} className="text-gray-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <ShieldCheck size={20} className="text-gray-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <RotateCcw size={20} className="text-gray-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Affiliate Disclosure</h3>
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-tighter">
                CloudBasket is a participant in global affiliate programs. We may earn a small commission 
                on purchases made through our links at no extra cost to you.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
