import { createHmac, webcrypto } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'

import { onRequest, verifyPaddleSignature } from '../../functions/api/paddle-webhook.js'

beforeAll(() => {
  if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: webcrypto,
    })
  }
})

function signatureFor(timestamp, body, secret) {
  return createHmac('sha256', secret).update(`${timestamp}:${body}`).digest('hex')
}

describe('verifyPaddleSignature', () => {
  const timestamp = 1_777_333_200
  const now = timestamp * 1000
  const body = '{"event_id":"evt_test","event_type":"transaction.completed"}'
  const secret = 'pdl_ntfset_test_secret'
  const header = `ts=${timestamp};h1=${'0'.repeat(64)};h1=${signatureFor(timestamp, body, secret)}`

  it('accepts a valid signature', async () => {
    await expect(verifyPaddleSignature(body, header, secret, now)).resolves.toBe(true)
  })

  it('rejects a tampered body', async () => {
    await expect(
      verifyPaddleSignature(`${body} `, header, secret, now),
    ).resolves.toBe(false)
  })

  it('rejects a signature created with a different secret', async () => {
    await expect(
      verifyPaddleSignature(body, header, 'pdl_ntfset_wrong_secret', now),
    ).resolves.toBe(false)
  })

  it('rejects a timestamp outside the tolerance window', async () => {
    await expect(
      verifyPaddleSignature(body, header, secret, now + 65_000),
    ).resolves.toBe(false)
  })
})

function createLicenseStore(initial) {
  const store = new Map(Object.entries(initial))
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null
    },
    async put(key, value) {
      store.set(key, value)
    },
    read(key) {
      return store.get(key)
    },
  }
}

function webhookRequest(body, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = signatureFor(timestamp, body, secret)
  return new Request('https://ondrift.pages.dev/api/paddle-webhook', {
    method: 'POST',
    body,
    headers: { 'Paddle-Signature': `ts=${timestamp};h1=${signature}` },
  })
}

describe('onRequest adjustment handling', () => {
  const secret = 'pdl_ntfset_test_secret'

  function baseEnv() {
    return {
      PADDLE_WEBHOOK_SECRET: secret,
      ONDRIFT_LICENSES: createLicenseStore({
        'subscription:sub_123': 'ONDR-AAAA-BBBB',
        'license:ONDR-AAAA-BBBB': JSON.stringify({
          status: 'active',
          currentPeriodEnd: '2026-09-24T00:00:00.000Z',
        }),
      }),
    }
  }

  it('revokes the license when a refund adjustment is approved', async () => {
    const env = baseEnv()
    const body = JSON.stringify({
      event_type: 'adjustment.updated',
      data: { action: 'refund', status: 'approved', subscription_id: 'sub_123' },
    })

    const result = await onRequest({ request: webhookRequest(body, secret), env })

    expect(result.status).toBe(200)
    expect(JSON.parse(env.ONDRIFT_LICENSES.read('license:ONDR-AAAA-BBBB')).status).toBe(
      'revoked',
    )
  })

  it('leaves the license alone while a refund adjustment is still pending approval', async () => {
    const env = baseEnv()
    const body = JSON.stringify({
      event_type: 'adjustment.created',
      data: { action: 'refund', status: 'pending_approval', subscription_id: 'sub_123' },
    })

    const result = await onRequest({ request: webhookRequest(body, secret), env })

    expect(result.status).toBe(200)
    expect(JSON.parse(env.ONDRIFT_LICENSES.read('license:ONDR-AAAA-BBBB')).status).toBe(
      'active',
    )
  })

  it('ignores a credit adjustment', async () => {
    const env = baseEnv()
    const body = JSON.stringify({
      event_type: 'adjustment.updated',
      data: { action: 'credit', status: 'approved', subscription_id: 'sub_123' },
    })

    const result = await onRequest({ request: webhookRequest(body, secret), env })

    expect(result.status).toBe(200)
    expect(JSON.parse(env.ONDRIFT_LICENSES.read('license:ONDR-AAAA-BBBB')).status).toBe(
      'active',
    )
  })
})
