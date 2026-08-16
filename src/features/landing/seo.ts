import type { LandingLanguage } from './landingCopy'

export const SITE_ORIGIN = 'https://ondrift.pages.dev'
export const SITE_NAME = 'Ondrift'
export const SITE_LOGO_URL = `${SITE_ORIGIN}/assets/ondrift.png`
export const SITE_REPOSITORY_URL = 'https://github.com/Ondrift-labs/Ondrift-Extension'

export const LANGUAGE_PATHS: Record<LandingLanguage, string> = {
  en: '/',
  ko: '/ko/',
  ja: '/ja/',
}

export function languageFromPathname(pathname: string): LandingLanguage {
  if (pathname === '/ko' || pathname.startsWith('/ko/')) return 'ko'
  if (pathname === '/ja' || pathname.startsWith('/ja/')) return 'ja'
  return 'en'
}

export function languageUrl(language: LandingLanguage) {
  return `${SITE_ORIGIN}${LANGUAGE_PATHS[language]}`
}
