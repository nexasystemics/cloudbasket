'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Standard Error Boundary for CloudBasket.
 * Catches runtime errors in child components and displays a fallback UI.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info)
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-100 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Something went wrong</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#039BE5] px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#0288cc] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
