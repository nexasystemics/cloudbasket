// next.config.ts
// A19: Added India catalog CDN domains to remotePatterns.

import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https:",
  "frame-src 'self' https:",
  'upgrade-insecure-requests',
].join('; ')

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/**' },
      { protocol: 'https', hostname: 'rukminim2.flixcart.com', pathname: '/**' },
      { protocol: 'https', hostname: 'rukminim1.flixcart.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.cjdropshipping.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      // India Catalog CDN domains
      { protocol: 'https', hostname: 'www.boat-lifestyle.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.noisefit.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.puma.com', pathname: '/**' },
      { protocol: 'https', hostname: 'assets.ajio.com', pathname: '/**' },
      { protocol: 'https', hostname: 'assets.myntassets.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.hul.co.in', pathname: '/**' },
      { protocol: 'https', hostname: 'www.dabur.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.itcportals.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.godrejcp.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.bajajelectricals.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.havells.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.philips.co.in', pathname: '/**' },
      { protocol: 'https', hostname: 'www.prestigesmartchef.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  httpAgentOptions: { keepAlive: true },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
}

export default withBundleAnalyzer(nextConfig)