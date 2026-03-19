'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const STORAGE_KEY = 'cb_theme'

function setDocumentTheme(theme: 'dark' | 'light') {
  try {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  } catch {
    // Ignore if document not available
  }
}

function getPreferredTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch {
    // Ignore storage access errors
  }

  return 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const preferredTheme = getPreferredTheme()
    setTheme(preferredTheme)
    setDocumentTheme(preferredTheme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const newTheme = event.matches ? 'dark' : 'light'
        setTheme(newTheme)
        setDocumentTheme(newTheme)
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(listener)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', listener)
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(listener)
      }
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'

    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }

    setTheme(next)
    setDocumentTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-panel inline-flex h-9 w-9 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
