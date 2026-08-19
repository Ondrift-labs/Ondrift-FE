import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LandingPage } from './LandingPage'

describe('LandingPage language switcher', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    window.localStorage.clear()
    document.documentElement.lang = 'en'
  })

  // Guaranteed even if an assertion above throws mid-test -- otherwise a failed
  // expectation skips the manual vi.unstubAllGlobals() call and a stubbed
  // navigator.language leaks into every test that runs after it in this file.
  afterEach(() => {
    vi.unstubAllGlobals()
    document.head.innerHTML = ''
  })

  it('uses English by default, matching the test environment\'s browser language', () => {
    render(<LandingPage />)

    expect(screen.getByRole('heading', { name: /Start with a rough prompt/ })).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('system')
    expect(document.documentElement.lang).toBe('en')
  })

  it('matches the browser language automatically when no language has been chosen', () => {
    vi.stubGlobal('navigator', { language: 'ko-KR', languages: ['ko-KR', 'ko'], sendBeacon: () => true })

    render(<LandingPage />)

    expect(screen.getByRole('heading', { name: /대충 써도 괜찮습니다/ })).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('system')
    expect(document.documentElement.lang).toBe('ko')
    // The URL stays at "/" -- only an explicit pick from the dropdown should navigate.
    expect(window.location.pathname).toBe('/')
  })

  it('remembers an explicit language choice over the browser language', () => {
    window.localStorage.setItem('ondrift-landing-language', 'ko')
    vi.stubGlobal('navigator', { language: 'ja-JP', languages: ['ja-JP', 'ja'], sendBeacon: () => true })

    render(<LandingPage />)

    expect(screen.getByRole('heading', { name: /대충 써도 괜찮습니다/ })).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('ko')
  })

  it('switches the full landing page and persists the selection', () => {
    render(<LandingPage />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Page language' }), { target: { value: 'ko' } })

    expect(screen.getByRole('heading', { name: /대충 써도 괜찮습니다/ })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ko')
    expect(window.localStorage.getItem('ondrift-landing-language')).toBe('ko')
    expect(window.location.pathname).toBe('/ko/')
  })

  it('switches to Chinese', () => {
    render(<LandingPage />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Page language' }), { target: { value: 'zh' } })

    expect(screen.getByRole('heading', { name: /先写一次/ })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('zh')
    expect(window.localStorage.getItem('ondrift-landing-language')).toBe('zh')
    expect(window.location.pathname).toBe('/zh/')
  })

  it('lists an FAQ section reachable from the nav', () => {
    render(<LandingPage />)

    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '#faq')
    expect(screen.getByText('Is Ondrift free to use?')).toBeInTheDocument()
    expect(screen.getByText(/Ondrift itself is free and open source/)).toBeInTheDocument()
  })

  it('offers free GitHub channels for bugs, feature requests, and questions', () => {
    render(<LandingPage />)

    expect(screen.getByRole('heading', { name: 'Still have a question?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Report a bug' })).toHaveAttribute(
      'href',
      'https://github.com/Ondrift-labs/Ondrift-Extension/issues/new?template=bug_report.yml',
    )
    expect(screen.getByRole('link', { name: 'Suggest a feature' })).toHaveAttribute(
      'href',
      'https://github.com/Ondrift-labs/Ondrift-Extension/issues/new?template=feature_request.yml',
    )
    expect(screen.getByRole('link', { name: 'Post in Q&A' })).toHaveAttribute(
      'href',
      'https://github.com/Ondrift-labs/Ondrift-Extension/discussions/new?category=q-a',
    )
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  it('re-syncs <html lang>, the title, and canonical after the browser Back button leaves a language switch', () => {
    document.head.insertAdjacentHTML('beforeend', '<link rel="canonical" href="https://ondrift.pages.dev/" />')
    const canonical = () => document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    window.history.replaceState({}, '', '/ja/')
    render(<LandingPage />)
    expect(document.documentElement.lang).toBe('ja')
    expect(canonical()).toBe('https://ondrift.pages.dev/ja/')

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ko' } })
    expect(window.location.pathname).toBe('/ko/')
    expect(document.documentElement.lang).toBe('ko')
    expect(canonical()).toBe('https://ondrift.pages.dev/ko/')

    // The browser's Back button moves the address bar without this code ever calling
    // pushState/replaceState itself -- only a popstate listener can catch it.
    window.history.replaceState({}, '', '/ja/')
    fireEvent.popState(window)

    expect(document.documentElement.lang).toBe('ja')
    expect(canonical()).toBe('https://ondrift.pages.dev/ja/')
  })

  it('points canonical/og:url at the address bar, not the resolved display language, when the browser language leaves the URL ambiguous', () => {
    document.head.insertAdjacentHTML('beforeend', '<link rel="canonical" href="https://ondrift.pages.dev/" /><meta property="og:url" content="https://ondrift.pages.dev/" />')
    vi.stubGlobal('navigator', { language: 'ko-KR', languages: ['ko-KR', 'ko'], sendBeacon: () => true })

    render(<LandingPage />)

    // The page renders in Korean (matching the browser), but the root path is intentionally
    // left language-ambiguous (see main.tsx) -- canonical must still match the URL actually
    // being served, not the language the visitor happens to see.
    expect(document.documentElement.lang).toBe('ko')
    expect(window.location.pathname).toBe('/')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://ondrift.pages.dev/')
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://ondrift.pages.dev/')
  })

  it('links the Ondrift brand to the localized home page', () => {
    window.history.replaceState({}, '', '/ko/')
    render(<LandingPage />)

    expect(screen.getByRole('link', { name: 'Ondrift home' })).toHaveAttribute('href', '/ko/')
  })
})
