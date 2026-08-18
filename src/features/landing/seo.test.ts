import { describe, expect, it } from 'vitest'
import { SITE_LOGO_URL, SITE_NAME, SITE_REPOSITORY_URL, languageFromPathname, languageUrl } from './seo'

describe('landing SEO language URLs', () => {
  it('maps localized paths to their language', () => {
    expect(languageFromPathname('/')).toBe('en')
    expect(languageFromPathname('/ko/')).toBe('ko')
    expect(languageFromPathname('/ja/install')).toBe('ja')
    expect(languageFromPathname('/zh/install')).toBe('zh')
  })

  it('builds canonical URLs for every supported language', () => {
    expect(languageUrl('en')).toBe('https://ondrift.pages.dev/')
    expect(languageUrl('ko')).toBe('https://ondrift.pages.dev/ko/')
    expect(languageUrl('ja')).toBe('https://ondrift.pages.dev/ja/')
    expect(languageUrl('zh')).toBe('https://ondrift.pages.dev/zh/')
  })

  it('keeps the public brand identity consistent', () => {
    expect(SITE_NAME).toBe('Ondrift')
    expect(SITE_LOGO_URL).toBe('https://ondrift.pages.dev/assets/ondrift.png')
    expect(SITE_REPOSITORY_URL).toBe('https://github.com/Ondrift-labs/Ondrift-Extension')
  })
})
