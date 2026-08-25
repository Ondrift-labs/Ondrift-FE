import { isLicenseActive, normalizeLicenseKey } from '../_shared/license.js'

function corsHeaders(origin, configuredOrigins) {
  const allowedOrigins = String(configuredOrigins || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
  }

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

function response(status, cors, body) {
  const headers = { ...cors, 'cache-control': 'no-store' }
  if (body === undefined) return new Response(null, { status, headers })
  headers['content-type'] = 'application/json; charset=utf-8'
  return new Response(JSON.stringify(body), { status, headers })
}

export async function onRequest({ request, env }) {
  const origin = request.headers.get('origin')
  const cors = corsHeaders(origin, env.ALLOWED_EXTENSION_ORIGINS)

  if (!cors['Access-Control-Allow-Origin']) {
    return response(403, cors, { code: 'forbidden' })
  }
  if (request.method === 'OPTIONS') return response(204, cors)
  if (request.method !== 'POST') return response(405, cors, { code: 'method_not_allowed' })

  let payload
  try {
    payload = JSON.parse(await request.text())
  } catch {
    return response(400, cors, { code: 'invalid_request' })
  }

  const licenseKey = normalizeLicenseKey(payload?.licenseKey)
  if (!licenseKey) return response(400, cors, { code: 'invalid_request' })
  if (!env.ONDRIFT_LICENSES) return response(503, cors, { code: 'service_unavailable' })

  let record
  try {
    const value = await env.ONDRIFT_LICENSES.get(`license:${licenseKey}`)
    if (!value) return response(404, cors, { code: 'not_found' })
    record = JSON.parse(value)
  } catch (error) {
    console.error('Ondrift license verification failed', error)
    return response(503, cors, { code: 'service_unavailable' })
  }

  if (record.status !== 'active') return response(402, cors, { code: 'inactive' })
  if (!isLicenseActive(record)) return response(402, cors, { code: 'expired' })

  return response(200, cors, {
    ok: true,
    status: 'active',
    expiresAt: record.currentPeriodEnd,
  })
}
