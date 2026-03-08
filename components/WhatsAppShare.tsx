'use client'

import Link from 'next/link'

interface WhatsAppShareProps {
  productName: string
  price: number
  url?: string
}

export default function WhatsAppShare({ productName, price, url }: WhatsAppShareProps) {
  const message = ` Check out ${productName} at just ₹${price.toLocaleString('en-IN')}!\nFound on CloudBasket — India's best price comparison.\n${url ?? 'https://cloudbasket.vercel.app'}`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

  return (
    <Link
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="cb-btn gap-2 border-[#25D366] bg-[#25D366] text-sm text-white hover:bg-[#128C7E]"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.554 4.1 1.523 5.824L0 24l6.336-1.501A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.001-1.366l-.359-.214-3.722.881.896-3.634-.234-.373A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" />
      </svg>
      Share on WhatsApp
    </Link>
  )
}
