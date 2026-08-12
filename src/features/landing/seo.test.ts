import { describe, expect, it } from 'vitest'
import { languageFromPathname, languageUrl } from './seo'

describe('landing SEO language URLs', () => {
  it('maps localized paths to their language', () => {
    expect(languageFromPathname('/')).toBe('en')
    expect(languageFromPathname('/ko/')).toBe('ko')
    expect(languageFromPathname('/ja/install')).toBe('ja')
  })

  it('builds canonical URLs for every supported language', () => {
    expect(languageUrl('en')).toBe('https://ondrift.pages.dev/')
    expect(languageUrl('ko')).toBe('https://ondrift.pages.dev/ko/')
    expect(languageUrl('ja')).toBe('https://ondrift.pages.dev/ja/')
  })
})
