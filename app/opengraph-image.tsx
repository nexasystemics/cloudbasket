import { ImageResponse } from 'next/og'
import { SITE_TAGLINE } from '@/lib/constants'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#0B1F35',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
          <span
            style={{
              color: '#039BE5',
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: '-3px',
            }}
          >
            Cloud
          </span>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: '-3px',
            }}
          >
            Basket
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#F5C518',
            fontSize: 30,
            fontWeight: 700,
            marginTop: 20,
            letterSpacing: '0.1em',
          }}
        >
          {SITE_TAGLINE}
        </div>

        {/* Subtext */}
        <div
          style={{
            color: '#94A3B8',
            fontSize: 20,
            fontWeight: 400,
            marginTop: 16,
          }}
        >
          {"India's smartest price discovery platform"}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            color: '#4A6480',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.15em',
          }}
        >
          NEXQON HOLDINGS
        </div>
      </div>
    ),
    size,
  )
}
