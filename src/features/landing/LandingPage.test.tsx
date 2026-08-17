import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LandingPage } from './LandingPage'

describe('LandingPage language switcher', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
    window.localStorage.clear()
    document.documentElement.lang = 'en'
  })

  it('uses English by default', () => {
    render(<LandingPage />)

    expect(screen.getByRole('heading', { name: /Start with a rough prompt/ })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Page language' })).toHaveValue('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('switches the full landing page and persists the selection', () => {
    render(<LandingPage />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Page language' }), { target: { value: 'ko' } })

    expect(screen.getByRole('heading', { name: /대충 써도 괜찮습니다/ })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('ko')
    expect(window.localStorage.getItem('ondrift-landing-language')).toBe('ko')
    expect(window.location.pathname).toBe('/ko/')
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
    expect(screen.getByRole('link', { name: 'Ask in Q&A' })).toHaveAttribute(
      'href',
      'https://github.com/Ondrift-labs/Ondrift-Extension/discussions/new?category=q-a',
    )
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  it('links the Ondrift brand to the localized home page', () => {
    window.history.replaceState({}, '', '/ko/')
    render(<LandingPage />)

    expect(screen.getByRole('link', { name: 'Ondrift home' })).toHaveAttribute('href', '/ko/')
  })
})
