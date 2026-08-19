import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { languageFromPathname } from './features/landing/seo'
import './styles/global.css'

const pathLanguage = languageFromPathname(window.location.pathname)
// A URL that already encodes a language (a shared /ko/ link, a search result) must
// hydrate with that exact language to match the prerendered markup byte-for-byte.
// The root path is ambiguous -- prerendered in English for crawlers -- so leave
// initialLanguage unset there and let LandingPage pick the visitor's saved choice
// or their browser language instead. A returning non-English visitor may see one
// hydration content swap; that's the accepted cost of matching the browser by default.
const initialLanguage = pathLanguage === 'en' ? undefined : pathLanguage

hydrateRoot(document.getElementById('root')!,
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App initialLanguage={initialLanguage} />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
