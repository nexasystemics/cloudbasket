'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)

  // Your WhatsApp number (replace with actual)
  const phoneNumber = '919876543210' // Format: country code + number (no + or spaces)
  const message = 'Hi! I have a question about CloudBasket.'

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900"></div>
        </div>
      )}
    </a>
  )
}
