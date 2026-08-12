import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('landing analytics', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('records one page view even when the effect runs twice', async () => {
    const sendBeacon = vi.fn<(url: string, data?: BodyInit | null) => boolean>(() => true)
    vi.stubGlobal('navigator', { sendBeacon })
    const { trackLandingPageView } = await import('./analytics')

    trackLandingPageView()
    trackLandingPageView()

    expect(sendBeacon).toHaveBeenCalledTimes(1)
    expect(sendBeacon).toHaveBeenCalledWith('/api/events', expect.any(String))
  })

  it('records the CTA location without delaying navigation', async () => {
    const sendBeacon = vi.fn<(url: string, data?: BodyInit | null) => boolean>(() => true)
    vi.stubGlobal('navigator', { sendBeacon })
    const { trackLandingCta } = await import('./analytics')

    trackLandingCta('install_hero')

    expect(sendBeacon).toHaveBeenCalledTimes(1)
    const body = sendBeacon.mock.calls[0][1]
    expect(JSON.parse(String(body))).toEqual({
      event: 'cta_click',
      target: 'install_hero',
    })
  })

  it('falls back to a keepalive request when sendBeacon is unavailable', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })))
    vi.stubGlobal('navigator', {})
    vi.stubGlobal('fetch', fetchMock)
    const { trackLandingCta } = await import('./analytics')

    trackLandingCta('guide_final')

    expect(fetchMock).toHaveBeenCalledWith('/api/events', expect.objectContaining({
      method: 'POST',
      keepalive: true,
    }))
  })
})
