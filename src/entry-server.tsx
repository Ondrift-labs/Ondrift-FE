import { renderToString } from 'react-dom/server'
import { App } from './app/App'
import { LANDING_COPY, type LandingLanguage } from './features/landing/landingCopy'
import { LANGUAGE_PATHS, SITE_CHROME_STORE_URL, SITE_LOGO_URL, SITE_NAME, SITE_ORIGIN, SITE_REPOSITORY_URL, languageUrl } from './features/landing/seo'

const OPEN_GRAPH_LOCALES: Record<LandingLanguage, string> = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
  zh: 'zh_CN',
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
    siteName: SITE_NAME,
    siteOrigin: SITE_ORIGIN,
    siteLogoUrl: SITE_LOGO_URL,
    siteRepositoryUrl: SITE_REPOSITORY_URL,
    siteChromeStoreUrl: SITE_CHROME_STORE_URL,
    faqItems: copy.faq.items,
  }
}
