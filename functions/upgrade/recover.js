function pageResponse(content, status = 200, headers = {}) {
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recover your Ondrift Pro license</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; background: #0b1020; color: #eef2ff; }
    main { width: min(100%, 440px); padding: 40px; text-align: center; background: #151c32; border: 1px solid #2b3659; border-radius: 20px; box-shadow: 0 20px 60px #05081780; }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { margin: 0 0 24px; color: #b9c2dc; line-height: 1.6; }
    form { display: grid; gap: 14px; }
    input { width: 100%; padding: 12px 14px; border: 1px solid #526294; border-radius: 9px; background: #0b1020; color: #eef2ff; font: inherit; }
    input:focus { outline: 2px solid #a8b8ff; outline-offset: 2px; }
    button { padding: 13px 22px; border: 0; border-radius: 10px; background: #a8b8ff; color: #0b1020; font: inherit; font-weight: 750; cursor: pointer; }
    button:hover { background: #c1ccff; }
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

export function onRequest({ request }) {
  if (request.method !== 'GET') {
    return pageResponse(
      '<h1>Method not allowed</h1><p>Please open this page in your browser to recover your license.</p>',
      405,
      { allow: 'GET' },
    )
  }

  return pageResponse(`<h1>Recover your Ondrift Pro license</h1>
    <p>Enter the email used for your purchase and we'll send your license code.</p>
    <form method="POST" action="/api/recover-license">
      <input type="email" name="email" autocomplete="email" placeholder="you@example.com" aria-label="Email address" required>
      <button type="submit">Send my code</button>
    </form>`)
}
