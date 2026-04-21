// lib/aws-signature.ts
// AWS Signature Version 4 — pure Node.js crypto implementation.
// No external AWS SDK dependency. Used by Amazon PA-API v5.

import crypto from 'crypto'

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest()
}

function hash(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex')
}

function toHex(buffer: Buffer): string {
  return buffer.toString('hex')
}

export function signRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  region: string,
  service: string,
  accessKey: string,
  secretKey: string
): Record<string, string> {
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').substring(0, 15) + 'Z'
  const dateStamp = amzDate.substring(0, 8)

  const parsedUrl = new URL(url)
  const canonicalUri = parsedUrl.pathname || '/'
  const canonicalQueryString = parsedUrl.searchParams.toString()

  const allHeaders: Record<string, string> = {
    ...headers,
    host: parsedUrl.host,
    'x-amz-date': amzDate,
    'content-type': 'application/json; charset=utf-8',
  }

  const sortedHeaderKeys = Object.keys(allHeaders).sort()
  const canonicalHeaders = sortedHeaderKeys
    .map((k) => `${k.toLowerCase()}:${allHeaders[k].trim()}`)
    .join('\n') + '\n'
  const signedHeaders = sortedHeaderKeys.map((k) => k.toLowerCase()).join(';')
  const payloadHash = hash(body)

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    hash(canonicalRequest),
  ].join('\n')

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${secretKey}`, dateStamp), region), service),
    'aws4_request'
  )
  const signature = toHex(hmac(signingKey, stringToSign))

  const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    ...allHeaders,
    Authorization: authHeader,
    'X-Amz-Date': amzDate,
    'Content-Type': 'application/json; charset=utf-8',
  }
}
