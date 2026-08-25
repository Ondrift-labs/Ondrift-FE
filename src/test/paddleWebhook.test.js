import { createHmac, webcrypto } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'

import { verifyPaddleSignature } from '../../functions/api/paddle-webhook.js'

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

  it('rejects a timestamp outside the five-second tolerance', async () => {
    await expect(
      verifyPaddleSignature(body, header, secret, now + 6_000),
    ).resolves.toBe(false)
  })
})
