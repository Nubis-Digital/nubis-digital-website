# Unified laptop portal design

## Goal

Turn the laptop in the homepage opening into a live entry point for the Nubis website: the visual content inside its screen is real DOM from the landing page, and scroll transitions continuously from that screen into the same page.

## Context

The current hero uses `public/hero-recommend.webp` as a static laptop screenshot, then fades into an unrelated `.dive-ui` oversight console. The shift breaks the narrative because users do not enter the site shown in the laptop.

## Chosen approach

Use a raster laptop shell plus a live HTML/CSS screen surface.

- Keep the existing laptop image for its photorealistic chassis, lighting, and perspective.
- Cover its visible screen with a clipped, perspective-transformed DOM surface.
- Build the surface from shared homepage content and data rather than a screenshot or a bespoke console.
- Animate that same surface through a scroll-pinned transition from the laptop screen rectangle to the viewport.
- Hand off into the normal page flow only after the surface fills the viewport.

Canvas and SVG are explicitly rejected as the primary content layer. Canvas makes live page content inaccessible and expensive to keep in sync; redrawing a photographic laptop in SVG reduces fidelity without solving the continuity problem.

## Component boundaries

### `PortalContent`

A focused presentational component containing the live content visible in the laptop opening: brand mark, navigation cue, hero statement, and the first page visual language. It consumes existing structured content rather than duplicating copy strings.

It will support two layouts through CSS:

1. **Screen mode** — scaled and clipped to the laptop display, with perspective matching the photographed screen.
2. **Page mode** — expanded, readable, and positioned as the initial full-viewport experience.

### `Hero`

Owns the hero shell: the raster laptop, framing copy, callouts, and the portal mount. The existing unrelated `.dive-ui` and its arrival curtain are removed or replaced by semantic transition layers that serve the portal.

### `MotionLayer`

Owns desktop-only GSAP `ScrollTrigger` choreography:

1. Fade nonessential hero framing.
2. Zoom the laptop toward its display.
3. Grow and flatten the portal surface from screen mode to page mode.
4. Release the pin only once the portal fills the viewport and the normal content flow is visually continuous.

### CSS

Defines the screen aperture, clipping, transform origin, responsive sizing, and no-motion/mobile fallback. The live portal stays visible without JavaScript; the cinematic interpolation is enhancement-only.

## Interaction and accessibility

- The laptop is decorative; live portal content remains semantic HTML.
- The initial screen-mode surface is not keyboard-focusable until it becomes the active page surface, preventing duplicate focus targets.
- Desktop motion runs only for `min-width: 900px` and `prefers-reduced-motion: no-preference`.
- Mobile, reduced-motion, and no-JavaScript users receive a normal, immediately readable hero and page flow.
- The transition must avoid duplicating primary headings or landmarks for assistive technologies.

## Visual continuity rules

- The content inside the laptop must use the same content source, typography, color system, and brand language as the page it reveals.
- No unrelated product console or invented product state may appear midway through the dive.
- The shift to full page must happen only after the laptop frame has left the viewport, avoiding a visible layer swap.
- The laptop image is a physical shell, not the page content.

## Validation

- Add focused tests for the component state and reduced-motion/static fallback where the project test setup supports them.
- Run the production build.
- Verify keyboard focus and heading semantics across the transition states.
- Check desktop, mobile, and reduced-motion layouts manually when a browser preview is available.

## Publication follow-up

After the portal implementation passes validation, make the redesign publishable through Sites: establish hosting metadata, version the current application source, correct the legacy static deployment path, set the required hosted environment values, and deploy the validated version.

## Out of scope

- Rebuilding the laptop chassis in SVG or WebGL.
- A canvas-rendered website.
- Adding new product capabilities or changing the homepage's narrative/content scope.
