# Immersive Device Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero-only laptop portal and conventional homepage section stack with one accessible, deterministic scroll story that moves from a split invitation through laptop chapters, a phone handoff, a governed AI-agent finale, and then releases into the existing contact flow.

**Architecture:** `src/data/story.ts` is the typed, animation-independent narrative source assembled from the approved `content` model. A single `ImmersiveStory` DOM tree renders the invitation and every chapter once; decorative `LaptopShell` and `PhoneShell` frame the active viewport, while `storyMotion.ts` maps normalized progress to named beats and `ImmersiveStoryMotion.tsx` applies a component-scoped GSAP timeline only on desktop without reduced motion. CSS changes presentation—not document order—so mobile, reduced-motion, and no-JavaScript visitors receive the same semantic chapters vertically.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, semantic HTML/CSS, GSAP 3 + ScrollTrigger, Vitest, Testing Library, jsdom.

## Global Constraints

- The user explicitly waived RED-first TDD. Implement each coherent slice first, then add/run focused tests as verification before committing.
- Preserve exactly one primary `<h1>`, one semantic story DOM, and the approved audience and narrative: tension → readiness → proposals → proof → mobile continuity → governed AI → contact.
- At `min-width: 900px` with `prefers-reduced-motion: no-preference`, pin only the immersive stage and animate compositor-safe `transform` and `opacity`; scope and clean up only that component's timeline/triggers.
- Below 900px, with reduced motion, or without JavaScript, render every chapter in readable vertical order without pinning, clipping, duplicated content, or device-dependent access.
- Inactive desktop chapters must be `inert` and `aria-hidden="true"`; the active chapter must remain discoverable, and progress must be conveyed by text (`Chapter N of 6`) rather than motion alone.
- Reverse scrolling must derive chapter/device state from progress, never from increment/decrement side effects.
- Reuse `public/assets/laptop-portal.svg`. Build the phone as a decorative CSS/SVG shell around live HTML; do not put primary text or controls in canvas or SVG.
- Retire a standalone homepage section only after its approved content is represented in the story model. Keep `ContactSection`, `Footer`, `CookieConsent`, skip navigation, landmarks, and legal/supporting flow outside the pinned stage.
- Do not run `npm run build` while a development server is active because both write `.next`. For browser QA in this environment start dev with `WATCHPACK_POLLING=true npm run dev -- --port 3000`.
- Sites publication is not part of this plan and remains blocked on `RESEND_API_KEY`, `LEAD_TO_EMAIL`, and `LEAD_FROM_EMAIL`.

---

## File Map

- Create `src/data/story.ts` — typed chapter source and content mapping.
- Create `src/data/story.test.ts` — chapter order, device assignment, source mapping, and progress contract tests.
- Create `src/components/story/storyMotion.ts` — pure progress-to-beat/chapter state plus GSAP timeline construction.
- Create `src/components/story/storyMotion.test.ts` — boundary and reverse-determinism tests.
- Create `src/components/story/LaptopShell.tsx` — decorative vector chassis with live story viewport slot.
- Create `src/components/story/PhoneShell.tsx` — compatible CSS chassis with live story viewport slot.
- Create `src/components/story/StoryChapter.tsx` — semantic chapter renderer, including proposal/proof/mobile/agent visual variants.
- Create `src/components/story/ImmersiveStory.tsx` — the single story DOM and opening split composition.
- Create `src/components/story/ImmersiveStory.test.tsx` — one-heading, content order, inactive accessibility, and fallback tests.
- Create `src/components/story/ImmersiveStoryMotion.tsx` — client-only scoped enhancement and accessibility-state synchronization.
- Modify `src/app/page.tsx` — replace `Hero` and mapped standalone sections with `ImmersiveStory`; preserve contact/supporting components.
- Modify `src/app/globals.css` — replace portal-only CSS with stage, device, chapter, agent, fallback, and reduced-motion styles.
- Modify `src/data/content.ts` — add connective story copy only; preserve existing approved copy as its source.
- Modify `src/components/GlobalHeader.tsx` — point mapped in-page links to story chapter anchors without changing the `/umbraco` route or contact behavior.
- Modify `src/components/MotionLayer.tsx` — remove portal ownership and obsolete reveal assumptions for retired sections; preserve unrelated header/CTA motion.
- Delete after migration: `src/components/Hero.tsx`, `src/components/PortalContent.tsx`, `src/components/PortalContent.test.tsx`, `src/components/portalMotion.ts`, `src/components/portalMotion.test.ts`.
- Retire from homepage imports (do not delete unless unused elsewhere): `WhyAgenticSection.tsx`, `ServicesSection.tsx`, `ComparisonSection.tsx`, `ProcessSection.tsx`, `ProjectsSection.tsx`, `TestimonialsSection.tsx`, `AboutSection.tsx`.

