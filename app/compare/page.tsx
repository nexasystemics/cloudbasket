'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, X, Check, ExternalLink, Share2, ChevronRight } from 'lucide-react'

const purpleTheme = '#039BE5'

interface Product {
  id: string
  name: string
  price: string
  rating: number
  brand: string
  image: string
  specs: {
    processor: string
    camera: string
    display: string
    battery: string
    has5G: boolean
    hasWirelessCharging: boolean
    hasWaterResistance: boolean
    warranty: string
  }
  pros: string[]
  cons: string[]
  amazonLink: string
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: '₹1,34,900',
    rating: 4.8,
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    specs: {
      processor: 'A17 Pro',
      camera: '48MP',
      display: '6.1" OLED',
      battery: '3274 mAh',
      has5G: true,
      hasWirelessCharging: true,
      hasWaterResistance: true,
      warranty: '1 Year',
    },
    pros: ['Best camera system', 'Premium build quality', 'Long software support'],
    cons: ['Expensive', 'No charger included', 'Limited customization'],
    amazonLink: '#',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: '₹79,999',
    rating: 4.7,
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP',
      display: '6.2" AMOLED',
      battery: '4000 mAh',
      has5G: true,
      hasWirelessCharging: true,
      hasWaterResistance: true,
      warranty: '1 Year',
    },
    pros: ['Excellent display', 'Great performance', 'Good battery life'],
    cons: ['One UI can be heavy', 'Pricey', 'Fast charging slower'],
    amazonLink: '#',
  },
  {
    id: '3',
    name: 'OnePlus 12',
    price: '₹64,999',
    rating: 4.6,
    brand: 'OnePlus',
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&h=400&fit=crop',
    specs: {
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP',
      display: '6.82" AMOLED',
      battery: '5400 mAh',
      has5G: true,
      hasWirelessCharging: true,
      hasWaterResistance: true,
      warranty: '1 Year',
    },
    pros: ['Fast charging', 'Great value', 'Smooth software'],
    cons: ['Camera not flagship level', 'Large size', 'Limited availability'],
    amazonLink: '#',
  },
]

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')

  const addProduct = () => {
    // Placeholder for add product functionality
    console.log('Add product')
  }

  const removeProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id))
  }

  const shareComparison = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Product Comparison',
        text: 'Check out this product comparison on CloudBasket',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#039BE5] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Compare</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="py-16 px-4 text-white"
        style={{ backgroundColor: purpleTheme }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Compare Products
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Make smarter buying decisions with side-by-side comparisons
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Slots */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((index) => {
            const product = selectedProducts[index]
            return (
              <div
                key={index}
                className={`rounded-xl border-2 p-6 ${
                  product
                    ? 'border-gray-200 bg-white shadow-sm'
                    : 'border-dashed border-[#039BE5]/40 bg-[#039BE5]/5'
                }`}
              >
                {product ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-contain rounded-lg mb-2" loading="lazy" />
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Remove product"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p
                      className="text-2xl font-bold mb-2"
                      style={{ color: purpleTheme }}
                    >
                      {product.price}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      <span className="font-medium text-amber-500">{product.rating} / 5</span>
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="w-full py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addProduct}
                    className="w-full h-full flex flex-col items-center justify-center py-12 text-gray-400 hover:text-[#039BE5] transition-colors"
                  >
                    <Plus className="w-12 h-12 mb-3" />
                    <span className="font-medium">Add Product</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        {selectedProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 p-4">
                <div className="font-semibold text-gray-700">Specification</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-center">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded mx-auto mb-2" loading="lazy" />
                    <div className="font-semibold text-sm text-gray-900">
                      {product.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {/* Price */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Price</div>
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="font-bold text-lg"
                    style={{ color: purpleTheme }}
                  >
                    {product.price}
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Rating</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-1">
                    <span className="font-semibold text-amber-500">{product.rating} / 5</span>
                  </div>
                ))}
              </div>

              {/* Brand */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Brand</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-gray-900">
                    {product.brand}
                  </div>
                ))}
              </div>

              {/* Processor */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Processor</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-gray-900">
                    {product.specs.processor}
                  </div>
                ))}
              </div>

              {/* Camera */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Camera</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-gray-900">
                    {product.specs.camera}
                  </div>
                ))}
              </div>

              {/* Display */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Display</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-gray-900">
                    {product.specs.display}
                  </div>
                ))}
              </div>

              {/* Battery */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Battery</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-gray-900">
                    {product.specs.battery}
                  </div>
                ))}
              </div>

              {/* 5G Support */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">5G Support</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    {product.specs.has5G ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Wireless Charging */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Wireless Charging</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    {product.specs.hasWirelessCharging ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Water Resistance */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Water Resistance</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    {product.specs.hasWaterResistance ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Warranty */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Warranty</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="text-gray-900">
                    {product.specs.warranty}
                  </div>
                ))}
              </div>

              {/* Pros */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Pros</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="space-y-1">
                    {product.pros.map((pro, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-green-700 flex items-start gap-1"
                      >
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Cons */}
              <div className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-700">Cons</div>
                {selectedProducts.map((product) => (
                  <div key={product.id} className="space-y-1">
                    {product.cons.map((con, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-red-700 flex items-start gap-1"
                      >
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* View on Amazon */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-[#039BE5]/5">
                <div className="font-medium text-gray-700">Buy Now</div>
                {selectedProducts.map((product) => (
                  <a
                    key={product.id}
                    href={product.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: purpleTheme }}
                  >
                    View on Amazon
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      {selectedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSelectedProducts([])}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Start New Comparison
            </button>
            <button
              onClick={() => console.log('Save comparison')}
              className="px-6 py-3 rounded-lg border-2 font-semibold hover:bg-sky-50 transition-colors"
              style={{ borderColor: purpleTheme, color: purpleTheme }}
            >
              Save Comparison
            </button>
            <button
              onClick={shareComparison}
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: purpleTheme }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
