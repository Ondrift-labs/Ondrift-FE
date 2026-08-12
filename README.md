# Ondrift Frontend

English | [한국어](docs/README.ko.md)

The current Ondrift Free MVP is a local-first Chrome extension for ChatGPT,
Claude, Gemini, and Perplexity. It rewrites and scores prompts with the user's
own Gemini API key and lets the user apply an improved prompt in one click.

## Current product

- Manifest V3 Chrome extension
- Prompt-editor integrations for ChatGPT, Claude, Gemini, and Perplexity
- Prompt rewriting, clarity score, rationale, and one-click apply
- User-supplied Gemini API key
- API key and settings stored in `chrome.storage.local`
- Prompt history and usage metadata stored locally in IndexedDB
- No Ondrift account, backend, or cloud sync in the Free MVP
- No collection or storage of AI response bodies

The active product source and installation guide are in the
[Ondrift-Extension](https://github.com/Ondrift-labs/Ondrift-Extension)
repository.

## Status of this repository

The React web dashboard in this repository is an earlier prototype and is not
the active client for the Ondrift Free MVP. It remains available as a reference
while the product structure is migrated to the extension-first architecture.

Run the prototype checks with:

```bash
npm install
npm test
npm run build
```

See [docs/DEVELOPMENT_CONVENTIONS.md](docs/DEVELOPMENT_CONVENTIONS.md) for the
development rules.

## Deployment

The landing page is deployed to Cloudflare Pages at
[ondrift.pages.dev](https://ondrift.pages.dev/).

After logging in to Wrangler, deploy the current `main` build with:

```bash
npm run deploy:pages
```

Landing page views and primary CTA clicks are stored as anonymous aggregate
events in the `ondrift_landing_events` Cloudflare Analytics Engine dataset.
The event payload contains only the event type and CTA location; it does not
include cookies, user identifiers, IP addresses, or prompt content.

Useful Analytics Engine SQL queries:

```sql
-- Visits and CTA clicks for the last 7 days
SELECT blob1 AS event, blob2 AS target,
       SUM(_sample_interval * double1) AS total
FROM ondrift_landing_events
WHERE timestamp >= NOW() - INTERVAL '7' DAY
GROUP BY event, target
ORDER BY total DESC
```
