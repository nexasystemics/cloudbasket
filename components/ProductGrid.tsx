'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, SearchX, ShoppingBag } from 'lucide-react'
import { Product } from '@/lib/mock-data'
import { useCart } from '@/context/CartContext'

interface ProductGridProps {
  products: Product[]
  onReset: () => void
}

export default function ProductGrid({ products, onReset }: ProductGridProps) {
  const { addToCart } = useCart()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
          <SearchX size={48} className="text-gray-300" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500 mb-8 max-w-sm px-4">
          We couldn't find any items matching your current filters. Try adjusting your search, 
          categories, or price range.
        </p>
        <button
          onClick={onReset}
          className="bg-[#039BE5] hover:bg-[#0288D1] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          Reset All Filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
        >
          {/* Optimized Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-gray-900 px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                {product.category}
              </span>
            </div>
            
            {/* Quick Add Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => addToCart(product)}
                className="bg-white text-[#039BE5] p-4 rounded-full shadow-xl hover:bg-[#039BE5] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 active:scale-90"
                aria-label="Add to basket"
              >
                <ShoppingBag size={24} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#039BE5] transition-colors duration-300">
                {product.name}
              </h3>
            </div>
            <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="space-y-4 mt-auto">
              <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                <span className="text-xl font-black text-gray-900 tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter text-gray-400 hover:text-[#039BE5] transition-colors group/btn"
                >
                  Details
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-gray-50 hover:bg-[#039BE5] text-gray-900 hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
