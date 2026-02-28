'use client'

import Link from 'next/link'

const BRAND  = '#039BE5'
const CTA    = '#E65100'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-extrabold tracking-tight" style={{ color: BRAND }}>
              Cloud<span style={{ color: CTA }}>Basket</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form method="POST" action="/api/auth/login" className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: BRAND }}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: CTA }}
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: BRAND }}>
              Create one free
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By signing in you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  )
}
