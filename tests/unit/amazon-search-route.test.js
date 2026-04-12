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

jest.mock('@/services/apis/amazon-pa-api', () => ({
  amazonAPI: {
    searchProducts: jest.fn(),
  },
}))

jest.mock('@/lib/env', () => ({
  env: {
    INTERNAL_API_KEY: '',
  },
}))

const { rateLimit } = require('@/lib/redis')
const { amazonAPI } = require('@/services/apis/amazon-pa-api')

function loadModule() {
  return require('@/app/api/amazon/search/route')
}

function createRequest(query = '', category = 'All', ip = '203.0.113.20') {
  const params = new URLSearchParams()
  if (query !== undefined) params.set('q', query)
  if (category !== undefined) params.set('category', category)

  return {
    headers: {
      get: jest.fn((name) => {
        if (name === 'x-forwarded-for') return ip
        if (name === 'x-internal-api-key') return null
        return null
      }),
    },
    nextUrl: {
      searchParams: params,
    },
  }
}

describe('app/api/amazon/search/route', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    rateLimit.mockResolvedValue({
      success: true,
      limit: 30,
      remaining: 29,
      reset: 0,
    })
    amazonAPI.searchProducts.mockResolvedValue([{ asin: 'B0TEST' }])
  })

  test('valid input returns 200', async () => {
    const { GET } = loadModule()
    const response = await GET(createRequest('headphones', 'Electronics'))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      products: [{ asin: 'B0TEST' }],
      count: 1,
    })
    expect(amazonAPI.searchProducts).toHaveBeenCalledWith('headphones', 'Electronics')
  })

  test('invalid input returns 400', async () => {
    const { GET } = loadModule()
    const response = await GET(createRequest('', 'Electronics'))

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(expect.any(String))
  })

  test('rate limit exceeded returns 429', async () => {
    rateLimit.mockResolvedValue({
      success: false,
      limit: 30,
      remaining: 0,
      reset: 1000,
    })

    const { GET } = loadModule()
    const response = await GET(createRequest('headphones', 'Electronics'))

    expect(response.status).toBe(429)
    expect(response.body).toEqual({
      error: 'Too many requests. Please try again shortly.',
    })
    expect(amazonAPI.searchProducts).not.toHaveBeenCalled()
  })
})
