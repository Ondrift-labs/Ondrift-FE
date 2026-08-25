function pageResponse(content, script = '') {
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Upgrade to Ondrift Pro</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: #0b1020; color: #eef2ff; }
    main { width: min(100%, 440px); padding: 40px; text-align: center; background: #151c32; border: 1px solid #2b3659; border-radius: 20px; box-shadow: 0 20px 60px #05081780; }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { margin: 0 0 28px; color: #b9c2dc; line-height: 1.6; }
    button { padding: 13px 22px; border: 0; color: #0b1020; background: #a8b8ff; border-radius: 10px; font: inherit; font-weight: 750; cursor: pointer; }
    button:hover { background: #c1ccff; }
    .secondary { margin: 24px 0 0; color: #8793b4; font-size: .85rem; }
    .secondary a { color: #9ca8c8; }
    .secondary a:hover { color: #c1ccff; }
  </style>
</head>
<body>
  <main>${content}</main>
  ${script}
</body>
</html>`, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function paddleEnvironment(value) {
  return value === 'production' ? 'production' : 'sandbox'
}

function scriptValue(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

export function onRequest({ request, env }) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'GET', 'cache-control': 'no-store' },
    })
  }

  const clientToken =
    typeof env.PADDLE_CLIENT_TOKEN === 'string' ? env.PADDLE_CLIENT_TOKEN.trim() : ''
  const priceId = typeof env.PADDLE_PRICE_ID === 'string' ? env.PADDLE_PRICE_ID.trim() : ''

  if (!clientToken || !priceId) {
    return pageResponse(
      '<h1>Ondrift Pro</h1><p>Pro checkout isn\'t configured yet. Please check back later.</p>',
    )
  }

  const environment = paddleEnvironment(env.PADDLE_ENVIRONMENT)
  const script = `<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
  <script>
    Paddle.Environment.set(${scriptValue(environment)});
    Paddle.Initialize({
      token: ${scriptValue(clientToken)},
      eventCallback: function (event) {
        if (event.name === 'checkout.completed' && event.data && event.data.transaction_id) {
          window.location.href = '/upgrade/success?transaction_id=' + encodeURIComponent(event.data.transaction_id);
        }
      },
    });
    document.getElementById('subscribe-button').addEventListener('click', function () {
      Paddle.Checkout.open({ items: [{ priceId: ${scriptValue(priceId)}, quantity: 1 }] });
    });
  </script>`

  return pageResponse(
    `<h1>Ondrift Pro</h1>
    <p>Rewrite up to 100 prompts per day with Ondrift's hosted Gemini service.</p>
    <button type="button" id="subscribe-button">Subscribe $2.99/mo</button>
    <p class="secondary">Lost your code? <a href="/upgrade/recover">Recover it</a></p>`,
    script,
  )
}
