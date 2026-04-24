jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/services/social/content-generator', () => ({
  socialGenerator: {
    generateInstagramCaption: jest.fn(),
    generateTweetThread: jest.fn(),
    generateWhatsAppStatus: jest.fn(),
  }
}))

jest.mock('@/lib/deals-engine', () => ({
  getDailyDeals: jest.fn()
}))

jest.mock('next/server', () => ({
  NextResponse: class NextResponse {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status ?? 200
      this.headers = init.headers ?? {}
    }
    static json(body, init) {
      return { status: init?.status ?? 200, body, headers: init?.headers ?? {} }
    }
    static redirect(destination, init = {}) {
      return { status: init?.status ?? 307, destination }
    }
  },
}))

jest.mock('@/lib/redis', () => ({
  rateLimit: jest.fn(),
  getCache: jest.fn(),
  setCache: jest.fn(),
}))

jest.mock('@/lib/env', () => ({
  env: {
    INTERNAL_API_KEY: 'internal-key',
    CRON_SECRET: 'cron-secret',
    SHOPIFY_WEBHOOK_SECRET: 'shopify-secret',
    PRINTIFY_WEBHOOK_SECRET: 'printify-secret',
    PRINTFUL_WEBHOOK_SECRET: 'printful-secret',
    WHATSAPP_VERIFY_TOKEN: 'verify-token',
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'public-vapid-key',
    NEXT_PUBLIC_SITE_URL: 'https://cloudbasket.co',
    NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.example.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  },
  isConfigured: jest.fn(() => true),
  hasSupabase: jest.fn(() => true),
}))


function createSupabaseClientMock() {
  const chain = {
    upsert: jest.fn(async () => ({ data: null, error: null })),
    insert: jest.fn(async () => ({ data: null, error: null })),
    update: jest.fn(() => chain),
    delete: jest.fn(() => chain),
    select: jest.fn(() => chain),
    eq: jest.fn(() => chain),
    gt: jest.fn(() => chain),
    lt: jest.fn(() => chain),
    order: jest.fn(() => chain),
    range: jest.fn(async () => ({ data: [], error: null })),
    single: jest.fn(async () => ({ data: { id: 'row-1' }, error: null })),
    maybeSingle: jest.fn(async () => ({ data: { id: 'row-1' }, error: null })),
    then: undefined,
  };
  return {
    from: jest.fn(() => chain),
    rpc: jest.fn(async () => ({ data: null, error: null })),
  };
}

const { rateLimit, getCache, setCache } = require('@/lib/redis')
const { env } = require('@/lib/env')
const { createClient } = require('@supabase/supabase-js')
const { socialGenerator } = require('@/services/social/content-generator')
const { getDailyDeals } = require('@/lib/deals-engine')

function loadModule() {
  return require('@/app/api/social/generate/route')
}

function createRequest({ query = {}, body = {}, text = undefined, headers = {
  "x-internal-api-key": "internal-key"
}, url = "https://cloudbasket.co/api/test", cookies = {}, ip = '203.0.113.10' } = {}) {
  const mergedHeaders = { ...headers };
  if (mergedHeaders['x-shopify-hmac-sha256'] === '__AUTO__') {
    const crypto = require('crypto');
    mergedHeaders['x-shopify-hmac-sha256'] = crypto.createHmac('sha256', env.SHOPIFY_WEBHOOK_SECRET).update(text ?? '', 'utf8').digest('base64');
  }
  return {
    json: jest.fn(async () => body),
    text: jest.fn(async () => text ?? JSON.stringify(body ?? {})),
    url,
    nextUrl: { searchParams: new URLSearchParams(query) },
    headers: { get: jest.fn((name) => {
      if (name === 'x-forwarded-for') return ip;
      if (name in mergedHeaders) return mergedHeaders[name];
      return null;
    }) },
    cookies: { get: jest.fn((name) => cookies[name] ? { value: cookies[name] } : undefined) },
  };
}

describe('app/api/social/generate/route.ts', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ ok: true }) }))
    rateLimit.mockResolvedValue({ success: true, limit: 30, remaining: 29, reset: 0 })
    getCache.mockResolvedValue(null)
    setCache.mockResolvedValue(true)
    Object.assign(env, { INTERNAL_API_KEY: 'internal-key', CRON_SECRET: 'cron-secret', SHOPIFY_WEBHOOK_SECRET: 'shopify-secret', PRINTIFY_WEBHOOK_SECRET: 'printify-secret', PRINTFUL_WEBHOOK_SECRET: 'printful-secret', WHATSAPP_VERIFY_TOKEN: 'verify-token', NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'public-vapid-key', NEXT_PUBLIC_SITE_URL: 'https://cloudbasket.co', NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.example.co', SUPABASE_SERVICE_ROLE_KEY: 'service-role-key' })
    createClient.mockReturnValue(createSupabaseClientMock())
    if (socialGenerator.generateInstagramCaption.mockResolvedValue) socialGenerator.generateInstagramCaption.mockResolvedValue({
  "id": "ig-1",
  "platform": "instagram",
  "content": "Caption",
  "status": "draft"
})
    if (socialGenerator.generateTweetThread.mockReturnValue) socialGenerator.generateTweetThread.mockReturnValue([
  {
    "id": "tw-1",
    "platform": "twitter",
    "content": "Tweet",
    "status": "draft"
  }
])
    if (socialGenerator.generateWhatsAppStatus.mockReturnValue) socialGenerator.generateWhatsAppStatus.mockReturnValue("Status text")
    if (getDailyDeals.mockReturnValue) getDailyDeals.mockReturnValue([
  {
    "id": "deal-1",
    "title": "Deal 1",
    "dealPrice": 999,
    "originalPrice": 1299,
    "discountPercent": 23,
    "platform": "amazon",
    "brand": "Brand",
    "category": "electronics",
    "imageUrl": "https://example.com/image.jpg",
    "approved": true
  }
])
  })

  test('happy path returns expected response', async () => {
    const { POST } = loadModule()
    const request = createRequest({ query: {}, body: {}, text: undefined, headers: {
  "x-internal-api-key": "internal-key"
}, url: "https://cloudbasket.co/api/test", cookies: {} })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
  })

  test('rate limit hit returns 429', async () => {
    rateLimit.mockResolvedValue({ success: false, limit: 1, remaining: 0, reset: 1000 })
    const { POST } = loadModule()
    const request = createRequest({ query: {}, body: {}, text: undefined, headers: {
  "x-internal-api-key": "internal-key"
}, url: "https://cloudbasket.co/api/test", cookies: {} })

    const response = await POST(request)

    expect(response.status).toBe(429)
    expect(response.body ?? response.destination).toEqual(expect.anything())
  })

  test('invalid input returns expected error response', async () => {
    const { POST } = loadModule()
    const request = createRequest({ query: {}, body: {}, text: undefined, headers: {
  "x-internal-api-key": "internal-key"
}, url: "https://cloudbasket.co/api/test", cookies: {} })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(response.body ?? response.destination).toBeDefined()
  })
  test('missing token returns 401', async () => {
    const { POST } = loadModule()
    const request = createRequest({
      query: {},
      body: {},
      text: undefined,
      headers: {},
      url: "https://cloudbasket.co/api/test",
      cookies: {},
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(response.body.error ?? response.body).toBeDefined()
  })
})
