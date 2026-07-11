# Unified Laptop Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unrelated laptop-to-console dive with one continuous, accessible transition from a live Nubis homepage surface inside the photographed laptop into the real page, then publish the validated source through Sites.

**Architecture:** `PortalContent` is the sole semantic opening experience and reads `content.hero`; `Hero` supplies the decorative raster chassis and one portal mount; `MotionLayer` progressively enhances only desktop/no-reduced-motion layouts by transforming that mount from the measured screen aperture to the viewport. CSS owns aperture calibration and static mobile/reduced-motion/no-JS fallbacks, while Sites publication is a dependent delivery task performed only after tests and production builds pass.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, GSAP 3 + ScrollTrigger, CSS, Vitest + Testing Library + jsdom, OpenAI Sites.

## Global Constraints

- Strict TDD: no production behavior is written until its focused test exists and has failed for the expected reason.
- Keep `public/hero-recommend.webp` as the decorative laptop chassis; do not rebuild the laptop in SVG, WebGL, or canvas.
- Use `content.hero` as the single source of hero copy; do not invent a console or intermediate product state.
- Run cinematic motion only at `min-width: 900px` and `prefers-reduced-motion: no-preference`.
- The portal must be semantic HTML, expose one primary heading/landmark, and never create duplicate keyboard targets.
- Mobile, reduced-motion, and no-JavaScript users must receive an immediately readable normal hero and page flow.
- Animate compositor-safe `transform` and `opacity`; add `will-change` only while `.hero--portal-active` is present.
- Do not change the homepage narrative or add product capabilities.
- Publication begins only after unit tests and both production builds pass; `.openai/hosting.json` stores only the Sites `project_id`.

---

## File Map

- Create `src/components/PortalContent.tsx` — the one semantic opening surface shared between laptop-screen and page presentation.
- Create `src/components/PortalContent.test.tsx` — content-source, heading, decorative-shell, and focus-contract tests.
- Create `src/components/portalMotion.ts` — pure eligibility and timeline-construction boundary.
- Create `src/components/portalMotion.test.ts` — RED/GREEN tests for desktop, mobile, and reduced-motion eligibility.
- Create `vitest.config.ts` and `src/test/setup.ts` — focused React/jsdom test harness.
- Modify `src/components/Hero.tsx` — mount the live portal over the raster chassis and delete `.dive-ui`, `.dive-reveal`, and `.dive-callout` markup.
- Modify `src/components/MotionLayer.tsx` — replace the old dive choreography with the portal timeline.
- Modify `src/app/globals.css` — replace the old dive styles with calibrated aperture, page state, and fallbacks.
- Modify `package.json` and `package-lock.json` — add the test command and test-only dependencies.
- Create `.openai/hosting.json` during the Sites create call — persist only the returned `project_id`.
- Modify `DEPLOY.md` — make Sites the current publication path and label Cloudflare commands as legacy/manual fallback.

---

### Task 1: Establish the portal test harness and motion eligibility contract

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/components/portalMotion.test.ts`
- Create: `src/components/portalMotion.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `export interface PortalMotionEnvironment { viewportWidth: number; reducedMotion: boolean }`
- Produces: `export function shouldEnablePortalMotion(environment: PortalMotionEnvironment): boolean`
- Consumes: none.

- [ ] **Step 1: Install test-only dependencies and add the exact test script**

Run:

```bash
npm install --save-dev vitest@^3.2.4 jsdom@^26.1.0 @testing-library/react@^16.3.0 @testing-library/jest-dom@^6.6.3
```

Then add to `package.json` scripts:

```json
"test": "vitest run"
```

Expected: `package.json` and `package-lock.json` change; npm exits `0` with no production dependency changes.

- [ ] **Step 2: Create the Vitest setup**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Write the failing eligibility tests**

```ts
// src/components/portalMotion.test.ts
import { describe, expect, it } from 'vitest'
import { shouldEnablePortalMotion } from './portalMotion'

describe('shouldEnablePortalMotion', () => {
  it('enables the portal only on desktop without reduced motion', () => {
    expect(shouldEnablePortalMotion({ viewportWidth: 900, reducedMotion: false })).toBe(true)
  })

  it('keeps the static page flow below 900px', () => {
    expect(shouldEnablePortalMotion({ viewportWidth: 899, reducedMotion: false })).toBe(false)
  })

  it('keeps the static page flow when reduced motion is requested', () => {
    expect(shouldEnablePortalMotion({ viewportWidth: 1440, reducedMotion: true })).toBe(false)
  })
})
```

