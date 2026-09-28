---
name: Nubis Digital
description: Architectural Resilience for the Agentic Web — a flat, hairline-drafted system in ink, paper, and cobalt signal.
colors:
  signal: "#2E7DFF"
  peri: "#7C6BFF"
  ink: "#101417"
  paper: "#F0EEE9"
  white: "#FFFFFF"
  warning: "#EA580C"
  danger: "#DC2626"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.18em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  metric:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "clamp(2.5rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  none: "0"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "8": "48px"
  "10": "64px"
  "12": "80px"
  "14": "112px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.signal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "15px 31px"
  button-lilac-hover:
    backgroundColor: "{colors.peri}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "9px 13px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "32px"
  card-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "24px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: Nubis Digital

## 1. Overview

**Creative North Star: "The Architect's Drawing"**

This system is drafted, not decorated. Every surface is built the way a structural drawing is built: 1px ink lines that divide, frame, and measure; a quiet paper ground; and one cobalt "signal" that behaves like the highlighted load path on a blueprint — it marks what matters and nothing else. The discipline is the brand. Nubis sells *Architectural Resilience for the Agentic Web*, and the page itself is the proof: precise, legible, unbreakable, calm under load.

The mood is the adult in the room. Where AI marketing reaches for glow, spectacle, and breathless gradients, this system reaches for the drafting table — exact margins, full-bleed rules, a modular type scale anchored by a Playfair display serif that gives the engineering warmth and authority at once. The serif is the human hand on the blueprint; the Inter body and JetBrains Mono labels are the dimensions and annotations. Cobalt is the only voice that gets to raise itself, and it earns that by rarity. Violet ("peri") is reserved almost exclusively for the *oversight* story — the human-governance thread that runs through the product.

This system explicitly rejects three things, by name. **Sterile enterprise/consultancy:** no stock-photo handshakes, no navy-and-gray corporate abstraction. **AI-hype/chatbot startup:** no glowing orbs, neon cyberpunk, or sci-fi clichés — the live agent earns trust by being *governable*, not magical. **Generic SaaS template:** no gradient-blob hero, no identical 3-card feature grid, no hero-metric template, no purple-on-white slop.

**Key Characteristics:**
- Flat hairline architecture — depth comes from 1px ink borders and full-bleed dividers, never drop shadows.
- A modular Playfair serif display scale over a clean Inter body; JetBrains Mono for data, labels, and machine voice.
- Two-light color: cobalt **signal** marks the load path, violet **peri** carries the human-oversight thread.
- Paper-and-ink ground; warmth comes from the serif and the writing, not from a tinted background.
- Right-angle geometry: square corners everywhere except the pill (toggles, badges, status dots).

## 2. Colors

A paper-and-ink draft lit by a single cobalt signal, with violet reserved for the oversight thread.