---

### Task 1: Define the typed story and deterministic progress contract

**Files:**
- Create: `src/data/story.ts`
- Create: `src/data/story.test.ts`
- Create: `src/components/story/storyMotion.ts`
- Create: `src/components/story/storyMotion.test.ts`
- Modify: `src/data/content.ts`

**Interfaces:**
- Produces `StoryDevice`, `StoryVisual`, `StoryChapter`, `storyChapters`, `StoryBeat`, `StoryState`, `STORY_BEATS`, `getStoryState(progress)`.
- Consumes existing `content.whyAgentic`, `services`, `comparison`, `process`, `projects`, `testimonials`, and `about`; connective mobile/agent copy is added under `content.story`.

- [ ] **Step 1: Add only the connective copy missing from the existing source**

Append this shape inside `content` in `src/data/content.ts`:

```ts
story: {
  invitation: {
    cue: 'Scroll to follow the system from website to governed AI.',
  },
  readiness: {
    eyebrow: 'One governed system',
    headline: 'Architecture, content, and human oversight move together.',
    body: 'Readiness is not a chatbot added to a website. It is a platform where trustworthy content, clear rules, and accountable people reinforce one another.',
  },
  mobile: {
    eyebrow: 'The same system, everywhere',
    headline: 'Continuity does not stop at the desktop.',
    body: 'The governed experience follows the visitor onto mobile without losing context, clarity, or control.',
  },
  agent: {
    eyebrow: 'Governed recommendation',
    headline: 'The agent turns trusted knowledge into a useful next step.',
    body: 'It interprets the visitor need, cites approved site knowledge, and presents a recommendation for human review.',
    visitorNeed: 'We need to modernize Umbraco without losing editorial control.',
    recommendation: 'Start with a readiness audit, then sequence the platform migration before adding supervised agent workflows.',
    oversightLabel: 'Human review required',
    approvalLabel: 'Recommendation approved',
  },
},
```

- [ ] **Step 2: Implement the typed narrative map**

Create `src/data/story.ts` with these exact public contracts and IDs:

```ts
import { content } from './content'

export type StoryDevice = 'laptop' | 'phone'
export type StoryVisual = 'tension' | 'readiness' | 'proposal' | 'proof' | 'mobile' | 'agent'

export interface StoryChapter {
  id: 'tension' | 'readiness' | 'proposals' | 'proof' | 'mobile' | 'agent'
  device: StoryDevice
  eyebrow: string
  headline: string
  body: string
  visual: StoryVisual
}

export const storyChapters: readonly StoryChapter[] = [
  { id: 'tension', device: 'laptop', eyebrow: content.whyAgentic.label, headline: content.whyAgentic.headline, body: content.whyAgentic.introText, visual: 'tension' },
  { id: 'readiness', device: 'laptop', ...content.story.readiness, visual: 'readiness' },
  { id: 'proposals', device: 'laptop', eyebrow: 'Transformation proposals', headline: content.services.headlinePart1, body: content.services.introText, visual: 'proposal' },
  { id: 'proof', device: 'laptop', eyebrow: content.projects.label, headline: content.projects.headline, body: `${content.about.lead} ${content.projects.empty.body}`, visual: 'proof' },
  { id: 'mobile', device: 'phone', ...content.story.mobile, visual: 'mobile' },
  { id: 'agent', device: 'phone', ...content.story.agent, visual: 'agent' },
] as const
```

The chapter renderer in Task 3 will use the original arrays (`whyAgentic.benefits`, `services.packages`, `process.steps`, `about.principles`) as supporting details; do not flatten or rewrite them here.

