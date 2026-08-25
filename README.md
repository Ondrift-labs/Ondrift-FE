# Ondrift Frontend

English | [한국어](docs/README.ko.md)

The current Ondrift Free MVP is a local-first Chrome extension for ChatGPT,
Claude, Gemini, and Perplexity. It rewrites and scores prompts through either
the free-tier proxy or the user's own Gemini API key and lets the user apply an
improved prompt in one click.

## Current product

- Manifest V3 Chrome extension
- Prompt-editor integrations for ChatGPT, Claude, Gemini, and Perplexity
- Prompt rewriting, clarity score, rationale, and one-click apply
- Optional user-supplied Gemini API key (BYOK)
- API key and settings stored in `chrome.storage.local`
- Prompt history and usage metadata stored locally in IndexedDB
- No Ondrift account or cloud sync; the free-tier rewrite proxy is the only
  prompt-processing backend
- No collection or storage of AI response bodies

The active product source and installation guide are in the
[Ondrift-Extension](https://github.com/Ondrift-labs/Ondrift-Extension)
repository.

## Free-tier rewrite proxy

[`functions/api/rewrite.js`](functions/api/rewrite.js) is a Cloudflare Pages
Function that gives extension installations without their own Gemini key up to
three successful rewrites per UTC day. It validates extension origins and
requests, enforces per-install, abuse-backstop, and global quotas in the
`ONDRIFT_FREE_TIER_QUOTA` KV namespace, and calls Gemini with Ondrift's key kept
server-side.

The KV binding and the non-secret `FREE_TIER_DAILY_BUDGET` and
`ALLOWED_EXTENSION_ORIGINS` variables are configured in `wrangler.jsonc`. Set
the API key separately as a Cloudflare Pages secret; it must not be added to
the Wrangler config:

```bash
npx wrangler@4.123.0 pages secret put GEMINI_API_KEY --project-name ondrift
```

BYOK usage is unchanged: when a user supplies their own key, the extension
continues calling Gemini directly and never sends that request through this
endpoint.

## Pro-tier subscription and licenses

Ondrift Pro uses Paddle Billing for subscription checkout and license
verification on top of the free-tier infrastructure. `/upgrade` opens Paddle's
overlay checkout through Paddle.js, `/upgrade/success` issues an idempotent
license after confirming the completed transaction, and Paddle sends payment
and subscription lifecycle events to `/api/paddle-webhook`. The extension
validates a saved code through `/api/verify-license` and sends it to
`/api/rewrite` for the 100-rewrites-per-day Pro quota.

Configure the non-secret `PADDLE_PRICE_ID`, `PADDLE_CLIENT_TOKEN`, and
`PADDLE_ENVIRONMENT` (`sandbox` or `production`) variables in `wrangler.jsonc`.
Set the two Paddle secrets separately in Cloudflare Pages; do not commit them:

```bash
npx wrangler@4.123.0 pages secret put PADDLE_API_KEY --project-name ondrift
npx wrangler@4.123.0 pages secret put PADDLE_WEBHOOK_SECRET --project-name ondrift
```

Before checkout will work, register the `/upgrade` page as the account's
default payment link and ensure its domain is approved in the Paddle dashboard.
Paddle sandbox and production are fully separate environments, so each needs
its own keys, secrets, price, and webhook destination.

Pro rewrites still use Ondrift's own `GEMINI_API_KEY`, just like the free tier;
the active license raises the per-user daily limit while retaining the shared
global budget safeguard.

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
