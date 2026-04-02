# Nubis Digital Website

Payload CMS v3.77 + Next.js 15.4.11 + PostgreSQL 16 + Three.js + Tailwind CSS 3

## Stack Versions

| Package | Version |
|---------|---------|
| payload | ^3.77.0 |
| next | 15.4.11 |
| @payloadcms/db-postgres | ^3.77.0 |
| @payloadcms/richtext-lexical | ^3.77.0 |
| three | ^0.172.0 |
| lucide-react | ^0.469.0 |
| tailwindcss | ^3.4.17 |
| sharp | ^0.33.5 |

TypeScript aliases: `@payload-config` → `./src/payload.config.ts`, `@/*` → `./src/*`

## Project Structure

```
src/
  payload.config.ts              # Central config — collections, globals, adapters
  payload-types.ts               # AUTO-GENERATED — run npm run generate:types
  seed.ts                        # Database seeder — run npm run seed
  collections/
    Users.ts                     # Auth collection (email/password)
    Media.ts                     # Upload collection (public read, alt text)
    Services.ts                  # Complex: slug, label, icon, specs[], plugins[], order
  globals/
    Header.ts                    # Nav links, oversight toggle, CTA
    TransparencyPanel.ts         # Typewriter message bar
    Hero.ts                      # Split headline, body, CTA
    WhyAgenticSection.ts         # Why agentic matters — headline, intro, benefits[]
    ServicesSection.ts            # Section headline + intro
    ProcessSection.ts            # Process steps — headline, steps[]
    AgenticAdvantageSection.ts   # Metrics[], governance callout, CTA
    Footer.ts                    # Logo, tagline, footer links
  app/
    (payload)/                   # ⚠️ AUTO-GENERATED — never edit these files
      layout.tsx                 # Payload admin layout
      custom.scss                # Empty — uses Payload defaults
      admin/importMap.js         # Component registry
      admin/[[...segments]]/     # Admin catch-all routes
      api/[...slug]/route.ts     # REST API
      graphql/route.ts           # GraphQL endpoint
    (frontend)/                  # Public website
      layout.tsx                 # Root: Inter + Playfair Display fonts
      page.tsx                   # Server component: fetches all data via Local API
      globals.css                # Tailwind directives
      components/
        GlobalHeader.tsx         # Server component
        Footer.tsx               # Server component
        TransparencyPanel.tsx    # Client — typewriter effect
        Hero.tsx                 # Client — dynamically imports ThreePrism
        WhyAgenticSection.tsx    # Client — 3-col benefits grid (dark bg)
        ServicesSection.tsx      # Client — tab navigation (i18n keys)
        ProcessSection.tsx       # Client — 4-step process grid
        AgenticAdvantageSection.tsx # Client — metrics + governance callout
        ContactSection.tsx       # Client — contact form with validation
        ThreePrism.tsx           # Client — Three.js IcosahedronGeometry
        ScrollReveal.tsx         # Client — intersection observer animations
        OversightToggle.tsx      # Client — toggle + tooltip
        icons.tsx                # Lucide icon map
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `docker compose up -d` | Start PostgreSQL |
| `npm run dev` | Dev server on port 3000 |
| `npm run seed` | Seed database with EN content |
| `npx payload run ./src/seed-es.ts` | Seed database with ES content |
| `npm run generate:types` | Regenerate payload-types.ts after schema changes |
| `npm run generate:importmap` | Regenerate importMap.js after admin component changes |
| `npm run build` | Production build |

## Startup Sequence

1. `docker compose up -d` — wait for PostgreSQL healthcheck
2. `npm run dev` — Payload auto-runs DB migrations
3. Create admin user at `http://localhost:3000/admin` (or already exists: `admin@nubis.digital` / `admin12345`)
4. `npm run seed` — populates EN globals and services
5. `npx payload run ./src/seed-es.ts` — populates ES translations

## Homepage Section Order

1. **TransparencyPanel** — live agentic signal banner
2. **Hero** — "We Make Your Website Work for AI Agents" + Three.js prism
3. **WhyAgenticSection** — why agentic matters (3 benefits grid)
4. **ServicesSection** — three platforms, all agent-ready (Payload, Umbraco, WordPress)
5. **ProcessSection** — from audit to agentic (4 steps)
6. **AgenticAdvantageSection** — metrics (3x, 60%, <200ms) + governance callout + CTA
7. **ContactSection** — contact form
8. **Footer** — links + tagline

## i18n

- Locales: `en`, `es` (default: `en`)
- UI strings: `src/i18n.ts` — static labels, form text, section labels
- Content localization: handled by Payload CMS `localized: true` fields
- Locale routing: `src/middleware.ts` → `/(frontend)/[locale]/`
- Seed files: `src/seed.ts` (EN), `src/seed-es.ts` (ES)
