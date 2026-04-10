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

jest.mock('@/services/price-engine/tracker', () => ({
  priceTracker: {
    trackProduct: jest.fn(),
    getPriceHistory: jest.fn(),
    getPriceDrop: jest.fn(),
  },
}))

jest.mock('@/lib/env', () => ({
  env: {
    INTERNAL_API_KEY: '',
  },
}))

const { rateLimit } = require('@/lib/redis')
const { priceTracker } = require('@/services/price-engine/tracker')

function loadModule() {
  return require('@/app/api/price-tracker/route')
}

function createRequest(body, ip = '203.0.113.11') {
  return {
    json: jest.fn(async () => body),
    headers: {
      get: jest.fn((name) => {
        if (name === 'x-forwarded-for') return ip
        if (name === 'x-api-key') return null
        return null
      }),
    },
    nextUrl: {
      searchParams: new URLSearchParams(),
    },
  }
}

describe('app/api/price-tracker/route', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    rateLimit.mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: 0,
    })
    priceTracker.trackProduct.mockResolvedValue(undefined)
  })

  test('valid input returns 200', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      productId: 'B08XYZ1234',
      price: 1999,
      platform: 'amazon',
    }))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true })
    expect(priceTracker.trackProduct).toHaveBeenCalledWith('B08XYZ1234', 1999, 'amazon')
  })

  test('missing required field returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      price: 1999,
      platform: 'amazon',
    }))

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: 'Please correct the highlighted fields.',
      fieldErrors: {
        productId: expect.any(String),
      },
    })
  })

  test('invalid field type returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      productId: 'B08XYZ1234',
      price: '1999',
      platform: 'amazon',
    }))

    expect(response.status).toBe(400)
    expect(response.body.fieldErrors.price).toEqual(expect.any(String))
  })

  test('rate limit exceeded returns 429', async () => {
    rateLimit.mockResolvedValue({
      success: false,
      limit: 20,
      remaining: 0,
      reset: 1000,
    })

    const { POST } = loadModule()
    const response = await POST(createRequest({
      productId: 'B08XYZ1234',
      price: 1999,
    }))

    expect(response.status).toBe(429)
    expect(response.body).toEqual({
      error: 'Too many requests. Please try again shortly.',
    })
    expect(priceTracker.trackProduct).not.toHaveBeenCalled()
  })

  test('service error returns 500', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    priceTracker.trackProduct.mockRejectedValue(new Error('track failed'))

    const { POST } = loadModule()
    const response = await POST(createRequest({
      productId: 'B08XYZ1234',
      price: 1999,
    }))

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      error: 'Failed to track price',
    })

    errorSpy.mockRestore()
  })

  test('strict schema rejects extra fields with 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      productId: 'B08XYZ1234',
      price: 1999,
      platform: 'amazon',
      extra: true,
    }))

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: 'Please correct the highlighted fields.',
    })
  })
})
