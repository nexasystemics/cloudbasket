'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/lib/mock-data'

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          {/* Optimized Image with Hover Effect */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col h-[220px]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">
              {product.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#039BE5] transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#039BE5] hover:text-[#0288D1] transition-colors"
              >
                View Details
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
