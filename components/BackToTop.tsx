// Purpose: Provides a site-wide floating shortcut back to the top of the page.
'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export interface BackToTopProps {}

export default function BackToTop(_: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-skyline-primary text-white shadow-lg ${
        prefersReducedMotion
          ? isVisible
            ? 'block'
            : 'hidden'
          : `transition-all duration-200 ${isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`
      }`}
    >
      <ArrowUp size={18} />
    </button>
  )
}
