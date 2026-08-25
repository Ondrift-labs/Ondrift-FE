import { createHmac, webcrypto } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'

import { verifyStripeSignature } from '../../functions/api/stripe-webhook.js'

beforeAll(() => {
  if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: webcrypto,
    })
  }
})

function signatureFor(timestamp, body, secret) {
  return createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')
}

describe('verifyStripeSignature', () => {
  const timestamp = 1_777_333_200
  const now = timestamp * 1000
  const body = '{"id":"evt_test","type":"invoice.paid"}'
  const secret = 'whsec_test_secret'
  const header = `t=${timestamp},v1=${signatureFor(timestamp, body, secret)},v0=ignored`

  it('accepts a valid signature', async () => {
    await expect(verifyStripeSignature(body, header, secret, now)).resolves.toBe(true)
  })

  it('rejects a tampered body', async () => {
    await expect(
      verifyStripeSignature(`${body} `, header, secret, now),
    ).resolves.toBe(false)
  })

  it('rejects a signature created with a different secret', async () => {
    await expect(
      verifyStripeSignature(body, header, 'whsec_wrong_secret', now),
    ).resolves.toBe(false)
  })

  it('rejects a timestamp older than five minutes', async () => {
    await expect(
      verifyStripeSignature(body, header, secret, now + 301_000),
    ).resolves.toBe(false)
  })
})
