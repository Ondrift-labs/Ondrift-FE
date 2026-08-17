export type LandingCta =
  | 'install_nav'
  | 'install_hero'
  | 'how_it_works'
  | 'install_final'
  | 'guide_final'
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
