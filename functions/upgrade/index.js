const PAGE = `<!doctype html>
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
    a { display: inline-block; padding: 13px 22px; color: #0b1020; background: #a8b8ff; border-radius: 10px; font-weight: 750; text-decoration: none; }
    a:hover { background: #c1ccff; }
  </style>
</head>
<body>
  <main>
    <h1>Ondrift Pro</h1>
    <p>Rewrite up to 100 prompts per day with Ondrift's hosted Gemini service.</p>
    <a href="/api/checkout">Subscribe $2.99/mo</a>
  </main>
</body>
</html>`

export function onRequest({ request }) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'GET', 'cache-control': 'no-store' },
    })
  }

  return new Response(PAGE, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