### Primary
- **Cobalt Signal** (#2E7DFF): The one raised voice. It marks the load path — the live AI agent's "speaking" state, the active service tab arrow, primary-button text, metric figures, link accents, the footer's top rule, focus borders. Used sparingly so it always means "look here." Transparency tints (`signal-40/20/05`) carry scan lines, glows, and success-panel washes.
- **Deep Ink** (#101417): The drafting ink. Every hairline border, all primary body and heading text, the dark inverted sections (Why Agentic, governance band, footer), and the default fill of primary buttons. The structural backbone of the whole system. Ink tints `ink-90 → ink-10` build the entire text-and-divider hierarchy.

### Secondary
- **Peri Violet** (#7C6BFF): The human-oversight thread. Reserved for the oversight toggle's "on" state, the oversight badge dot and border, the "thinking/listening" agent state, and the services ambient glow. When violet appears, it means *a human is in the loop.* Tints `peri-40/30/05`.

### Neutral
- **Paper** (#F0EEE9): The drawing ground. Body background, light surfaces, button text on ink, inverted text on dark sections. A warm off-white — but the warmth is the *paper stock*, not a decorative tint; the brand's warmth lives in the serif and the copy. Tints `paper-80 → paper-50` back the frosted header and translucent overlays.
- **Pure White** (#FFFFFF): Selection text and the 50%-white fills behind frosted cards (`rgba(255,255,255,0.5)` + backdrop-blur).

### Tertiary (status only)
- **Warning Orange** (#EA580C): Migration/legacy tags only (`tag-warning`), at low-saturation backgrounds. Never decorative.
- **Danger Red** (#DC2626): Form field errors only.

### Named Rules
**The Single Signal Rule.** Cobalt is the only color permitted to raise its voice, and it marks the load path — never more than a few elements per fold. If a screen has cobalt in five places, four of them are wrong. Its rarity is what makes it read as "important."

**The Oversight-Violet Rule.** Peri violet is forbidden as a general accent. It is the visual signature of *human oversight* and appears only where that story is being told (the toggle, the badge, the agent's thinking state). Using it decoratively dilutes the one thing it means.

**The Paper-Is-Stock Rule.** The warm paper ground is drawing stock, not a mood tint. Never push it warmer "for feel," and never carry brand warmth in the background — warmth is the serif and the writing's job.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, Times New Roman, serif)
**Body Font:** Inter (with -apple-system, Segoe UI, Roboto, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo)

**Character:** A high-contrast transitional serif paired against a neutral grotesque and a precise mono — the drawing's title-block hand, its body annotations, and its dimension figures. Playfair supplies authority and a human warmth that keeps the engineering from going cold; Inter keeps prose quiet and legible; JetBrains Mono signals "this is data / machine voice" wherever it appears.

### Hierarchy
- **Display** (Playfair 700, clamp 3–4.5rem, lh 1.1): Hero headline and the largest section statements. The serif at scale is the system's signature; let it breathe.
- **Headline** (Playfair 600, clamp 2–3rem, lh 1.1): Section `h2`s. Often paired with an italic Playfair lead-in (`.section-head .em`).
- **Title** (Playfair 600, 1.5rem, lh 1.25): `h3`, service titles, card headings.
- **Body** (Inter 400, 1.0625rem, lh 1.65, `ink-80`): Default prose. Larger lead paragraphs use 1.25rem/1.6 (`ink-70`). Cap measure at 65–75ch (the codebase uses `max-width` ~40rem on ledes).
- **Label** (Inter 600, 0.75rem, 0.18em tracking, UPPERCASE, `ink-50`): Eyebrows, field labels, button text, profile ticks. The system's quiet structural captioning.
- **Mono** (JetBrains Mono 500, 0.8125rem): Spec values, migration paths, agent status, transcript user lines. The "data" voice.
- **Metric** (JetBrains Mono 700, clamp 2.5–3rem, cobalt): Large statistics in the advantage section. The only place big numbers go cobalt.

### Named Rules
**The Serif-For-Voice Rule.** Playfair is for headings, display, and deliberate italic emphasis only. It never sets body copy or labels. Body is always Inter; data is always mono.

**The Mono-Means-Machine Rule.** JetBrains Mono is not a style choice — it tags machine/data content (specs, paths, agent state, metrics). Don't reach for mono to look "technical" on human prose; that's costume.

## 4. Elevation

This is a **flat system**. Depth is drawn, not lit: it comes from 1px ink borders, full-bleed section dividers, the faint background grid, and tonal inversion (dark ink sections against paper). There is **no drop-shadow vocabulary at all** — not even on scroll. The only non-line material is frosted-glass blur, and it is functional (legibility through a layer), never decorative. If a surface has a diffuse shadow, the system has been violated.

### Shadow Vocabulary
- **Header-scrolled** (`box-shadow: 0 1px 0 var(--ink-20)` + border darkens to `--ink`): Applied to `.site-header.scrolled` only — a crisp 1px hairline lift, the drawn way to say "the header has detached from the page top." No diffuse glow.
- **Frost** (`backdrop-filter: blur(6–10px)` over `rgba(255,255,255,0.5)` or `paper-80`): The fixed header and `card--frost`/`spec-card`. A material, not a shadow — keeps content legible through a layer, never decorative.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Depth is a 1px ink line or a tonal inversion, never a shadow. Shadow is a state response (scroll, frost), full stop.

**The Glass-Is-Functional Rule.** Backdrop-blur exists to keep the fixed header and overlay cards readable over moving content. It is never applied to make something "look premium." Glassmorphism as decoration is forbidden.

## 5. Components

### Buttons
- **Shape:** Square corners (`radius: 0`) — universal. Buttons are drawn rectangles.
- **Primary:** Ink fill, cobalt text, 0.18em-tracked uppercase label, padding 16×32px. The inverse-of-expected pairing (dark button, bright text) is intentional and distinctive.
- **Hover / Focus:** Primary inverts on hover — fill becomes cobalt, text becomes ink — over a slow 500ms ease. Lilac variant inverts to peri instead (used where oversight is the context).
- **Outline:** Transparent on paper, 1px ink border, ink text; inverts to ink-fill/paper-text on hover. The quieter secondary action.

### Chips
- **Style:** Transparent with a 1px `ink-20` border, ink text, square, padding 9×13px. Used as agent suggestion prompts and service signal tags.
- **State:** Hover fills solid ink with paper text. Disabled drops to 0.4 opacity. No "selected" persistent state — chips are momentary actions.

### Cards / Containers
- **Corner Style:** Square (`radius: 0`). The system has no rounded cards.
- **Background:** Paper (transparent over paper) for default `.card`; ink for `.card-dark`; 50%-white + frost for `.spec-card`/`.card--frost`.
- **Shadow Strategy:** None at rest (see Elevation). `.card--invert` and `.edge-card` shift fill/border color on hover instead of lifting.
- **Border:** 1px solid ink, always. The border *is* the card.
- **Internal Padding:** 32px (`space-6`) default; 24px (`space-5`) for dark/spec cards.

### Inputs / Fields
- **Style:** Transparent fill, 1px ink border, square, ink text, Inter 0.875rem, padding 12×16px. Placeholder at `ink-30`.
- **Focus:** Border shifts to cobalt signal (no glow, no ring) — the drawn-line way to show focus. 300ms ease.
- **Error:** `field-error` in danger red, 0.75rem, below the field. Label is always present above (0.18em uppercase).

### Navigation
- **Style:** Fixed frosted header, paper-80 + blur, 1px ink bottom border. Links are Inter 500 0.875rem in ink, with a cobalt underline that wipes in left-to-right on hover (0→100% width, 300ms).
- **States:** Hover → cobalt text + underline. Mobile (<768px): nav links, oversight label, and lang selector hide; header collapses to logo + toggle.

### Signature: The Halo Agent
A pure-SVG "attentive iris" standing in for a 3D head: a cobalt core inside five concentric hairline rings (`r: 38, 66, 94, 122, 150`) that dilate and pulse with conversation state. Idle = small calm core; thinking/listening = violet pulse; speaking = cobalt expansion. Flat, architectural, renders everywhere (no WebGL dependency), and honors `prefers-reduced-motion` by holding still. It is the live, governable agent — capability *with* visible control.

### Signature: The Integrated Wordmark
The "Nubis" signature sets a geometric **N** glyph (ink stems + a rising cobalt beam) as the capital letter, immediately before Playfair "ubis" and a cobalt period. Logo and wordmark are one object; the mark scales em-relative to its surrounding font-size (header 1.5rem, footer 1.875rem). Inverted on ink: stems go paper, beam + period stay cobalt.

### Signature: The Oversight Toggle
A pill switch (the system's one rounded shape) whose "on" track goes peri violet — the physical control for the human-oversight story. Paired with a mono/label caption and an animated status dot. This is the brand thesis made into an interface element.

## 6. Do's and Don'ts

### Do:
- **Do** draw depth with 1px ink borders and full-bleed dividers. The line is the system.
- **Do** keep cobalt rare — a few signal elements per fold, marking the load path. Reserve violet strictly for the human-oversight thread.
- **Do** set headings in Playfair and data/labels in JetBrains Mono; keep all body copy in Inter.
- **Do** use square corners everywhere; the pill is reserved for toggles, badges, and status dots.
- **Do** invert on hover (fill ↔ text) for buttons and cards, on a slow 500ms ease — the signature interaction.
- **Do** keep every animation gated behind `prefers-reduced-motion: reduce`, and ship content visible by default (motion enhances, never reveals).
- **Do** hold body text at ≥4.5:1 contrast — `ink-80`/`ink-90` on paper for prose; watch `ink-50`/`ink-60` muted tints, which are for labels and captions only, not running body.

### Don't:
- **Don't** ship a **sterile enterprise/consultancy** look — no stock-photo handshakes, no navy-and-gray corporate abstraction.
- **Don't** ship an **AI-hype / chatbot startup** look — no glowing orbs, neon cyberpunk, sci-fi clichés, or "revolutionary AI" breathlessness. The agent earns trust by being governable, not magical.
- **Don't** ship a **generic SaaS template** — no gradient-blob hero, no identical 3-card feature grid, no hero-metric template, no purple-on-white slop.
- **Don't** add resting drop-shadows. Shadow is a state response (scroll, frost) only. If it looks like a 2014 card, the shadow shouldn't be there at all.
- **Don't** use violet as a decorative accent. It means *human oversight*; decorative use dilutes the thesis.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored side-stripe accent. Borders are full and 1px.
- **Don't** use gradient text (`background-clip: text`). Emphasis is weight, size, or cobalt — never a gradient.
- **Don't** set body copy in Playfair, or reach for mono to make human prose "look technical." Mono means machine/data.
- **Don't** warm the paper background further for "feel." Warmth is the serif and the copy's job.
