'use client'

import { useCart } from '@/context/CartContext'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    totalPrice 
  } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-[#039BE5]/10 p-2 rounded-lg">
              <ShoppingBag size={20} className="text-[#039BE5]" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Your Basket</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="bg-gray-50 p-8 rounded-full">
                <ShoppingBag size={48} className="text-gray-200" />
              </div>
              <p className="text-gray-500 font-medium">Your basket is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#039BE5] font-bold text-sm hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                    {item.category}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-black text-gray-900 min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-black text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-gray-900">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              Taxes and shipping calculated at checkout. Free shipping on orders over ₹5,000.
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="flex items-center justify-center gap-3 w-full bg-[#039BE5] hover:bg-[#0288D1] text-white py-4 rounded-xl font-black tracking-tight transition-all shadow-lg active:scale-95 group"
            >
              Proceed to Checkout
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
