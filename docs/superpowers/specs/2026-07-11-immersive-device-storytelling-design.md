# Immersive Device Storytelling Design

## Goal

Transform the Nubis homepage from a conventional section stack into a guided scroll narrative. The opening hero introduces a laptop, scrolling moves the story inside that laptop, the narrative transitions to a phone and AI agent, and only then releases into the contact invitation.

## Experience principles

- The devices are narrative stages, not decorative mockups.
- Scroll advances authored story beats instead of moving the page normally during the immersive sequence.
- Content inside each device is semantic HTML driven by the same structured Nubis content source.
- Every transition must communicate a product idea: desktop readiness, transformation, mobile continuity, and supervised AI.
- The visitor must always understand where to look and why the next visual appears.

## Narrative sequence

### Beat 1: Invitation

The first viewport retains the split composition:

- Left: Nubis headline, supporting statement, and a concise scroll invitation.
- Right: the vector laptop, already showing the opening story frame.
- The global header remains visible but visually subordinate.

Normal scrolling stops when the hero reaches the top of the viewport.

### Beat 2: Enter the laptop

The outer hero copy fades and shifts away while the laptop becomes the sole focal point. The laptop stays pinned; its screen does not immediately expand to a full page. Instead, scroll begins advancing content inside the screen.

The first internal frame establishes the tension: organizations have websites, CMS platforms, and AI experiments, but those systems are not yet architected for trustworthy agent participation.

### Beat 3: Readiness journey inside the laptop

The laptop presents a sequence of live story chapters:

1. **Current tension** — fragmented digital experiences and invisible AI readiness gaps.
2. **Readiness shift** — architecture, content, governance, and human oversight become one system.
3. **Transformation proposals** — Umbraco modernization, AI-ready experience architecture, and supervised agents.
4. **Proof and trust** — selected outcomes, operating principles, and why Nubis is equipped to lead the work.

Each chapter replaces or layers content inside one screen viewport. The laptop chassis remains stable enough to anchor attention while internal depth, typography, diagrams, and progress indicators evolve.

### Beat 4: Device handoff

After the laptop completes the transformation chapters:

- The laptop scales down and moves into the background.
- A phone enters from the foreground with a deliberate spatial relationship to the laptop.
- A visual continuity cue carries the same content/system from desktop to mobile.
- The handoff demonstrates continuity rather than introducing an unrelated mockup.

### Beat 5: Mobile and AI agent

The phone becomes the primary stage:

1. It shows the transformed mobile experience.
2. An AI-agent interface appears within that experience.
3. The agent interprets a visitor need, uses governed site knowledge, and produces a useful recommendation.
4. Human oversight or approval is made visible so the sequence does not imply unsupervised magic.

The agent is the culmination of the architecture story: content, platform, mobile experience, and AI behave as one governed system.

### Beat 6: Release and invitation

The device stage resolves and scroll pinning ends. The visitor lands on the normal-flow contact section with a clear invitation to discuss their transformation.

The contact section is the first conventional full-page section after the immersive sequence. Supporting legal, cookie, and footer content remain normal document flow.

## Architecture

### Story model

Create a typed chapter model that is separate from animation:

```ts
export interface StoryChapter {
  id: string
  device: 'laptop' | 'phone'
  eyebrow: string
  headline: string
  body: string
  visual: 'tension' | 'readiness' | 'proposal' | 'proof' | 'mobile' | 'agent'
}
```

The story model consumes existing Nubis content and adds only the connective copy required for the immersive sequence.

### Story stage

A dedicated `ImmersiveStory` owns:

- the opening split hero;
- laptop and phone shells;
- one semantic story viewport per active device;
- chapter progress and transition layers;
- the scroll spacer used by GSAP ScrollTrigger.

Device shells remain decorative. Story content remains real DOM.

### Motion controller

The motion controller maps normalized scroll progress to named beats. It owns transforms, opacity, and chapter activation but does not contain authored copy.

The controller must:

- pin only the immersive stage;
- activate one story chapter at a time;
- keep device/content state deterministic when scrolling backward;
- release cleanly into contact;
- scope selectors/refs to the story component;
- clean up only its own timelines and triggers.

### Page composition

The current standalone homepage sections become story chapter content or supporting data rather than independently scrolling sections. `ContactSection`, `Footer`, cookie consent, skip navigation, and required accessibility landmarks remain outside the pinned stage.

## Responsive and accessibility behavior

- Desktop at 900px and wider receives the full pinned choreography.
- Mobile and reduced-motion users receive the same chapters as a readable vertical story without pinning, zooming, or device-dependent clipping.
- Content remains available without JavaScript.
- Only one primary `h1` exists.
- Inactive chapters are removed from keyboard and assistive-technology navigation.
- Progress is conveyed through text and structure, not motion alone.
- Phone and laptop shells use empty alternative text because their meaningful content is represented by the live DOM.

## Technical direction

- Use React, semantic HTML, CSS, and GSAP ScrollTrigger.
- Do not render primary copy or controls into canvas.
- Do not duplicate the story into independent desktop and device DOM trees.
- Animate compositor-safe transforms and opacity.
- Use the existing cleaned vector laptop shell.
- Create or derive a visually compatible phone shell only as part of the approved device handoff.

## Validation

- Unit-test chapter ordering, device assignment, and progress-to-chapter mapping.
- Component-test one-heading semantics, inactive chapter accessibility, and fallback content order.
- Production build and TypeScript must pass.
- Browser validation must cover forward/backward scrolling, pin release, laptop-to-phone handoff, keyboard traversal, reduced motion, and mobile fallback.
- No chapter may disappear, duplicate, or become unreachable when scrolling direction changes.

## Out of scope

- A generic 3D product demo.
- Canvas-rendered text or controls.
- An autonomous AI chat product implementation.
- Additional pages or a change to the approved audience and transformation narrative.

## Supersession

This design supersedes the hero-only portal behavior in `2026-07-11-unified-laptop-portal-design.md`. The laptop is now a persistent narrative viewport, followed by a phone/AI finale, rather than a one-time entry transition.
