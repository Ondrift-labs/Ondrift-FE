const STRIPE_CHECKOUT_ENDPOINT = 'https://api.stripe.com/v1/checkout/sessions'
const SUCCESS_URL =
  'https://ondrift.pages.dev/upgrade/success?session_id={CHECKOUT_SESSION_ID}'
const CANCEL_URL = 'https://ondrift.pages.dev/upgrade'

function errorResponse(message = 'Checkout is temporarily unavailable. Please try again later.') {
  return new Response(message, {
    status: 503,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'GET', 'cache-control': 'no-store' },
    })
  }

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) return errorResponse()

  const body = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': env.STRIPE_PRICE_ID,
    'line_items[0][quantity]': '1',
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  })

  let stripeResponse
  try {
    stripeResponse = await fetch(STRIPE_CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
  } catch {
    console.error('Ondrift checkout session request failed')
    return errorResponse()
  }

  if (!stripeResponse.ok) {
    console.error('Ondrift checkout session request returned an error', stripeResponse.status)
    return errorResponse()
  }

  let session
  try {
    session = await stripeResponse.json()
  } catch {
    console.error('Ondrift checkout session response was invalid')
    return errorResponse()
  }

  if (!session || typeof session.url !== 'string' || !session.url) {
    console.error('Ondrift checkout session response did not include a redirect URL')
    return errorResponse()
  }

  return new Response(null, {
    status: 303,
    headers: {
      location: session.url,
      'cache-control': 'no-store',
    },
  })
}
