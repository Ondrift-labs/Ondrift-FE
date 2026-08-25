import { normalizeEmail } from '../_shared/email.js'
import { normalizeLicenseKey } from '../_shared/license.js'

const EMAIL_DAILY_LIMIT = 3
const IP_DAILY_LIMIT = 10
const QUOTA_EXPIRATION_TTL = 90000
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export { normalizeEmail }

export function computeRecoveryQuotaWindow(email, ip, now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '')
  return {
    emailKey: `recovery-email:${email}:${date}`,
    ipKey: `recovery-ip:${ip}:${date}`,
  }
}

export function evaluateRecoveryRateLimit(emailCount, ipCount) {
  return emailCount >= EMAIL_DAILY_LIMIT || ipCount >= IP_DAILY_LIMIT
    ? 'rate_limited'
    : null
}

function parseCounter(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0
}

function pageResponse(content, status = 200, headers = {}) {
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ondrift Pro license recovery</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: #0b1020; color: #eef2ff; }
    main { width: min(100%, 520px); padding: 40px; text-align: center; background: #151c32; border: 1px solid #2b3659; border-radius: 20px; box-shadow: 0 20px 60px #05081780; }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { margin: 0; color: #b9c2dc; line-height: 1.6; }
    a { color: #a8b8ff; }
    a:hover { color: #c1ccff; }
  </style>
</head>
<body>
  <main>${content}</main>
</body>
</html>`, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  })
}

function genericResponse() {
  return pageResponse(
    '<h1>Check your inbox</h1><p>If that email has an Ondrift Pro license, we\'ve sent the code to it. Check your inbox (and spam folder).</p>',
  )
}

function missingEmailResponse() {
  return pageResponse(
    '<h1>Enter your email</h1><p>Please enter the email used for your purchase. <a href="/upgrade/recover">Try again</a>.</p>',
    400,
  )
}

async function requestEmail(request) {
  const contentType = request.headers.get('content-type') || ''
  if (contentType.toLowerCase().includes('application/json')) {
    const payload = await request.json()
    return payload?.email
  }

  const form = await request.formData()
  return form.get('email')
}

async function sendRecoveryEmail(env, email, code) {
  const apiKey = typeof env.RESEND_API_KEY === 'string' ? env.RESEND_API_KEY.trim() : ''
  const from =
    typeof env.RESEND_FROM_EMAIL === 'string' ? env.RESEND_FROM_EMAIL.trim() : ''

  if (!apiKey || !from) {
    console.error('Ondrift Resend configuration is missing')
    return
  }

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your Ondrift Pro license code',
        html: `<p>Here is your Ondrift Pro license code:</p><p><span style="font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-weight: 700;">${code}</span></p><p>Paste it into Ondrift's extension Options page under Pro to activate it.</p>`,
      }),
    })

    if (!resendResponse.ok) {
      console.error(`Ondrift Resend request failed with status ${resendResponse.status}`)
    }
  } catch {
    console.error('Ondrift Resend request failed')
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return pageResponse(
      '<h1>Method not allowed</h1><p>Please use the license recovery form.</p>',
      405,
      { allow: 'POST' },
    )
  }

  let submittedEmail
  try {
    submittedEmail = await requestEmail(request)
  } catch {
    return missingEmailResponse()
  }

  if (
    submittedEmail === null ||
    submittedEmail === undefined ||
    (typeof submittedEmail === 'string' && !submittedEmail.trim())
  ) {
    return missingEmailResponse()
  }

  const email = normalizeEmail(submittedEmail)
  if (!email) return genericResponse()

  if (!env.ONDRIFT_LICENSES) {
    console.error('Ondrift license recovery KV binding is missing')
    return genericResponse()
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const quotaWindow = computeRecoveryQuotaWindow(email, ip)
  let emailCount
  let ipCount

  try {
    const values = await Promise.all([
      env.ONDRIFT_LICENSES.get(quotaWindow.emailKey),
      env.ONDRIFT_LICENSES.get(quotaWindow.ipKey),
    ])
    ;[emailCount, ipCount] = values.map(parseCounter)

    if (evaluateRecoveryRateLimit(emailCount, ipCount)) return genericResponse()

    await Promise.all([
      env.ONDRIFT_LICENSES.put(quotaWindow.emailKey, String(emailCount + 1), {
        expirationTtl: QUOTA_EXPIRATION_TTL,
      }),
      env.ONDRIFT_LICENSES.put(quotaWindow.ipKey, String(ipCount + 1), {
        expirationTtl: QUOTA_EXPIRATION_TTL,
      }),
    ])
  } catch {
    console.error('Ondrift license recovery rate-limit check failed')
    return genericResponse()
  }

  try {
    const storedCode = await env.ONDRIFT_LICENSES.get(`email:${email}`)
    const code = normalizeLicenseKey(storedCode)
    if (!code) return genericResponse()

    const record = await env.ONDRIFT_LICENSES.get(`license:${code}`)
    if (!record) return genericResponse()

    await sendRecoveryEmail(env, email, code)
  } catch {
    console.error('Ondrift license recovery lookup failed')
  }

  return genericResponse()
}
