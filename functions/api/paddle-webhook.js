const SIGNATURE_TOLERANCE_SECONDS = 5

function toHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

export async function verifyPaddleSignature(
  rawBody,
  signatureHeader,
  webhookSecret,
  now = Date.now(),
) {
  if (
    typeof rawBody !== 'string' ||
    typeof signatureHeader !== 'string' ||
    typeof webhookSecret !== 'string' ||
    !webhookSecret
  ) {
    return false
  }

  let timestamp
  const signatures = []
  for (const part of signatureHeader.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 1) continue
    const name = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()
    if (name === 'ts' && timestamp === undefined && /^\d+$/.test(value)) {
      timestamp = Number(value)
    } else if (name === 'h1' && /^[0-9a-f]{64}$/i.test(value)) {
      signatures.push(value.toLowerCase())
    }
  }

  if (!Number.isSafeInteger(timestamp) || signatures.length === 0) return false

  const nowSeconds = Math.floor(Number(now) / 1000)
  if (
    !Number.isFinite(nowSeconds) ||
    Math.abs(nowSeconds - timestamp) > SIGNATURE_TOLERANCE_SECONDS
  ) {
    return false
  }

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${timestamp}:${rawBody}`),
  )
  const expected = toHex(digest)

  return signatures.some((signature) => constantTimeEqual(expected, signature))
}

function response(status) {
  return new Response(null, {
    status,
    headers: { 'cache-control': 'no-store' },
  })
}

function parseRecord(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

async function updateLicense(env, subscriptionId, update) {
  if (typeof subscriptionId !== 'string' || !subscriptionId) return

  const code = await env.ONDRIFT_LICENSES.get(`subscription:${subscriptionId}`)
  if (!code) return

  const licenseKey = `license:${code}`
  const record = parseRecord(await env.ONDRIFT_LICENSES.get(licenseKey))
  if (!record) return

  await env.ONDRIFT_LICENSES.put(licenseKey, JSON.stringify(update(record)))
}

function getEventType(event) {
  return event?.event_type ?? event?.type
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return response(405)
  if (!env.PADDLE_WEBHOOK_SECRET || !env.ONDRIFT_LICENSES) return response(400)

  let rawBody
  try {
    rawBody = await request.text()
  } catch {
    return response(400)
  }

  let verified = false
  try {
    verified = await verifyPaddleSignature(
      rawBody,
      request.headers.get('Paddle-Signature'),
      env.PADDLE_WEBHOOK_SECRET,
    )
  } catch {
    console.error('Ondrift Paddle signature verification failed')
  }
  if (!verified) return response(400)

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return response(400)
  }

  const eventType = getEventType(event)
  if (
    eventType !== 'transaction.completed' &&
    eventType !== 'subscription.canceled' &&
    eventType !== 'subscription.updated'
  ) {
    return response(200)
  }

  try {
    if (eventType === 'transaction.completed') {
      const transaction = event.data
      const periodEnd = transaction?.billing_period?.ends_at
      await updateLicense(env, transaction?.subscription_id, (record) => ({
        ...record,
        status: 'active',
        ...(typeof periodEnd === 'string' && periodEnd
          ? { currentPeriodEnd: periodEnd }
          : {}),
      }))
    } else if (eventType === 'subscription.canceled') {
      await updateLicense(env, event.data?.id, (record) => ({
        ...record,
        status: 'revoked',
      }))
    } else {
      const subscription = event.data
      if (['canceled', 'past_due', 'paused'].includes(subscription?.status)) {
        await updateLicense(env, subscription?.id, (record) => ({
          ...record,
          status: 'revoked',
        }))
      } else if (['active', 'trialing'].includes(subscription?.status)) {
        const periodEnd = subscription?.current_billing_period?.ends_at
        await updateLicense(env, subscription?.id, (record) => ({
          ...record,
          status: 'active',
          ...(typeof periodEnd === 'string' && periodEnd
            ? { currentPeriodEnd: periodEnd }
            : {}),
        }))
      }
    }
  } catch (error) {
    console.error('Ondrift Paddle webhook processing failed', error)
    return response(500)
  }

  return response(200)
}
