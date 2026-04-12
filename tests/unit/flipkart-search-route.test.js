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

jest.mock('@/services/apis/flipkart-affiliate', () => ({
  flipkartAPI: {
    searchProducts: jest.fn(),
  },
}))

const { rateLimit } = require('@/lib/redis')
const { flipkartAPI } = require('@/services/apis/flipkart-affiliate')

function loadModule() {
  return require('@/app/api/flipkart/search/route')
}

function createRequest(query = '', category = 'mobiles', ip = '203.0.113.21') {
  const params = new URLSearchParams()
  if (query !== undefined) params.set('q', query)
  if (category !== undefined) params.set('category', category)

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

describe('app/api/flipkart/search/route', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    rateLimit.mockResolvedValue({
      success: true,
      limit: 30,
      remaining: 29,
      reset: 0,
    })
    flipkartAPI.searchProducts.mockResolvedValue([{ productId: 'FK1' }])
  })

  test('valid input returns 200', async () => {
    const { GET } = loadModule()
    const response = await GET(createRequest('phone', 'mobiles'))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      products: [{ productId: 'FK1' }],
      count: 1,
    })
    expect(flipkartAPI.searchProducts).toHaveBeenCalledWith('phone', 'mobiles')
  })

  test('invalid input returns 400', async () => {
    const { GET } = loadModule()
    const response = await GET(createRequest('', 'mobiles'))

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
    const response = await GET(createRequest('phone', 'mobiles'))

    expect(response.status).toBe(429)
    expect(response.body).toEqual({
      error: 'Too many requests. Please try again shortly.',
    })
    expect(flipkartAPI.searchProducts).not.toHaveBeenCalled()
  })
})