- [ ] **Step 4: Run RED and verify the reason**

Run: `npm test -- src/components/portalMotion.test.ts`

Expected: FAIL because `./portalMotion` does not exist; do not proceed on a syntax/configuration error.

- [ ] **Step 5: Add the minimal pure implementation**

```ts
// src/components/portalMotion.ts
export interface PortalMotionEnvironment {
  viewportWidth: number
  reducedMotion: boolean
}

export function shouldEnablePortalMotion({
  viewportWidth,
  reducedMotion,
}: PortalMotionEnvironment): boolean {
  return viewportWidth >= 900 && !reducedMotion
}
```

- [ ] **Step 6: Run GREEN and the full suite**

Run: `npm test -- src/components/portalMotion.test.ts && npm test`

Expected: 3 focused tests PASS; full suite exits `0`.

- [ ] **Step 7: Commit the test foundation**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/components/portalMotion.ts src/components/portalMotion.test.ts
git commit -m "test: establish portal motion contract"
```

---

### Task 2: Build the single semantic live portal surface

**Files:**
- Create: `src/components/PortalContent.tsx`
- Create: `src/components/PortalContent.test.tsx`

**Interfaces:**
- Consumes: `content.hero.headlinePart1`, `headlineEmphasis`, `bodyText`, `ctaText`, and `ctaUrl` from `src/data/content.ts`.
- Produces: `export interface PortalContentProps { compact?: boolean }` and `export default function PortalContent(props: PortalContentProps): React.ReactElement`.
- Accessibility contract: exactly one `<h1>` and one CTA; compact presentation is visual CSS only, never a second DOM copy.

- [ ] **Step 1: Write the failing component tests**

```tsx
// src/components/PortalContent.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { content } from '@/data/content'
import PortalContent from './PortalContent'

