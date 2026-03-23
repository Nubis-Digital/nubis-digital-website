# Payload CMS Security Rules (Always Active)

## RULE 1: Local API Access Control
When using Local API on behalf of a user, ALWAYS set `overrideAccess: false`. The Local API bypasses all access control by default.
```typescript
// WRONG — silently bypasses all access control:
await payload.find({ collection: 'services' })

// CORRECT — enforces access control:
await payload.find({ collection: 'services', overrideAccess: false, user: req.user })
```
Server components using `getPayload()` directly (trusted server code, not on behalf of a user) can use default `overrideAccess: true`.

## RULE 2: Transaction Safety in Hooks
ALWAYS pass `req` to nested Payload operations inside hooks. Without `req`, operations run in separate transactions.
```typescript
await req.payload.update({ collection: 'x', id: y, data: z, req }) // ← req is REQUIRED
```

## RULE 3: Prevent Infinite Hook Loops
Use `req.context` flags when hooks trigger operations on the same collection:
```typescript
if (req.context.skipMyHook) return
await req.payload.update({ ...args, context: { skipMyHook: true } })
```

## RULE 4: Never Edit Auto-Generated Files
These files are managed by Payload and will be overwritten:
- `src/payload-types.ts`
- `src/app/(payload)/layout.tsx`
- `src/app/(payload)/admin/[[...segments]]/page.tsx`
- `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- `src/app/(payload)/admin/importMap.js`
- `src/app/(payload)/api/[...slug]/route.ts`
- `src/app/(payload)/graphql/route.ts`

## RULE 5: Never Commit Secrets
`.env.local` is gitignored. Never hardcode `PAYLOAD_SECRET` or `DATABASE_URI` in source files.
