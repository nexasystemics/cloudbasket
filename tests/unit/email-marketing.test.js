jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

jest.mock('resend', () => ({
  Resend: jest.fn(),
}))

const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

function loadModule() {
  return require('@/services/email-engine/email-marketing')
}

describe('services/email-engine/email-marketing', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'resend-key',
      NEXT_PUBLIC_SUPABASE_URL: 'https://supabase.test',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('sendNewsletter sends to all recipients and marks campaign sent', async () => {
    const send = jest.fn(async () => ({ error: null }))
    Resend.mockImplementation(() => ({
      emails: { send },
    }))

    const { emailMarketing } = loadModule()
    const campaign = await emailMarketing.sendNewsletter({
      subject: 'Weekly Picks',
      previewText: 'Top deals this week',
      htmlContent: '<p>Deals</p>',
      recipients: ['A@example.com', 'b@example.com', 'a@example.com'],
    })

    expect(campaign.status).toBe('sent')
    expect(campaign.sentAt).toEqual(expect.any(String))
    expect(campaign.recipients).toEqual(['a@example.com', 'b@example.com'])
    expect(send).toHaveBeenCalledTimes(2)
  })

  test('subscribeContact upserts to email_subscribers', async () => {
    const upsert = jest.fn(async () => ({ error: null }))
    createClient.mockReturnValue({
      from: jest.fn(() => ({ upsert })),
    })

    const { emailMarketing } = loadModule()
    const result = await emailMarketing.subscribeContact({
      email: 'User@Example.com',
      name: 'User',
      tags: ['weekly'],
    })

    expect(result).toBe(true)
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      email: 'user@example.com',
      name: 'User',
      tags: ['weekly'],
      unsubscribed_at: null,
    }), { onConflict: 'email' })
  })

  test('subscribeContact returns false when Supabase upsert fails', async () => {
    const upsert = jest.fn(async () => ({ error: { message: 'insert failed' } }))
    createClient.mockReturnValue({
      from: jest.fn(() => ({ upsert })),
    })
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { emailMarketing } = loadModule()
    const result = await emailMarketing.subscribeContact({
      email: 'user@example.com',
    })

    expect(result).toBe(false)
    warnSpy.mockRestore()
  })
})
