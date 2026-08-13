import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSeoData, renderLandingPage } from '../.ssr/entry-server.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = resolve(projectRoot, 'dist')
const template = await readFile(resolve(distDirectory, 'index.html'), 'utf8')
const languages = ['en', 'ko', 'ja']

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function seoHead(data) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${data.siteOrigin}/#website`,
        url: `${data.siteOrigin}/`,
        name: 'Ondrift',
        inLanguage: ['en', 'ko', 'ja'],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${data.url}#software`,
        name: 'Ondrift',
        url: data.url,
        description: data.description,
        inLanguage: data.language,
        applicationCategory: 'BrowserApplication',
        operatingSystem: 'Chrome',
        image: `${data.siteOrigin}/assets/ondrift-share-20260813.jpg`,
        downloadUrl: 'https://github.com/Ondrift-labs/Ondrift-Extension/releases/latest',
        softwareRequirements: 'Google Chrome with an API key for a supported AI provider',
        isPartOf: { '@id': `${data.siteOrigin}/#website` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        sameAs: ['https://github.com/Ondrift-labs/Ondrift-Extension'],
      },
    ],
  }

  return `<!-- SEO_META_START -->
    <meta name="description" content="${escapeAttribute(data.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${data.url}" />
    <link rel="alternate" hreflang="en" href="${data.siteOrigin}/" />
    <link rel="alternate" hreflang="ko" href="${data.siteOrigin}/ko/" />
    <link rel="alternate" hreflang="ja" href="${data.siteOrigin}/ja/" />
    <link rel="alternate" hreflang="x-default" href="${data.siteOrigin}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ondrift" />
    <meta property="og:title" content="${escapeAttribute(data.title)}" />
    <meta property="og:description" content="${escapeAttribute(data.description)}" />
    <meta property="og:url" content="${data.url}" />
    <meta property="og:locale" content="${data.openGraphLocale}" />
${data.alternateLocales.map((locale) => `    <meta property="og:locale:alternate" content="${locale}" />`).join('\n')}
    <meta property="og:image" content="${data.siteOrigin}/assets/ondrift-share-20260813.jpg" />
    <meta property="og:image:secure_url" content="${data.siteOrigin}/assets/ondrift-share-20260813.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1400" />
    <meta property="og:image:height" content="560" />
    <meta property="og:image:alt" content="Ondrift prompt improvement Chrome extension" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(data.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(data.description)}" />
    <meta name="twitter:image" content="${data.siteOrigin}/assets/ondrift-share-20260813.jpg" />
    <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>
    <title>${escapeAttribute(data.title)}</title>
    <!-- SEO_META_END -->`
}

for (const language of languages) {
  const data = getSeoData(language)
  const document = template
    .replace('<html lang="en">', `<html lang="${language}">`)
    .replace(/<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/, seoHead(data))
    .replace('<div id="root"></div>', `<div id="root">${renderLandingPage(language)}</div>`)

  const outputPath = resolve(distDirectory, data.path.slice(1), 'index.html')
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, document)
}

await rm(resolve(projectRoot, '.ssr'), { recursive: true, force: true })