describe('PortalContent', () => {
  it('renders the authored homepage hero as the single primary heading', () => {
    render(<PortalContent />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${content.hero.headlinePart1} ${content.hero.headlineEmphasis}`,
    )
    expect(screen.getByText(content.hero.bodyText)).toBeInTheDocument()
  })

  it('exposes one real page CTA instead of duplicate screen controls', () => {
    render(<PortalContent compact />)
    expect(screen.getAllByRole('link', { name: content.hero.ctaText })).toHaveLength(1)
    expect(screen.getByRole('link', { name: content.hero.ctaText })).toHaveAttribute(
      'href',
      content.hero.ctaUrl,
    )
  })
})
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/components/PortalContent.test.tsx`

Expected: FAIL because `PortalContent` does not exist.

- [ ] **Step 3: Implement the minimal live surface**

```tsx
// src/components/PortalContent.tsx
import { content } from '@/data/content'
import { Icon } from '@/components/icons'
import Wordmark from '@/components/Wordmark'

export interface PortalContentProps {
  compact?: boolean
}

export default function PortalContent({ compact = false }: PortalContentProps) {
  const { hero } = content

  return (
    <div className="portal-content" data-compact={compact || undefined}>
      <header className="portal-content__bar">
        <span className="portal-content__wordmark"><Wordmark inverted /></span>
        <span className="portal-content__nav-cue" aria-hidden="true">AI-ready websites</span>
      </header>
      <div className="portal-content__body">
        <h1>
          {hero.headlinePart1}{' '}
          <em>{hero.headlineEmphasis}</em>
        </h1>
        <p>{hero.bodyText}</p>
        <a className="btn-primary portal-content__cta" href={hero.ctaUrl}>
          {hero.ctaText}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run GREEN and refactor only while green**

Run: `npm test -- src/components/PortalContent.test.tsx && npm test`

Expected: 2 component tests PASS; all tests PASS.

- [ ] **Step 5: Commit the semantic surface**

```bash
git add src/components/PortalContent.tsx src/components/PortalContent.test.tsx
git commit -m "feat: add live laptop portal content"
```

---

### Task 3: Replace the unrelated dive markup with one portal mount

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/PortalContent.test.tsx`

**Interfaces:**
- Consumes: `PortalContent` from Task 2.
- Produces DOM hooks: `.portal-shell`, `.portal-laptop`, `.portal-aperture`, `.portal-surface`, and `[data-portal-state="screen"]`.
- The laptop image is `alt=""` and `aria-hidden="true"`; `PortalContent` owns the visible semantics.

- [ ] **Step 1: Add a failing integration-level render test**

Append to `src/components/PortalContent.test.tsx`:

```tsx
import Hero from './Hero'

it('uses the laptop only as a decorative shell around one live portal', () => {
  const { container } = render(<Hero />)
  expect(container.querySelectorAll('.portal-surface')).toHaveLength(1)
  expect(container.querySelectorAll('.dive-ui, .dive-reveal, .dive-callout')).toHaveLength(0)
  expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('alt', '')
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/components/PortalContent.test.tsx`

Expected: FAIL because `.portal-surface` is absent and the old `.dive-*` nodes remain.

- [ ] **Step 3: Replace `Hero.tsx` with the focused composition**

```tsx
import PortalContent from '@/components/PortalContent'

export default function Hero() {
  return (
    <section className="hero hero--portal" id="top" aria-label="Nubis Digital introduction">
      <div className="hero-frame" aria-hidden="true">
        <span className="tick tl" /><span className="tick tr" />
        <span className="tick bl" /><span className="tick br" />
      </div>

      <div className="portal-shell" data-portal-state="screen">
        <img
          className="portal-laptop"
          src="/hero-recommend.webp"
          alt=""
          aria-hidden="true"
          width={1083}
          height={974}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="portal-aperture">
          <div className="portal-surface">
            <PortalContent compact />
          </div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll to enter</span><span className="ln" />
      </div>
    </section>
  )
}
```

This intentionally removes `PretextHeadline`, the duplicated hero-copy CTA, every `.dive-ui` console node, `.dive-reveal`, and both `.dive-callout` nodes.

- [ ] **Step 4: Run GREEN**

Run: `npm test -- src/components/PortalContent.test.tsx && npm test`

Expected: all portal tests PASS and there is one `<h1>`/CTA.

- [ ] **Step 5: Commit the markup handoff**

```bash
git add src/components/Hero.tsx src/components/PortalContent.test.tsx
git commit -m "refactor: unify hero around live portal"
```

---

### Task 4: Calibrate the aperture and implement static fallbacks

**Files:**
- Modify: `src/app/globals.css` (replace the block beginning `THE DIVE` through `.hero--dive .dive-reveal-mark`; update the existing mobile hero rules)

**Interfaces:**
- Consumes Task 3 DOM hooks.
- Produces CSS custom properties `--portal-x`, `--portal-y`, `--portal-w`, `--portal-h` and states `screen`/`page`.
- The initial calibration values are explicit and must be visually tuned only after the automated contract remains green.

- [ ] **Step 1: Record the static acceptance failure before CSS changes**

Run: `grep -nE 'dive-ui|dive-reveal|dui-' src/app/globals.css`

Expected: matching legacy rules are printed; this is the RED evidence for removal.

- [ ] **Step 2: Replace the legacy dive block with the complete portal CSS**

```css
/* Live laptop portal: calibrated against public/hero-recommend.webp (1083×974). */
.hero--portal {
  position: relative;
  min-height: calc(100svh - 73px);
  display: grid;
  place-items: center;
  overflow: clip;
  background: var(--ink);
  color: var(--paper);
  border-bottom: 1px solid var(--paper-50);
}
.portal-shell {
  --portal-x: 11.5%;
  --portal-y: 11.8%;
  --portal-w: 55.5%;
  --portal-h: 52.2%;
  position: relative;
  width: min(92vw, 1083px);
  aspect-ratio: 1083 / 974;
  transform-origin: 39.25% 37.9%;
}
.portal-laptop { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.portal-aperture {
  position: absolute;
  z-index: 1;
  left: var(--portal-x);
  top: var(--portal-y);
  width: var(--portal-w);
  height: var(--portal-h);
  overflow: hidden;
  background: var(--ink);
  clip-path: inset(0 round 2px);
  transform: perspective(1200px) rotateX(0.8deg) rotateY(-0.5deg);
  transform-origin: 50% 50%;
}
.portal-surface { width: 100%; height: 100%; transform-origin: 50% 50%; }
.portal-content { min-height: 100%; display: grid; grid-template-rows: auto 1fr; background: var(--ink); color: var(--paper); }
.portal-content__bar { display: flex; justify-content: space-between; align-items: center; padding: clamp(10px, 1.6vw, 22px); border-bottom: 1px solid var(--paper-20); }
.portal-content__wordmark { font: 700 clamp(1rem, 2vw, 1.5rem)/1 var(--font-serif); }
.portal-content__nav-cue { font: 600 0.625rem/1 var(--font-mono); letter-spacing: 0.16em; text-transform: uppercase; color: var(--paper-60); }
.portal-content__body { align-self: center; padding: clamp(18px, 5vw, 72px); max-width: 70rem; }
.portal-content h1 { margin: 0; max-width: 13ch; font: 700 clamp(2.5rem, 7vw, 6.5rem)/0.98 var(--font-serif); text-wrap: balance; }
.portal-content h1 em { font-weight: 600; color: var(--signal); }
.portal-content p { margin: clamp(18px, 3vw, 32px) 0; max-width: 48rem; color: var(--paper-70); font: 400 clamp(1rem, 1.6vw, 1.25rem)/1.6 var(--font-sans); }
.portal-content__cta { background: var(--signal); color: var(--ink); }
.portal-content[data-compact] { width: 1280px; min-height: 720px; transform: scale(0.47); transform-origin: 0 0; }
.portal-shell[data-portal-state="page"] .portal-laptop { opacity: 0; }
.portal-shell[data-portal-state="page"] .portal-aperture { clip-path: inset(0); transform: none; }
.hero--portal-active .portal-shell,
.hero--portal-active .portal-laptop,
.hero--portal-active .portal-aperture,
.hero--portal-active .portal-surface { will-change: transform, opacity; }

@media (max-width: 899px), (prefers-reduced-motion: reduce) {
  .hero--portal { min-height: auto; display: block; padding: 0; overflow: visible; }
  .portal-shell { width: 100%; aspect-ratio: auto; }
  .portal-laptop { display: none; }
  .portal-aperture { position: relative; inset: auto; width: 100%; height: auto; overflow: visible; clip-path: none; transform: none; }
  .portal-content[data-compact] { width: auto; min-height: calc(100svh - 73px); transform: none; }
  .portal-content__body { padding: 64px 24px 80px; }
  .portal-content h1 { font-size: clamp(2.5rem, 12vw, 4rem); overflow-wrap: break-word; }
  .scroll-cue { display: none; }
}
```

- [ ] **Step 3: Verify legacy CSS is gone and tests stay green**

Run:

```bash
! grep -nE 'dive-ui|dive-reveal|dui-' src/app/globals.css
npm test
```

Expected: grep produces no output and both commands exit `0`.

- [ ] **Step 4: Commit the aperture and fallbacks**

```bash
git add src/app/globals.css
git commit -m "feat: style responsive laptop portal"
```

---

### Task 5: Replace the old GSAP dive with continuous portal choreography

**Files:**
- Modify: `src/components/portalMotion.ts`
- Modify: `src/components/portalMotion.test.ts`
- Modify: `src/components/MotionLayer.tsx` (replace only the old `THE DIVE` matchMedia callback)

**Interfaces:**
- Produces: `export interface PortalTimelineTargets { hero: HTMLElement; shell: HTMLElement; laptop: HTMLElement; aperture: HTMLElement; surface: HTMLElement; cue: HTMLElement | null }`.
- Produces: `export function createPortalTimeline(gsapApi: typeof gsap, targets: PortalTimelineTargets): gsap.core.Timeline`.
- Timeline state: add `.hero--portal-active`; pin for `+=300%`; hide chassis only after aperture covers viewport; set `data-portal-state="page"` at completion; restore every inline state on cleanup.

- [ ] **Step 1: Add a failing timeline-contract test using a recording adapter**

Append to `src/components/portalMotion.test.ts`:

```ts
import { buildPortalSteps } from './portalMotion'

it('removes the chassis only after the portal has expanded', () => {
  expect(buildPortalSteps()).toEqual([
    { at: 0, target: 'shell', vars: { scale: 10.5, duration: 0.68 } },
    { at: 0, target: 'cue', vars: { opacity: 0, duration: 0.12 } },
    { at: 0.5, target: 'aperture', vars: { rotateX: 0, rotateY: 0, duration: 0.18 } },
    { at: 0.66, target: 'laptop', vars: { opacity: 0, duration: 0.06 } },
    { at: 0.68, target: 'surface', vars: { scale: 1, duration: 0.2 } },
  ])
})
```

- [ ] **Step 2: Run RED**

Run: `npm test -- src/components/portalMotion.test.ts`

Expected: FAIL because `buildPortalSteps` is not exported.

- [ ] **Step 3: Add the pure choreography description**

Append to `src/components/portalMotion.ts`:

```ts
export const buildPortalSteps = () => [
  { at: 0, target: 'shell', vars: { scale: 10.5, duration: 0.68 } },
  { at: 0, target: 'cue', vars: { opacity: 0, duration: 0.12 } },
  { at: 0.5, target: 'aperture', vars: { rotateX: 0, rotateY: 0, duration: 0.18 } },
  { at: 0.66, target: 'laptop', vars: { opacity: 0, duration: 0.06 } },
  { at: 0.68, target: 'surface', vars: { scale: 1, duration: 0.2 } },
] as const
```

- [ ] **Step 4: Run GREEN**

Run: `npm test -- src/components/portalMotion.test.ts`

Expected: 4 tests PASS.

- [ ] **Step 5: Replace the old dive callback in `MotionLayer.tsx`**

Use this complete callback inside the existing `gsap.matchMedia()` section and delete all `.hero-shot`, `.dive-ui`, `.dui-sheet`, `.dive-reveal`, and `.dive-callout` selection/animation code:

```ts
mm.add(
  '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  () => {
    const hero = $<HTMLElement>('.hero--portal')
    const shell = $<HTMLElement>('.portal-shell')
    const laptop = $<HTMLElement>('.portal-laptop')
    const aperture = $<HTMLElement>('.portal-aperture')
    const surface = $<HTMLElement>('.portal-surface')
    const cue = $<HTMLElement>('.scroll-cue')
    if (!hero || !shell || !laptop || !aperture || !surface) return

    hero.classList.add('hero--portal-active')
    shell.dataset.portalState = 'screen'
    gsap.set(shell, { scale: 1 })
    gsap.set(laptop, { opacity: 1 })
    gsap.set(aperture, { rotateX: 0.8, rotateY: -0.5 })
    gsap.set(surface, { scale: 1 })

    const portal = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=300%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onLeave: () => { shell.dataset.portalState = 'page' },
        onEnterBack: () => { shell.dataset.portalState = 'screen' },
      },
    })

    portal.to(shell, { scale: 10.5, ease: 'power2.inOut', duration: 0.68 }, 0)
    if (cue) portal.to(cue, { opacity: 0, ease: 'power2.in', duration: 0.12 }, 0)
    portal.to(aperture, { rotateX: 0, rotateY: 0, duration: 0.18 }, 0.5)
    portal.to(laptop, { opacity: 0, duration: 0.06 }, 0.66)
    portal.to(surface, { scale: 1, ease: 'power2.out', duration: 0.2 }, 0.68)

    return () => {
      hero.classList.remove('hero--portal-active')
      shell.dataset.portalState = 'screen'
      gsap.set([shell, laptop, aperture, surface], { clearProps: 'all' })
      if (cue) gsap.set(cue, { clearProps: 'opacity' })
    }
  },
)
```

The aperture values in Task 4 are the calibration source. If the frame edge appears before `0.66`, tune only `--portal-*`, `transform-origin`, or the `10.5` scale while preserving the ordering test.

- [ ] **Step 6: Verify all unrelated dive code is removed**

Run:

```bash
! grep -R -nE 'dive-ui|dive-reveal|dui-|dive-callout' src/components src/app/globals.css
npm test
```

Expected: no grep output; all tests PASS.

- [ ] **Step 7: Commit the continuous transition**

```bash
git add src/components/MotionLayer.tsx src/components/portalMotion.ts src/components/portalMotion.test.ts
git commit -m "feat: animate continuous laptop portal"
```

---

### Task 6: Accessibility, responsive, motion, and production validation

**Files:**
- Modify only if a failing check requires it: `src/components/Hero.tsx`, `src/components/PortalContent.tsx`, `src/components/MotionLayer.tsx`, `src/app/globals.css`, and the matching focused test.

**Interfaces:**
- Consumes the completed portal.
- Produces a verified build with one heading, one CTA, no focus duplication, and static fallback at mobile/reduced-motion/no-JS.

- [ ] **Step 1: Run the automated gate**

Run:

```bash
npm test
npx tsc --noEmit
npm run build
```

Expected: tests PASS; TypeScript exits `0`; Next.js reports `Compiled successfully` and generates `/`, `/umbraco`, `/api/ai`, and `/api/lead` without errors.

- [ ] **Step 2: Start the production-shaped preview**

Run: `npm run dev -- --hostname 0.0.0.0 --port 3000`

Expected: Next.js prints `Ready` and a local/network URL. If the managed environment returns `listen EPERM`, record the environment limitation and continue with build evidence; do not claim browser QA occurred.

- [ ] **Step 3: Verify desktop choreography at 1440×900**

In the browser preview, confirm: initial content is clipped inside the photographed display; scroll keeps the hero pinned; the live words remain identical throughout; the laptop frame is fully outside the viewport before opacity reaches zero; the portal fills the viewport before pin release; Tab reaches `See why this matters` once.

Expected: no visible layer swap, console, heading duplication, horizontal scrollbar, layout-driven animation, or blocked interaction.

- [ ] **Step 4: Verify mobile and reduced motion**

Check 390×844 and 768×1024, then emulate `prefers-reduced-motion: reduce`; reload at each setting.

Expected: no laptop overlay or pinning; the normal readable hero appears immediately; headline does not overflow; CTA is keyboard reachable; source order stays heading → body → CTA. Disable JavaScript and reload once: the same static hero remains readable.

- [ ] **Step 5: Fix failures with a new RED/GREEN cycle**

For every discovered defect, first add a focused regression assertion to `PortalContent.test.tsx` or `portalMotion.test.ts`, run it to see the expected failure, make the smallest product change, then rerun `npm test && npx tsc --noEmit && npm run build`.

Expected: no untested behavior fix and all gates return `0`.

- [ ] **Step 6: Commit validation fixes only when needed**

```bash
git add src/components src/app/globals.css
git commit -m "fix: harden laptop portal fallbacks"
```

Skip this commit if validation required no edits.

---

### Task 7: Prepare the validated application for Sites publication

**Files:**
- Create after `create_site`: `.openai/hosting.json`
- Modify: `DEPLOY.md`
- Verify: `.gitignore`, `next.config.mjs`, `src/app/api/ai/route.ts`, `src/app/api/lead/route.ts`

**Interfaces:**
- Consumes the successful Task 6 source SHA/build.
- Produces Sites metadata `{ "project_id": "<returned-project-id>" }`; no credentials or environment values are stored in Git.
- Runtime values are managed through Sites: `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `AI_PROVIDER`, `AI_API_KEY`, and optional `AI_MODEL`.

- [ ] **Step 1: Re-run the exact publication gate on unchanged source**

Run:

```bash
npm test && npx tsc --noEmit && npm run build
git status --short
```

Expected: all commands exit `0`; status contains only intentional source/docs changes and never `.env`, `.env.local`, credentials, `.next`, or `.vercel`.

- [ ] **Step 2: Create the Sites project once and persist only its ID**

Using the Sites connector, call `create_site` once with the Nubis site name/slug. Write the returned ID exactly as:

```json
{
  "project_id": "RETURNED_PROJECT_ID"
}
```

to `.openai/hosting.json`. Reuse the returned source-write credential only in the publication command; never put it in a remote URL, Git configuration, file, log, or commit.

Expected: the connector returns a project ID and temporary source credential; `.openai/hosting.json` contains no other keys.

- [ ] **Step 3: Update `DEPLOY.md` with the current path and preserve the legacy fallback**

Prepend this exact section:

```md
# Publishing Nubis Digital with OpenAI Sites

The production path is OpenAI Sites. Validate with `npm test`, `npx tsc --noEmit`,
and `npm run build`; publish the exact validated commit through the Sites connector.
Runtime values are configured in Sites and are never committed. The Cloudflare Pages
instructions below are retained only as a legacy/manual fallback.
```

Expected: contributors are not directed to the old static `index.html`/GitHub Pages path, and existing Cloudflare operational notes remain available as fallback documentation.

- [ ] **Step 4: Commit publication metadata and documentation**

```bash
git add .openai/hosting.json DEPLOY.md
git commit -m "chore: prepare site publication metadata"
```

Expected: conventional commit succeeds and contains no secrets.

---

### Task 8: Version, deploy privately, and verify the published site

**Files:**
- Package input: the committed repository at the validated branch-head SHA.
- Temporary output outside Git: `/tmp/nubis-digital-site.tar.gz`.

**Interfaces:**
- Consumes: Sites `project_id`, source credential, validated branch-head `commit_sha`, and configured runtime values.
- Produces: one saved Sites version and one successful private deployment URL.

- [ ] **Step 1: Configure hosted runtime values through Sites**

Set `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `AI_PROVIDER`, `AI_API_KEY`, and optional `AI_MODEL` using the Sites connector’s environment-value capability. Use the real values supplied by the owner; do not read denied local `.env*` files or copy placeholders from `.env.example`.

Expected: Sites confirms every required binding; if real values are unavailable, stop publication and report the single user action required rather than deploying broken forms/AI routes.

- [ ] **Step 2: Push the exact validated commit with the temporary credential**

Use the credential as a per-command HTTP authorization header and push the validated branch. Then run `git rev-parse HEAD` and retain that exact SHA as `commit_sha`.

Expected: push succeeds; credential is absent from `git remote -v` and `.git/config`.

- [ ] **Step 3: Package with the Sites helper**

Run:

```bash
/Users/kcastillo/.codex/plugins/cache/openai-bundled/sites/0.1.27/scripts/package-site.sh \
  /Users/kcastillo/projects/nubis-digital-website \
  /tmp/nubis-digital-site.tar.gz
```

Expected: helper exits `0`, validates/stages the hosted build, and creates `/tmp/nubis-digital-site.tar.gz`; required staged output includes `dist/server/index.js` and `dist/.openai/hosting.json`.

- [ ] **Step 4: Save exactly one version and deploy privately**

Call the Sites version-save capability once with `commit_sha` and `/tmp/nubis-digital-site.tar.gz`, then call `deploy_private_site_version` for that version. Do not use a public/shared deployment without explicit user approval.

Expected: version ID and deployment ID are returned.

- [ ] **Step 5: Poll to a terminal result and open only on success**

Poll `get_deployment_status` directly until `status` is `succeeded` or `failed`. On `succeeded`, call `open_in_codex` with `target: { type: "browser", url: deployedUrl }` and no `threadId`.

Expected: deployment succeeds; the exact deployed URL opens; `/` shows the portal and `/umbraco` resolves. On failure, do not open or claim publication—report the connector’s user-visible reason and required correction.

- [ ] **Step 6: Final source-integrity check**

Run:

```bash
test "$(git rev-parse HEAD)" = "COMMIT_SHA_USED_FOR_VERSION"
git status --short
```

Expected: SHA comparison succeeds and no packaging artifact or credential was added to the repository.

---

## Self-Review Record

- **Spec coverage:** Every chosen component boundary is assigned: Task 2 (`PortalContent`), Task 3 (`Hero`), Task 5 (`MotionLayer`), and Task 4 (CSS). Task 6 covers keyboard, heading, desktop, mobile, reduced-motion, no-JS, and build validation. Tasks 7–8 make Sites publication dependent on validation and explicitly correct the legacy deployment path.
- **Gaps found and fixed:** Added an explicit single-DOM/single-focus contract (the design mentioned preventing duplicate focus but not its concrete implementation); added the exact removal checks for `.dive-ui`, `.dive-reveal`, `.dui-*`, and callouts; added source-integrity and secret-handling gates for publication; added a no-browser fallback when this managed environment cannot bind a port; added a hard stop when real hosted environment values are unavailable.
- **Motion quality:** The laptop chassis disappears only after expansion (`0.66`), the portal owns the entire transition, and mobile/reduced-motion/no-JS bypass pinning. Animation is restricted to transforms/opacity and `will-change` exists only in the active class.
- **Type consistency:** `PortalContentProps`, `PortalMotionEnvironment`, `shouldEnablePortalMotion`, and `buildPortalSteps` names match every consumer. DOM hooks match between Hero, CSS, and MotionLayer.
- **Placeholder scan:** No implementation step uses TBD/TODO or delegates unspecified behavior. `RETURNED_PROJECT_ID` and `COMMIT_SHA_USED_FOR_VERSION` are connector/runtime outputs, not invented values; the tasks specify exactly where each comes from.

