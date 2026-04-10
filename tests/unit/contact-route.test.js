jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      body,
    })),
  },
}))

jest.mock('resend', () => ({
  Resend: jest.fn(),
}))

const { Resend } = require('resend')

function loadModule() {
  return require('@/app/api/contact/route')
}

function createRequest(body, shouldThrow = false) {
  return {
    json: jest.fn(async () => {
      if (shouldThrow) {
        throw new Error('invalid json')
      }
      return body
    }),
  }
}

describe('app/api/contact/route', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'resend-key',
      CONTACT_EMAIL: 'contact@cloudbasket.co',
      RESEND_FROM_EMAIL: 'CloudBasket <hello@cloudbasket.co>',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('valid input returns 200', async () => {
    Resend.mockImplementation(() => ({
      emails: {
        send: jest.fn(async () => ({ error: null })),
      },
    }))

    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Need help',
      message: 'I need help with a product comparison.',
    }))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true })
  })

  test('missing required field returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: '',
      message: 'I need help with a product comparison.',
    }))

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      success: false,
      error: 'Please correct the highlighted fields.',
      fieldErrors: {
        subject: 'Subject must be between 3 and 120 characters.',
      },
    })
  })

  test('invalid field type returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 42,
      email: 'jane@example.com',
      subject: 'Help',
      message: 'I need help with a product comparison.',
    }))

    expect(response.status).toBe(400)
    expect(response.body.body).toBeUndefined()
    expect(response.body.fieldErrors).toMatchObject({
      name: 'Name must be between 2 and 80 characters.',
    })
  })

  test('invalid JSON body returns 400', async () => {
    const { POST } = loadModule()
    const response = await POST(createRequest(null, true))

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      error: 'Invalid request body.',
    })
  })

  test('missing configuration returns 500', async () => {
    delete process.env.RESEND_API_KEY
    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Need help',
      message: 'I need help with a product comparison.',
    }))

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      error: 'Contact service is not configured.',
    })
  })

  test('email send exception returns 500', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    Resend.mockImplementation(() => ({
      emails: {
        send: jest.fn(async () => {
          throw new Error('send failed')
        }),
      },
    }))

    const { POST } = loadModule()
    const response = await POST(createRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Need help',
      message: 'I need help with a product comparison.',
    }))

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      success: false,
      error: 'Unable to send your message right now.',
    })

    errorSpy.mockRestore()
  })
})
