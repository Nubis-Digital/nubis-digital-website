# Deploying nubisdigital.com

The site is a static Next.js export served by **GitHub Pages** at
https://www.nubisdigital.com (custom domain set in the repo's Pages settings).

## How a deploy happens

Every push to `main` runs `.github/workflows/static.yml`:

1. `npm ci`
2. `npx vitest run` — a failing test stops the deploy
3. `npm run build` — `next build` (`output: 'export'` → `out/`), then
   `scripts/defer-next-scripts.mjs` rewrites the exported HTML so Next's
   JavaScript loads after first paint
4. Upload `out/` and publish to Pages

Run it by hand from the Actions tab (**Deploy site to Pages → Run workflow**) or
`gh workflow run static.yml`.

## Check locally before pushing

```bash
npm test
npx tsc --noEmit
npm run build && npx serve out   # http://localhost:3000
```

## Build-time settings (repository variables)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_LEAD_ENDPOINT` | URL the contact form POSTs leads to (e.g. a SendGrid-backed edge function) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Fallback: the form opens a pre-filled email to this address when no endpoint is set |

With neither set, the form shows "being set up". Set with
`gh variable set NAME --body "value"`, then re-run the workflow.
`server/lead.ts` is the old Resend handler, kept as a starting point for an
edge function — it is not part of the static build.

## Other hosts

Vercel is connected to this repo but not used; `vercel.json` turns off its
automatic Git deployments (they had failed on every push since 2025, and
Vercel Hobby does not allow commercial sites). `wrangler.toml` and
`.openai/hosting.json` are leftovers from earlier hosting plans.
