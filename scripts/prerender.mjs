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
  const organizationId = `${data.siteOrigin}/#organization`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${data.siteOrigin}/#website`,
        url: `${data.siteOrigin}/`,
        name: data.siteName,
        inLanguage: ['en', 'ko', 'ja'],
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: data.siteName,
        url: `${data.siteOrigin}/`,
        logo: {
          '@type': 'ImageObject',
          url: data.siteLogoUrl,
          width: 1254,
          height: 1254,
        },
        sameAs: [data.siteRepositoryUrl],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${data.url}#software`,
        name: data.siteName,
        url: data.url,
        description: data.description,
        inLanguage: data.language,
        applicationCategory: 'BrowserApplication',
        operatingSystem: 'Chrome',
        image: `${data.siteOrigin}/assets/ondrift-share-20260813.jpg`,
        downloadUrl: `${data.siteRepositoryUrl}/releases/latest`,
        softwareRequirements: 'Google Chrome with an API key for a supported AI provider',
        isPartOf: { '@id': `${data.siteOrigin}/#website` },
        publisher: { '@id': organizationId },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        sameAs: [data.siteRepositoryUrl],
      },
      {
        '@type': 'FAQPage',
        '@id': `${data.url}#faq`,
        inLanguage: data.language,
        mainEntity: data.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return `<!-- SEO_META_START -->
    <meta name="application-name" content="${data.siteName}" />
    <meta name="description" content="${escapeAttribute(data.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="home" href="${data.siteOrigin}/" />
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

function notFoundPage(siteOrigin) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="application-name" content="Ondrift" />
    <link rel="icon" href="/favicon.ico" sizes="128x128" />
    <link rel="icon" type="image/png" href="/ondrift-mark.png" sizes="128x128" />
    <link rel="home" href="${siteOrigin}/" />
    <title>Page not found — Ondrift</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #17342b; background: #f7f6f1; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; }
      main { width: min(560px, calc(100% - 48px)); text-align: center; }
      img { width: 56px; height: 56px; }
      p { color: #5d6f68; line-height: 1.65; }
      a { display: inline-block; margin-top: 12px; padding: 11px 18px; border-radius: 999px; color: white; background: #256b57; text-decoration: none; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <img src="/ondrift-mark.png" alt="Ondrift" />
      <h1>Page not found</h1>
      <p>The page you requested does not exist. Return to Ondrift to improve your prompts before you send them.</p>
      <a href="/">Go to Ondrift</a>
    </main>
  </body>
</html>`
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

await writeFile(resolve(distDirectory, '404.html'), notFoundPage('https://ondrift.pages.dev'))

await rm(resolve(projectRoot, '.ssr'), { recursive: true, force: true })
