'use client'

import Link from 'next/link'

const BRAND  = '#039BE5'
const CTA    = '#E65100'

export default function RegisterPage() {
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
          <h1 className="mt-4 text-xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Free forever. No credit card required.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form method="POST" action="/api/auth/register" className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Aarav"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5]"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Sharma"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5]"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5]"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="underline hover:text-gray-700">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>.
                DPDP Act 2023 compliant.
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: CTA }}
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: BRAND }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