- [ ] **Step 3: Implement the pure progress mapping**

```ts
// src/components/story/storyMotion.ts
import type { StoryDevice } from '@/data/story'

export type StoryBeat = 'invitation' | 'laptop' | 'handoff' | 'phone' | 'release'
export interface StoryState { beat: StoryBeat; chapterIndex: number; device: StoryDevice; localProgress: number }

export const STORY_BEATS = {
  invitationEnd: 0.10,
  laptopEnd: 0.62,
  handoffEnd: 0.72,
  phoneEnd: 0.94,
} as const

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function getStoryState(rawProgress: number): StoryState {
  const progress = clamp01(rawProgress)
  if (progress < STORY_BEATS.invitationEnd) return { beat: 'invitation', chapterIndex: 0, device: 'laptop', localProgress: progress / STORY_BEATS.invitationEnd }
  if (progress < STORY_BEATS.laptopEnd) {
    const local = (progress - STORY_BEATS.invitationEnd) / (STORY_BEATS.laptopEnd - STORY_BEATS.invitationEnd)
    return { beat: 'laptop', chapterIndex: Math.min(3, Math.floor(local * 4)), device: 'laptop', localProgress: local }
  }
  if (progress < STORY_BEATS.handoffEnd) return { beat: 'handoff', chapterIndex: 4, device: 'phone', localProgress: (progress - STORY_BEATS.laptopEnd) / (STORY_BEATS.handoffEnd - STORY_BEATS.laptopEnd) }
  if (progress < STORY_BEATS.phoneEnd) {
    const local = (progress - STORY_BEATS.handoffEnd) / (STORY_BEATS.phoneEnd - STORY_BEATS.handoffEnd)
    return { beat: 'phone', chapterIndex: local < 0.5 ? 4 : 5, device: 'phone', localProgress: local }
  }
  return { beat: 'release', chapterIndex: 5, device: 'phone', localProgress: (progress - STORY_BEATS.phoneEnd) / (1 - STORY_BEATS.phoneEnd) }
}
```

- [ ] **Step 4: Add verification tests after implementation**

Test exact order/devices and boundary values, including equality and reverse calls:

```ts
expect(storyChapters.map(({ id }) => id)).toEqual(['tension','readiness','proposals','proof','mobile','agent'])
expect(storyChapters.map(({ device }) => device)).toEqual(['laptop','laptop','laptop','laptop','phone','phone'])
expect(getStoryState(0.61).chapterIndex).toBe(3)
expect(getStoryState(0.62).beat).toBe('handoff')
expect(getStoryState(0.80).chapterIndex).toBe(4)
expect(getStoryState(0.90).chapterIndex).toBe(5)
expect(getStoryState(0.4)).toEqual(getStoryState(0.4))
```

Run: `npm test -- src/data/story.test.ts src/components/story/storyMotion.test.ts`

Expected: both files PASS; there are six chapters, four laptop chapters, two phone chapters, and clamped progress `-1`/`2` returns invitation/release states.

- [ ] **Step 5: Commit the narrative contract**

```bash
git add src/data/content.ts src/data/story.ts src/data/story.test.ts src/components/story/storyMotion.ts src/components/story/storyMotion.test.ts
git commit -m "feat: define immersive story model"
```

---

### Task 2: Build accessible laptop and phone shells

