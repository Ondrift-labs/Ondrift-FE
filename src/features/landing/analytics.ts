// Keep in sync with ALLOWED_TARGETS in functions/api/events.js -- that's a plain JS file
// and can't import this type directly.
export type LandingCta =
  | 'install_nav'
  | 'install_hero'
  | 'how_it_works'
  | 'install_final'
  | 'guide_final'
  | 'pricing_upgrade'
  | 'contact_bug'
  | 'contact_feature'
  | 'contact_question'

type LandingEvent =
  | { event: 'page_view'; target: 'landing' }
  | { event: 'cta_click'; target: LandingCta }

const ANALYTICS_ENDPOINT = '/api/events'
let pageViewTracked = false

function sendLandingEvent(payload: LandingEvent) {
  const body = JSON.stringify(payload)

  if (typeof navigator.sendBeacon === 'function') {
    const queued = navigator.sendBeacon(ANALYTICS_ENDPOINT, body)
    if (queued) return
  }

  void fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined)
}

export function trackLandingPageView() {
  if (pageViewTracked) return
  pageViewTracked = true
  sendLandingEvent({ event: 'page_view', target: 'landing' })
}

export function trackLandingCta(target: LandingCta) {
  sendLandingEvent({ event: 'cta_click', target })
}
