import { renderToString } from 'react-dom/server'
import { App } from './app/App'
import { LANDING_COPY, type LandingLanguage } from './features/landing/landingCopy'
import { LANGUAGE_PATHS, SITE_ORIGIN, languageUrl } from './features/landing/seo'

const OPEN_GRAPH_LOCALES: Record<LandingLanguage, string> = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
}

export function renderLandingPage(language: LandingLanguage) {
  return renderToString(<App initialLanguage={language} />)
}

export function getSeoData(language: LandingLanguage) {
  const copy = LANDING_COPY[language]
  return {
    language,
    path: LANGUAGE_PATHS[language],
    url: languageUrl(language),
    title: copy.meta.title,
    description: copy.meta.description,
    openGraphLocale: OPEN_GRAPH_LOCALES[language],
    alternateLocales: Object.values(OPEN_GRAPH_LOCALES).filter((locale) => locale !== OPEN_GRAPH_LOCALES[language]),
    siteOrigin: SITE_ORIGIN,
  }
}
