/**
 * Environment variables validation and export.
 * This module ensures that required environment variables are present and provides a typed interface.
 */

if (typeof window === 'undefined') {
  // Server-side validation
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SITE_URL',
  ]

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.warn(`[lib/env] WARNING: Missing environment variable: ${envVar}`)
    }
  })
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudbasket.in',
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