**Files:**
- Create: `src/components/story/LaptopShell.tsx`
- Create: `src/components/story/PhoneShell.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Both shells consume `{ children: React.ReactNode; className?: string }` and expose a `.story-device__viewport` around the one live child tree.
- Shell imagery is decorative (`alt=""`, `aria-hidden="true"`); the phone contains no SVG/canvas text.

- [ ] **Step 1: Add the vector laptop wrapper**

```tsx
export function LaptopShell({ children, className = '' }: DeviceShellProps) {
  return <div className={`story-device story-laptop ${className}`} data-device="laptop">
    <img src="/assets/laptop-portal.svg" alt="" aria-hidden="true" width={600} height={600} />
    <div className="story-device__viewport story-laptop__viewport">{children}</div>
  </div>
}
```

Reuse the calibrated aperture variables from the current portal CSS: `left:15.927167%`, `top:21.248333%`, `width:67.609%`, `height:42.128167%`.

- [ ] **Step 2: Add the compatible CSS phone wrapper**

```tsx
export function PhoneShell({ children, className = '' }: DeviceShellProps) {
  return <div className={`story-device story-phone ${className}`} data-device="phone" aria-label="Mobile experience">
    <span className="story-phone__speaker" aria-hidden="true" />
    <div className="story-device__viewport story-phone__viewport">{children}</div>
    <span className="story-phone__home" aria-hidden="true" />
  </div>
}
```

Style a 9:19 shell with an ink 10px frame, `border-radius: 2rem` only because it is physical hardware, a paper screen, and no shadow/glow. Keep all meaningful content in the child DOM.

- [ ] **Step 3: Verify asset and responsive geometry**

Run: `npm test -- src/components/laptopPortalAsset.test.ts && npx tsc --noEmit`

Expected: laptop SVG transparency/smartphone-removal tests PASS; TypeScript exits `0`. At 360px CSS must use normal-flow device wrappers with `max-width: 100%` and no horizontal overflow.

- [ ] **Step 4: Commit the device primitives**

```bash
git add src/components/story/LaptopShell.tsx src/components/story/PhoneShell.tsx src/app/globals.css
git commit -m "feat: add immersive device shells"
```

---

### Task 3: Render one semantic chapter tree, including proposals, proof, and governed agent

**Files:**
- Create: `src/components/story/StoryChapter.tsx`
- Create: `src/components/story/ImmersiveStory.tsx`
- Create: `src/components/story/ImmersiveStory.test.tsx`

**Interfaces:**
- `StoryChapterProps { chapter: StoryChapter; index: number; active: boolean; enhanced: boolean }`.
- `ImmersiveStory` owns one `<h1>` in the invitation and renders `storyChapters` exactly once in document order.

- [ ] **Step 1: Implement chapter semantics and visual details**

Every chapter is an `<article id={`story-${chapter.id}`}>` with `<p className="story-progress">Chapter {index + 1} of {storyChapters.length}</p>`, `<h2>`, and body. Render details by `visual`:

```tsx
const details: Record<StoryVisual, React.ReactNode> = {
  tension: <ul>{content.whyAgentic.benefits.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ul>,
  readiness: <ol>{content.process.steps.map(step => <li key={step.number}><span>{step.number}</span><strong>{step.title}</strong></li>)}</ol>,
  proposal: <ul>{content.services.packages.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ul>,
  proof: <ul>{content.about.principles.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>,
  mobile: <p>{content.services.foundation.description}</p>,
  agent: <AgentRecommendation />,
}
```

`AgentRecommendation` is a static, governed demonstration: visitor need, approved knowledge status, recommendation, visible `content.story.agent.oversightLabel`, and an inert visual approval state. It is not a chat input and makes no API call.

- [ ] **Step 2: Implement the one-DOM stage**

The opening split contains the sole `<h1>` from `content.hero`; the device rail contains both decorative shells but the chapter `<ol className="story-chapters">` exists only once and is positioned into the current viewport by CSS. Do **not** map chapters separately inside laptop and phone. Use `data-device={chapter.device}` on each article so desktop CSS clips/positions the same list relative to the active shell.

Server-render all chapters accessible by default. `aria-hidden`/`inert` are added only after `ImmersiveStoryMotion` marks the root `data-enhanced="true"`; this preserves no-JS access.

- [ ] **Step 3: Add post-implementation component verification**

```tsx
const { container } = render(<ImmersiveStory />)
expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
expect(screen.getAllByRole('article')).toHaveLength(6)
expect(screen.getAllByText(/Chapter \d of 6/)).toHaveLength(6)
expect(container.querySelectorAll('.story-chapters')).toHaveLength(1)
expect(screen.getByText(content.story.agent.oversightLabel)).toBeVisible()
expect(screen.getByText(storyChapters[0].headline).compareDocumentPosition(screen.getByText(storyChapters[5].headline)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
```

Add a second test that sets the enhanced active index through the exported accessibility helper from Task 4 and verifies inactive articles have `aria-hidden="true"` and `inert`, while the active one has neither.

Run: `npm test -- src/components/story/ImmersiveStory.test.tsx && npm test`

Expected: immersive tests PASS; the full suite remains green.

- [ ] **Step 4: Commit the semantic stage**

```bash
git add src/components/story/StoryChapter.tsx src/components/story/ImmersiveStory.tsx src/components/story/ImmersiveStory.test.tsx
git commit -m "feat: render immersive device story"
```

---

### Task 4: Add component-scoped scroll choreography and accessibility synchronization

**Files:**
- Modify: `src/components/story/storyMotion.ts`
- Modify: `src/components/story/storyMotion.test.ts`
- Create: `src/components/story/ImmersiveStoryMotion.tsx`
- Modify: `src/components/story/ImmersiveStory.tsx`

**Interfaces:**
- Produces `setActiveChapter(root: HTMLElement, chapterIndex: number): void` and `createStoryTimeline(gsapApi, root): gsap.core.Timeline`.
- `ImmersiveStoryMotion` receives `{ rootId: 'immersive-story' }`, registers `ScrollTrigger`, and owns no authored copy.

- [ ] **Step 1: Implement accessibility state as an idempotent function**

```ts
export function setActiveChapter(root: HTMLElement, activeIndex: number) {
  root.querySelectorAll<HTMLElement>('[data-story-chapter]').forEach((chapter, index) => {
    const active = index === activeIndex
    chapter.toggleAttribute('inert', !active)
    if (active) chapter.removeAttribute('aria-hidden')
    else chapter.setAttribute('aria-hidden', 'true')
    chapter.dataset.active = String(active)
  })
}
```

Verify calling `setActiveChapter(root, 4)`, then `1`, then `4` produces exactly the same DOM state as calling it once with `4`.

- [ ] **Step 2: Build one reversible timeline**

Create a single timeline with `scrollTrigger: { trigger: root, start:'top top', end:'+=700%', scrub:0.6, pin:true, anticipatePin:1, invalidateOnRefresh:true }`. Use named labels `invitation`, `laptop-1` … `laptop-4`, `handoff`, `phone-mobile`, `phone-agent`, `release`. Animate only stage copy, device wrappers, the continuity line, and chapter transforms/opacity. On every `onUpdate`, call `getStoryState(self.progress)`, `setActiveChapter`, and set `root.dataset.beat`, `root.dataset.device`, and `root.style.setProperty('--story-progress', String(self.progress))`.

The handoff must scale/translate the laptop backward while translating/scaling the phone forward; do not hide laptop before the phone establishes continuity. Release ends with both devices settling/fading and lets ScrollTrigger unpin into `#contact`.

- [ ] **Step 3: Scope setup and cleanup to the component**

`ImmersiveStoryMotion` must use `gsap.matchMedia()` with `'(min-width: 900px) and (prefers-reduced-motion: no-preference)'`, `gsap.context(..., root)`, and cleanup in this order:

```ts
return () => {
  root.removeAttribute('data-enhanced')
  root.removeAttribute('data-beat')
  root.removeAttribute('data-device')
  root.querySelectorAll('[data-story-chapter]').forEach(el => {
    el.removeAttribute('aria-hidden'); el.removeAttribute('inert'); el.removeAttribute('data-active')
  })
  context.revert()
  media.revert()
}
```

Do not call global `ScrollTrigger.getAll().forEach(trigger => trigger.kill())`.

- [ ] **Step 4: Verify boundaries and lifecycle**

Run: `npm test -- src/components/story/storyMotion.test.ts src/components/story/ImmersiveStory.test.tsx && npx tsc --noEmit`

Expected: progress boundary, reverse determinism, inactive accessibility, and cleanup tests PASS; TypeScript exits `0`.

- [ ] **Step 5: Commit the choreography**

```bash
git add src/components/story/storyMotion.ts src/components/story/storyMotion.test.ts src/components/story/ImmersiveStoryMotion.tsx src/components/story/ImmersiveStory.tsx src/components/story/ImmersiveStory.test.tsx
git commit -m "feat: choreograph immersive story scroll"
```

---

### Task 5: Replace the homepage stack only after content migration

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/GlobalHeader.tsx`
- Modify: `src/components/MotionLayer.tsx`
- Delete: `src/components/Hero.tsx`
- Delete: `src/components/PortalContent.tsx`
- Delete: `src/components/PortalContent.test.tsx`
- Delete: `src/components/portalMotion.ts`
- Delete: `src/components/portalMotion.test.ts`

**Interfaces:**
- Homepage order becomes `GlobalHeader → main(ImmersiveStory, ContactSection) → Footer → LoadPathSpine → MotionLayer → CookieConsent`.
- `ContactSection` remains `id="contact"` and is the first normal-flow full-page section after the stage.

- [ ] **Step 1: Audit the mapping before removing imports**

Confirm in `story.ts`/`StoryChapter.tsx`: why-agentic → tension; process → readiness; services → proposals/mobile; projects/testimonials/about → proof/trust; comparison's Umbraco proposition remains reachable via the existing `/umbraco` page and header link. If any approved sentence or audience claim lacks a destination, map it before continuing.

- [ ] **Step 2: Replace page composition**

```tsx
<main id="main">
  <ImmersiveStory />
  <ContactSection />
</main>
```

Preserve skip link, `GlobalHeader`, `Footer`, `LoadPathSpine`, `MotionLayer`, and `CookieConsent` exactly once. Update in-page header links to `/#story-proposals`, `/#story-proof`, and `/#contact`; retain `/umbraco` unchanged.

- [ ] **Step 3: Retire obsolete portal ownership**

Remove `activatePortalTimeline` and the `.hero--portal` query block from `MotionLayer.tsx`; do not move immersive selectors there. Delete the five superseded portal files only after `grep` shows no imports. Keep standalone section component files unless `git grep` proves they are unused outside the homepage, minimizing unrelated deletion.

- [ ] **Step 4: Verify semantics and references**

Run:

```bash
npm test
npx tsc --noEmit
git grep -n "PortalContent\|activatePortalTimeline\|hero--portal" -- src || true
```

Expected: all tests PASS; TypeScript exits `0`; grep returns no matches; component test finds one `h1`, six chapters, one `#contact`, one footer, and one cookie-consent mount.

- [ ] **Step 5: Commit the page migration**

```bash
git add src/app/page.tsx src/components/GlobalHeader.tsx src/components/MotionLayer.tsx src/components/story src/components/Hero.tsx src/components/PortalContent.tsx src/components/PortalContent.test.tsx src/components/portalMotion.ts src/components/portalMotion.test.ts
git commit -m "refactor: replace homepage stack with story stage"
```

---

### Task 6: Finish responsive, reduced-motion, no-JavaScript, and focus behavior

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/story/ImmersiveStory.test.tsx`

**Interfaces:**
- CSS default is readable vertical flow; desktop enhancement is gated by `[data-enhanced="true"]` inside `@media (min-width: 900px) and (prefers-reduced-motion: no-preference)`.

- [ ] **Step 1: Make fallback the default, not an override**

Base CSS must display `.story-invitation` followed by `.story-chapters` in document flow, show both device shells only as non-blocking illustrations, set every chapter visible, and never rely on `opacity:0` for initial content. The enhanced media query may absolutely position/pin presentation layers. This guarantees server HTML/no-JS readability.

- [ ] **Step 2: Add explicit reduced-motion and mobile rules**

```css
@media (max-width: 899px), (prefers-reduced-motion: reduce) {
  .immersive-story { min-height: auto; overflow: clip; }
  .story-stage { position: relative; min-height: auto; }
  .story-chapters { display: grid; gap: var(--space-10); }
  .story-chapter { position: relative; opacity: 1; transform: none; }
  .story-device { position: relative; transform: none; pointer-events: none; }
}

@media (prefers-reduced-motion: reduce) {
  .immersive-story *, .immersive-story *::before, .immersive-story *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Ensure focus rings are not clipped by either device viewport in fallback; enhanced inactive chapters are inert, so only active links/controls can receive focus. Since the agent finale is demonstrative, it has no fake focusable chat controls.

- [ ] **Step 3: Verify fallback order and one-heading behavior**

Extend tests to assert all six headings and bodies render without `data-enhanced`, no article has `inert`/`aria-hidden`, and link tab order proceeds header → story CTA → contact form → footer without duplicate story controls.

Run: `npm test -- src/components/story/ImmersiveStory.test.tsx && npm test`

Expected: focused and full suites PASS.

- [ ] **Step 4: Commit fallback hardening**

```bash
git add src/app/globals.css src/components/story/ImmersiveStory.test.tsx
git commit -m "fix: preserve accessible story fallbacks"
```

---

### Task 7: Validate behavior, build safely, and document the publication boundary

**Files:**
- Modify only if failures require it: files from Tasks 1–6.
- Do not modify: `.openai/hosting.json`, `DEPLOY.md`, environment files, or Sites configuration.

**Interfaces:**
- Final evidence covers unit/component tests, TypeScript, production build, and real-browser forward/reverse/fallback behavior.

- [ ] **Step 1: Stop the development server before production validation**

Confirm no `next dev` process is writing `.next`; stop it with Ctrl+C in its owning terminal. Then run:

```bash
rm -rf .next
npm test
npx tsc --noEmit
npm run build
```

Expected: all tests PASS; TypeScript exits `0`; Next production build completes with every route generated. Do not interpret existing non-fatal lockfile or `fetchPriority` warnings as compilation failures.

- [ ] **Step 2: Start browser QA with the environment-safe watcher**

Run in a retained terminal:

```bash
rm -rf .next
WATCHPACK_POLLING=true npm run dev -- --port 3000
```

Expected: Next prints `http://localhost:3000`; `/`, `/icon.svg`, and `/umbraco` return HTTP 200 with no missing chunk/module error. Do not run `npm run build` while this process remains active.

- [ ] **Step 3: Perform the exact browser matrix**

At 1440×900, verify: split hero; pin begins at top; laptop chapters advance 1→4; phone enters before laptop leaves; mobile chapter advances to agent; governed recommendation and human-review state are visible; reverse scrolling restores every exact earlier chapter/device; pin releases directly into Contact; header/contact/footer/cookie remain usable.

At 390×844, verify: no pin, all six chapters in authored order, no horizontal overflow, device shells never hide copy, contact follows agent.

With reduced motion enabled, verify: no pin/zoom/scrub, same six chapters and progress text, keyboard traversal reaches every meaningful control once. With JavaScript disabled, inspect the server page and verify the same chapter order and contact remain readable.

- [ ] **Step 4: Inspect console, accessibility, and teardown**

Expected: zero runtime exceptions, hydration errors, missing assets, duplicate IDs, unreachable chapters, or focus on hidden content. Stop the dev server with Ctrl+C after QA. If a fix is made, rerun the focused test plus `npx tsc --noEmit`; stop dev before rerunning `npm run build`.

- [ ] **Step 5: Record the implementation commit**

```bash
git status --short
git add src/data/story.ts src/data/story.test.ts src/components/story src/app/page.tsx src/app/globals.css src/components/GlobalHeader.tsx src/components/MotionLayer.tsx
git commit -m "fix: harden immersive story behavior"
```

Skip this commit when validation required no source change. Do not deploy: publication remains a separate task blocked on the three Resend runtime values.

---

## Self-Review Record

- **Spec coverage:** invitation, four laptop chapters, continuity handoff, mobile experience, governed agent, release to contact, reverse determinism, component-scoped cleanup, one semantic DOM, one `h1`, inactive accessibility, desktop threshold, reduced-motion/mobile/no-JS fallbacks, and browser/build validation each map to Tasks 1–7.
- **Narrative preservation:** why-agentic, services, process, projects, testimonials/about trust, Umbraco route, contact, footer, cookie consent, and approved audience remain represented; no standalone section is retired before mapping.
- **Placeholder scan:** the plan contains no TBD/TODO/"implement later" step; every implementation and verification step names its contract, command, and expected result.
- **Type consistency:** `StoryChapter.id`, `StoryDevice`, `StoryVisual`, `StoryState`, `getStoryState`, and `setActiveChapter` names/signatures are stable across all tasks.
- **Dependency order:** typed data/state → shells → semantic stage → motion/accessibility → page migration → fallback hardening → validation. No task consumes an undefined interface.
- **Publication boundary:** Sites deployment and runtime-secret configuration are explicitly excluded.
