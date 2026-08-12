const ALLOWED_EVENTS = new Set(['page_view', 'cta_click'])
const ALLOWED_TARGETS = new Set([
  'landing',
  'install_nav',
  'install_hero',
  'how_it_works',
  'install_final',
  'guide_final',
])

function response(status) {
  return new Response(null, {
    status,
    headers: { 'cache-control': 'no-store' },
  })
}

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url)
  const origin = request.headers.get('origin')

  if (origin !== requestUrl.origin) return response(403)

  let payload
  try {
    payload = JSON.parse(await request.text())
  } catch {
    return response(400)
  }

  if (
    !payload ||
    !ALLOWED_EVENTS.has(payload.event) ||
    !ALLOWED_TARGETS.has(payload.target) ||
    (payload.event === 'page_view' && payload.target !== 'landing') ||
    (payload.event === 'cta_click' && payload.target === 'landing')
  ) {
    return response(400)
  }

  env.LANDING_ANALYTICS.writeDataPoint({
    indexes: ['landing'],
    blobs: [payload.event, payload.target],
    doubles: [1],
  })

  return response(204)
}

export function onRequest() {
  return response(405)
}
