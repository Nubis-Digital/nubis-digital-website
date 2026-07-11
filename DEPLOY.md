# Publishing Nubis Digital with OpenAI Sites

The production path is OpenAI Sites. Validate with `npm test`, `npx tsc --noEmit`,
and `npm run build`; publish the exact validated commit through the Sites connector.
Runtime values are configured in Sites and are never committed. The Cloudflare Pages
instructions below are retained only as a legacy/manual fallback.

## Runtime values

Configure these values in OpenAI Sites. Never commit them:

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend API key used by `/api/lead` |
| `LEAD_TO_EMAIL` | Inbox that receives lead notifications |
| `LEAD_FROM_EMAIL` | Verified Resend sender |

# Legacy/manual fallback: Cloudflare Pages

Fresh Next.js 15 (App Router) site. **$0 fixed infra.** Lead capture runs as an
edge route handler (Cloudflare Workers) through Resend.

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
```
Non-secret config (`LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) can be plain environment variables
in the dashboard. **No secret is ever sent to the browser** — the key is read only inside
`src/app/api/lead/route.ts` on the edge.

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend API key (free 3k emails/mo) |
| `LEAD_TO_EMAIL` | Inbox that receives leads |
| `LEAD_FROM_EMAIL` | Verified Resend sender |

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
| Database | none | $0 |
