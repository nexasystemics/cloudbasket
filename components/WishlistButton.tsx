'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface WishlistButtonProps {
  productId: string
  productName: string
}

type WishlistEntry = {
  id: string
  name: string
  addedAt: number
}

export default function WishlistButton({ productId, productName }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('cb-wishlist') ?? '[]') as WishlistEntry[]
      setIsWishlisted(existing.some((item) => item.id === productId))
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      setIsWishlisted(false)
    }
  }, [productId])

  const toggleWishlist = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('cb-wishlist') ?? '[]') as WishlistEntry[]
      const alreadyWishlisted = existing.some((item) => item.id === productId)

      if (alreadyWishlisted) {
        const updated = existing.filter((item) => item.id !== productId)
        localStorage.setItem('cb-wishlist', JSON.stringify(updated))
        setIsWishlisted(false)
        setFeedback('Removed')
      } else {
        const updated = [...existing, { id: productId, name: productName, addedAt: Date.now() }]
        localStorage.setItem('cb-wishlist', JSON.stringify(updated))
        setIsWishlisted(true)
        setFeedback('Added to wishlist ✓')
      }
    } catch (error) {
      console.error('Failed to update localStorage:', error)
      setFeedback('Error updating wishlist')
    }

    window.setTimeout(() => setFeedback(''), 2000)
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={`cb-btn gap-2 ${isWishlisted ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'cb-btn-ghost'}`}
        onClick={toggleWishlist}
      >
        <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        {isWishlisted ? 'Wishlisted' : 'Wishlist'}
      </button>
      {feedback ? <p className="text-muted absolute -bottom-6 left-0 text-xs">{feedback}</p> : null}
    </div>
  )
}
