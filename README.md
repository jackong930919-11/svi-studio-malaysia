# Svi Studio Malaysia

## Run locally

Install dependencies and start the Express development server:

```sh
npm install
npm run dev
```

Set `GEMINI_API_KEY` in a local `.env` file to enable Gemini replies in the Express server. Without it, chat uses the built-in multilingual knowledge base.

## Deploy to Cloudflare Pages

The site is a Vite static build with Pages Functions for `/api/chat` and `/api/health`.
The deployed version uses built-in chat replies; the browser-only demo admin portal is disabled.

```sh
npm run build
npx wrangler pages deploy dist --project-name svi-studio-malaysia
```

Wrangler must be authenticated and the `svi-studio-malaysia` Pages project must exist. To enable Gemini replies, add the API key as a Pages secret:

```sh
npx wrangler pages secret put GEMINI_API_KEY --project-name svi-studio-malaysia
```

Never commit API keys or place them in frontend environment variables.
