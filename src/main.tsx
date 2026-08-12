import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { languageFromPathname } from './features/landing/seo'
import './styles/global.css'

hydrateRoot(document.getElementById('root')!,
  <React.StrictMode>
    <BrowserRouter>
      <App initialLanguage={languageFromPathname(window.location.pathname)} />
    </BrowserRouter>
  </React.StrictMode>,
)
