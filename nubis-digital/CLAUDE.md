# CLAUDE.md

<div style="
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px rgba(0,0,0,0.4);
  padding: 3rem;
  margin: 2rem 0;
">

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

</div>

<div style="
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px rgba(0,0,0,0.4);
  padding: 3rem;
  margin: 2rem 0;
">

## Project Overview

This is a Payload CMS website template built with Next.js App Router, featuring a headless CMS with a production-ready frontend. The project uses Payload v3.x with Vercel Postgres adapter and includes advanced features like live preview, draft previews, and layout building blocks.

</div>

<div style="
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px rgba(0,0,0,0.4);
  padding: 3rem;
  margin: 2rem 0;
">

## Development Commands

### Core Development
- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm dev:prod` - Clean build and start production locally

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically

### Testing
- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests (Vitest)
- `pnpm test:e2e` - Run end-to-end tests (Playwright)

### Payload CMS Commands
- `pnpm payload` - Access Payload CLI
- `pnpm generate:types` - Generate TypeScript types from Payload schema
- `pnpm generate:importmap` - Generate import map for admin UI

### Database Operations
- `pnpm payload migrate:create` - Create new migration
- `pnpm payload migrate` - Run pending migrations

</div>

<div style="
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px rgba(0,0,0,0.4);
  padding: 3rem;
  margin: 2rem 0;
">

## Architecture

### Core Technologies
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **CMS**: Payload CMS v3.x with Lexical rich text editor
- **Database**: Vercel Postgres with migrations
- **Styling**: TailwindCSS with shadcn/ui components
- **Testing**: Vitest (integration), Playwright (e2e)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public website pages
│   └── (payload)/         # Admin panel routes
├── collections/           # Payload collections (Pages, Posts, Media, etc.)
├── blocks/               # Reusable layout blocks for page builder
├── components/           # React components and UI library
├── globals/              # Payload globals (Header, Footer)
├── fields/               # Custom Payload field configurations
├── hooks/                # Payload hooks for data processing
└── utilities/            # Helper functions and utilities
```

### Collections
- **Pages**: Layout builder enabled with draft/publish workflow
- **Posts**: Blog posts with categories and author relationships
- **Media**: File uploads with image resizing and focal points
- **Categories**: Nested taxonomy for organizing posts
- **Users**: Authentication-enabled admin users

### Key Features
- Layout Builder with blocks (Hero, Content, Media, CTA, Archive)
- Draft preview and live preview capabilities
- SEO plugin with meta management
- Search functionality with full-text search
- Form builder for contact forms
- Automatic sitemap generation
- On-demand revalidation for static pages

</div>

<div style="
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px rgba(0,0,0,0.4);
  padding: 3rem;
  margin: 2rem 0;
">

## Development Workflow

### Environment Setup
1. Copy `.env.example` to `.env` and configure database connection
2. Ensure Node.js 18.20.2+ and pnpm 9+ are installed
3. Run `pnpm install` to install dependencies

### Database Schema Changes
When modifying Payload collections or fields:
1. Update the collection/field configuration
2. Run `pnpm generate:types` to update TypeScript types  
3. For production deployments, create and run migrations:
   - `pnpm payload migrate:create`
   - `pnpm payload migrate` (on server)

### Content Management
- Admin panel available at `/admin`
- Use seed functionality to populate demo content
- Draft preview URLs automatically generated for unpublished content
- Live preview available in admin for real-time content editing

### Testing Strategy
- Integration tests cover API endpoints and data operations
- E2E tests verify complete user workflows
- Always run tests before committing changes

</div>

<div style="
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 20px 30px rgba(0,0,0,0.4);
  padding: 3rem;
  margin: 2rem 0;
">

## Important Notes

- Uses Vercel Postgres adapter - set `push: false` for production environments
- Next.js caching disabled by default (optimized for Payload Cloud)  
- Sharp image processing configured for media optimization
- Jobs queue configured for scheduled publishing
- CRON_SECRET required for scheduled job authentication
- All fetch requests use `no-store` directive for real-time data

</div>