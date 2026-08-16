import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const distDirectory = resolve(projectRoot, 'dist')
const localizedPages = [
  { file: 'index.html', language: 'en', canonical: 'https://ondrift.pages.dev/' },
  { file: 'ko/index.html', language: 'ko', canonical: 'https://ondrift.pages.dev/ko/' },
  { file: 'ja/index.html', language: 'ja', canonical: 'https://ondrift.pages.dev/ja/' },
]

function requireText(document, expected, file) {
  if (!document.includes(expected)) {
    throw new Error(`${file} is missing required SEO identity: ${expected}`)
  }
}

for (const page of localizedPages) {
  const document = await readFile(resolve(distDirectory, page.file), 'utf8')
  requireText(document, `<html lang="${page.language}">`, page.file)
  requireText(document, '<meta name="application-name" content="Ondrift" />', page.file)
  requireText(document, `<link rel="canonical" href="${page.canonical}" />`, page.file)
  requireText(document, '<meta property="og:site_name" content="Ondrift" />', page.file)
  requireText(document, '"@type":"WebSite"', page.file)
  requireText(document, '"@type":"Organization"', page.file)
  requireText(document, '"name":"Ondrift"', page.file)
  requireText(document, '"publisher":{"@id":"https://ondrift.pages.dev/#organization"}', page.file)
}

const notFoundDocument = await readFile(resolve(distDirectory, '404.html'), 'utf8')
requireText(notFoundDocument, '<meta name="robots" content="noindex, nofollow" />', '404.html')
requireText(notFoundDocument, '<title>Page not found — Ondrift</title>', '404.html')
requireText(notFoundDocument, '<a href="/">Go to Ondrift</a>', '404.html')

await access(resolve(distDirectory, 'favicon.ico'))
await access(resolve(distDirectory, 'ondrift-mark.png'))
