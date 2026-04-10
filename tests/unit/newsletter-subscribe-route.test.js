jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      body,
    })),
  },
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/redis', () => ({
  rateLimit: jest.fn(),
}))

const { createClient } = require('@supabase/supabase-js')
const { rateLimit } = require('@/lib/redis')

function loadModule() {
  return require('@/app/api/newsletter/subscribe/route')
}

function createRequest(body, ip = '203.0.113.10') {
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

function createSupabaseMock(result = { error: null }) {
  const upsert = jest.fn(async () => result)
  const from = jest.fn(() => ({ upsert }))
  return { from, upsert }
}

describe('app/api/newsletter/subscribe/route', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.test',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role',
    }
    rateLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: 0,
    })
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('valid input returns 200', async () => {
    const supabase = createSupabaseMock()
    createClient.mockReturnValue(supabase)

    const { POST } = loadModule()
    const response = await POST(createRequest({
      email: 'user@example.com',
      preferences: { deals: true },
    }))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true })
    expect(supabase.upsert).toHaveBeenCalled()
  })

  test('missing required field returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      preferences: { deals: true },
    }))

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      success: false,
      error: 'Please correct the highlighted fields.',
      fieldErrors: {
        email: expect.any(String),
      },
    })
  })

  test('invalid field type returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      email: 123,
      preferences: { deals: true },
    }))

    expect(response.status).toBe(400)
    expect(response.body.fieldErrors.email).toEqual(expect.any(String))
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
      email: 'user@example.com',
    }))

    expect(response.status).toBe(429)
    expect(response.body).toEqual({
      success: false,
      error: 'Too many requests. Please try again shortly.',
    })
    expect(createClient).not.toHaveBeenCalled()
  })

  test('Supabase insert error returns 500', async () => {
    const supabase = createSupabaseMock({ error: { message: 'insert failed' } })
    createClient.mockReturnValue(supabase)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { POST } = loadModule()
    const response = await POST(createRequest({
      email: 'user@example.com',
    }))

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      error: 'Failed to subscribe.',
    })

    errorSpy.mockRestore()
  })

  test('strict schema rejects extra fields with 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      email: 'user@example.com',
      preferences: { deals: true },
      extra: 'nope',
    }))

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      success: false,
      error: 'Please correct the highlighted fields.',
    })
  })
})
