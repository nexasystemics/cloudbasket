jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      body,
    })),
  },
}))

jest.mock('@/lib/redis', () => ({
  rateLimit: jest.fn(),
}))

jest.mock('@/services/currency/exchange-rates', () => ({
  getExchangeRates: jest.fn(),
}))

const { rateLimit } = require('@/lib/redis')
const { getExchangeRates } = require('@/services/currency/exchange-rates')

function loadModule() {
  return require('@/app/api/currency/rates/route')
}

function createRequest(base = 'INR', ip = '203.0.113.22') {
  const params = new URLSearchParams()
  if (base !== undefined) params.set('base', base)

  return {
    headers: {
      get: jest.fn((name) => {
        if (name === 'x-forwarded-for') return ip
        return null
      }),
    },
    nextUrl: {
      searchParams: params,
    },
  }
}

describe('app/api/currency/rates/route', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    rateLimit.mockResolvedValue({
      success: true,
      limit: 60,
      remaining: 59,
      reset: 0,
    })
    getExchangeRates.mockResolvedValue({
      base: 'INR',
      rates: { USD: 0.012 },
      timestamp: new Date('2026-04-13T00:00:00.000Z'),
    })
  })

  test('valid input returns 200', async () => {
    const { GET } = loadModule()
    const response = await GET(createRequest('INR'))

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      base: 'INR',
      rates: { USD: 0.012 },
    })
    expect(getExchangeRates).toHaveBeenCalled()
  })

  test('invalid input returns 400', async () => {
    const { GET } = loadModule()
    const response = await GET(createRequest('USD'))

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(expect.any(String))
  })

  test('rate limit exceeded returns 429', async () => {
    rateLimit.mockResolvedValue({
      success: false,
      limit: 60,
      remaining: 0,
      reset: 1000,
    })

    const { GET } = loadModule()
    const response = await GET(createRequest('INR'))

    expect(response.status).toBe(429)
    expect(response.body).toEqual({
      error: 'Too many requests. Please try again shortly.',
    })
    expect(getExchangeRates).not.toHaveBeenCalled()
  })
})
