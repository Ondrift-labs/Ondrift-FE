const STRIPE_CHECKOUT_ENDPOINT = 'https://api.stripe.com/v1/checkout/sessions'

function pageResponse(content, title = 'Ondrift Pro') {
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: #0b1020; color: #eef2ff; }
    main { width: min(100%, 520px); padding: 40px; text-align: center; background: #151c32; border: 1px solid #2b3659; border-radius: 20px; box-shadow: 0 20px 60px #05081780; }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { color: #b9c2dc; line-height: 1.6; }
    .license { margin: 24px 0 14px; padding: 18px; border: 1px solid #526294; border-radius: 12px; background: #0b1020; color: #fff; font: 700 1.5rem/1.2 ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: .06em; }
    button { padding: 11px 18px; border: 0; border-radius: 9px; background: #a8b8ff; color: #0b1020; font: inherit; font-weight: 750; cursor: pointer; }
    button:hover { background: #c1ccff; }
    .instruction { margin: 24px 0 0; font-size: .95rem; }
    .meta { margin: 12px 0 0; font-size: .85rem; color: #8793b4; }
  </style>
</head>
<body>
  <main>${content}</main>
</body>
</html>`, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function errorPage() {
  return pageResponse(
    '<h1>Something went wrong</h1><p>We could not confirm your Ondrift Pro purchase. Please contact support.</p>',
    'Ondrift Pro purchase issue',
  )
}

function generateLicenseCode() {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const characters = Array.from(bytes, (value) => alphabet[value & 31])
  return `ONDR-${characters.slice(0, 4).join('')}-${characters.slice(4, 8).join('')}`
}

function successPage(code, record) {
  const expiry = new Date(record.currentPeriodEnd)
  const expiryLabel = Number.isNaN(expiry.getTime())
    ? ''
    : `<p class="meta">License status: ${record.status} &middot; Current period ends ${expiry.toLocaleDateString('en-US', { timeZone: 'UTC' })} UTC</p>`

  return pageResponse(`<h1>Welcome to Ondrift Pro</h1>
    <p>Your payment was confirmed. Copy your license code below.</p>
    <div class="license" id="license-code">${code}</div>
    <button type="button" id="copy-button">Copy to clipboard</button>
    ${expiryLabel}
    <p class="instruction">Paste this code into Ondrift's extension Options page under Pro to activate it.</p>
    <script>
      const button = document.getElementById('copy-button');
      button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(document.getElementById('license-code').textContent);
        button.textContent = 'Copied';
      });
    </script>`)
}

function parseRecord(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'GET', 'cache-control': 'no-store' },
    })
  }

  const sessionId = new URL(request.url).searchParams.get('session_id')
  if (!sessionId || !env.STRIPE_SECRET_KEY || !env.ONDRIFT_LICENSES) return errorPage()

  let stripeResponse
  try {
    const url = `${STRIPE_CHECKOUT_ENDPOINT}/${encodeURIComponent(sessionId)}?expand[]=subscription`
    stripeResponse = await fetch(url, {
      headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
    })
  } catch {
    console.error('Ondrift checkout lookup failed')
    return errorPage()
  }

  if (!stripeResponse.ok) {
    console.error('Ondrift checkout lookup returned an error', stripeResponse.status)
    return errorPage()
  }

  let session
  try {
    session = await stripeResponse.json()
  } catch {
    console.error('Ondrift checkout lookup response was invalid')
    return errorPage()
  }

  if (session?.payment_status !== 'paid') {
    console.error('Ondrift checkout session is not paid')
    return errorPage()
  }

  const sessionKey = `session:${sessionId}`

  try {
    const existingCode = await env.ONDRIFT_LICENSES.get(sessionKey)
    if (existingCode) {
      const existingRecord = parseRecord(
        await env.ONDRIFT_LICENSES.get(`license:${existingCode}`),
      )
      if (!existingRecord) {
        console.error('Ondrift license record is missing for an issued checkout session')
        return errorPage()
      }
      return successPage(existingCode, existingRecord)
    }

    const subscription =
      session.subscription && typeof session.subscription === 'object'
        ? session.subscription
        : null
    const subscriptionId = subscription?.id
    const customerId =
      typeof session.customer === 'string' ? session.customer : session.customer?.id
    const currentPeriodEndSeconds = subscription?.current_period_end

    if (
      typeof subscriptionId !== 'string' ||
      typeof customerId !== 'string' ||
      !Number.isFinite(currentPeriodEndSeconds)
    ) {
      console.error('Ondrift checkout session is missing subscription details')
      return errorPage()
    }

    const code = generateLicenseCode()
    const record = {
      status: 'active',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      currentPeriodEnd: new Date(currentPeriodEndSeconds * 1000).toISOString(),
    }

    await Promise.all([
      env.ONDRIFT_LICENSES.put(sessionKey, code),
      env.ONDRIFT_LICENSES.put(`license:${code}`, JSON.stringify(record)),
      env.ONDRIFT_LICENSES.put(`subscription:${subscriptionId}`, code),
    ])

    return successPage(code, record)
  } catch {
    console.error('Ondrift license issuance failed')
    return errorPage()
  }
}
