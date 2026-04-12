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

jest.mock('@/services/associates/program', () => ({
  associateProgram: {
    applyForProgram: jest.fn(),
  },
}))

const { rateLimit } = require('@/lib/redis')
const { associateProgram } = require('@/services/associates/program')

function loadModule() {
  return require('@/app/api/associates/apply/route')
}

function createRequest(body, ip = '203.0.113.23') {
  return {
    json: jest.fn(async () => body),
    headers: {
      get: jest.fn((name) => {
        if (name === 'x-forwarded-for') return ip
        return null
      }),
    },
  }
}

describe('app/api/associates/apply/route', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    rateLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: 0,
    })
    associateProgram.applyForProgram.mockResolvedValue({
      id: 'CBTRACK1',
      status: 'pending',
      trackingCode: 'CBTRACK1',
    })
  })

  test('valid input returns 200', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      websiteUrl: 'https://example.com',
      category: 'tech',
    }))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: 'CBTRACK1',
      status: 'pending',
      trackingCode: 'CBTRACK1',
    })
    expect(associateProgram.applyForProgram).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      websiteUrl: 'https://example.com',
      platformType: 'website',
      niche: 'tech',
    })
  })

  test('invalid input returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'J',
      email: 'jane@example.com',
      websiteUrl: 'not-a-url',
    }))

    expect(response.status).toBe(400)
    expect(response.body.error).toEqual(expect.any(String))
  })

  test('rate limit exceeded returns 429', async () => {
    rateLimit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: 1000,
    })

    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      websiteUrl: 'https://example.com',
    }))

    expect(response.status).toBe(429)
    expect(response.body).toEqual({
      error: 'Too many requests. Please try again shortly.',
    })
    expect(associateProgram.applyForProgram).not.toHaveBeenCalled()
  })
})
