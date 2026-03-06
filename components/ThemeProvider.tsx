'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

interface CBThemeProviderProps {
  children: ReactNode
}

export default function CBThemeProvider({ children }: CBThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}
