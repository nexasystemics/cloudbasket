// Estimated: ~100 lines
// Purpose: Dynamic OpenGraph image generation with support for different themes (category, product).

import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const clampTitle = (value: string): string => {
  return value.length > 80 ? `${value.slice(0, 80)}...` : value
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const { searchParams } = request.nextUrl
  const title = clampTitle(searchParams.get('title') ?? 'CloudBasket — Everything in One Basket')
  const subtitle = searchParams.get('sub') ?? "The World's Smartest Price Aggregator"
  const type = searchParams.get('type') ?? 'default'

  let backgroundColor = '#09090B' // Default zinc-950
  if (type === 'category') backgroundColor = '#039BE5' // cb-primary blue
  if (type === 'product') backgroundColor = '#0F172A' // slate-900 navy

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: backgroundColor,
          padding: 60,
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              background: type === 'category' ? 'white' : '#039BE5',
              fontSize: 24,
              fontWeight: 900,
              color: type === 'category' ? '#039BE5' : 'white',
            }}
          >
            CB
          </div>
          <div style={{ fontSize: 48, fontWeight: 900 }}>CloudBasket</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.1 }}>{title}</div>
          <div style={{ marginTop: 16, color: type === 'category' ? 'rgba(255,255,255,0.8)' : '#94A3B8', fontSize: 32 }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: type === 'category' ? 'white' : '#039BE5', fontSize: 28, fontFamily: 'monospace' }}>cloudbasket.co</div>
          <div
            style={{
              borderRadius: 999,
              background: type === 'category' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(3, 155, 229, 0.15)',
              color: type === 'category' ? 'white' : '#039BE5',
              padding: '10px 18px',
              fontSize: 24,
            }}
          >
            Price Discovery · Zero Checkout
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
