# Deploying Nubis Digital → Cloudflare Pages

Fresh Next.js 15 (App Router) site. **$0 fixed infra.** Two backend features run as
edge route handlers (Cloudflare Workers): lead capture (Resend) + AI agent proxy.

## Why Cloudflare Pages (not Vercel Hobby)
Vercel Hobby forbids commercial use — this is a company site. Cloudflare Pages allows
commercial use on the free tier, with generous Workers/Functions limits. Build via the
`@cloudflare/next-on-pages` adapter (supports App Router + edge route handlers).

## Local dev
```bash
npm install
cp .env.example .env.local   # fill in real keys
npm run dev                  # http://localhost:3000
```

## Environment variables / secrets
Set these in **Cloudflare Pages → Settings → Environment variables**, or via CLI:
```bash
npx wrangler pages secret put RESEND_API_KEY
npx wrangler pages secret put AI_API_KEY
```
Non-secret config (`LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `AI_PROVIDER`, `AI_MODEL`) can be
plain environment variables in the dashboard. **No secret is ever sent to the browser** —
both keys are read only inside `src/app/api/*/route.ts` on the edge.

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend API key (free 3k emails/mo) |
| `LEAD_TO_EMAIL` | Inbox that receives leads |
| `LEAD_FROM_EMAIL` | Verified Resend sender |
| `AI_PROVIDER` | `anthropic` (default) or `openai` |
| `AI_API_KEY` | LLM provider key (server-only) |
| `AI_MODEL` | optional model override |

## Build & deploy
```bash
npm run pages:build          # @cloudflare/next-on-pages → .vercel/output/static
npm run preview              # local Workers runtime preview
npm run deploy               # wrangler pages deploy
```
Or connect the GitHub repo in the Cloudflare Pages dashboard with:
- Build command: `npx @cloudflare/next-on-pages`
- Output dir: `.vercel/output/static`
- Compatibility flag: `nodejs_compat`

## Cost
| Piece | Service | Cost |
|-------|---------|------|
| Hosting + Functions | Cloudflare Pages (free, commercial OK) | $0 |
| Lead email | Resend free tier | $0 |
| AI proxy infra | edge route handler | $0 |
| AI tokens | provider usage | variable |
| Database | none | $0 |
