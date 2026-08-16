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

    expect(screen.getByRole('heading', { name: /Write it once/ })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Page language' })).toHaveValue('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('switches the full landing page and persists the selection', () => {
    render(<LandingPage />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Page language' }), { target: { value: 'ko' } })

    expect(screen.getByRole('heading', { name: /보내기 전에/ })).toBeInTheDocument()
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

  it('links the Ondrift brand to the localized home page', () => {
    window.history.replaceState({}, '', '/ko/')
    render(<LandingPage />)

    expect(screen.getByRole('link', { name: 'Ondrift home' })).toHaveAttribute('href', '/ko/')
  })
})
