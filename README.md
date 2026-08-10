# Ondrift

Ondrift is a local-first Chrome extension that helps people write clearer prompts before sending them to ChatGPT or Claude.

The current Free MVP runs entirely in the browser. It rewrites and scores a draft with Gemini using the user's own API key, then lets the user apply the improved prompt with one click.

## Current product

- Chrome Extension, Manifest V3
- ChatGPT and Claude prompt-editor integration
- Rewrite, clarity score, rationale, and one-click apply
- Gemini BYOK (Bring Your Own Key)
- API key stored in `chrome.storage.local`
- Prompt history and usage metadata stored locally in IndexedDB
- No Ondrift account, backend, or cloud sync in the Free MVP
- No collection or storage of AI response bodies

## Privacy model

Prompt text is sent directly from the extension service worker to the Gemini API only when the user requests a rewrite. Ondrift does not proxy prompts through a developer-operated server.

The extension requests access only to:

- `chatgpt.com`
- `claude.ai`
- `generativelanguage.googleapis.com`

## Development status

The Chrome extension is currently an installable alpha. Automated linting, strict TypeScript checks, unit and UI tests, and Manifest V3 production-build verification are in place. Live Gemini verification requires the tester's own API key.

The React manufacturing dashboard currently present in this repository is an earlier prototype and is not the active Ondrift Free MVP. It remains available as reference while the client repository structure is migrated to the extension product.

## Legacy dashboard checks

```bash
npm install
npm test
npm run build
```

Development rules are documented in [docs/DEVELOPMENT_CONVENTIONS.md](docs/DEVELOPMENT_CONVENTIONS.md).
