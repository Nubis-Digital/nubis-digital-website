import type { StoryDevice } from '@/data/story'
import type { gsap } from 'gsap'
import type { ScrollTrigger } from 'gsap/ScrollTrigger'

import { getDockTransform, readLayoutBox, type DockTransform } from './dockTransform'
import { addPlateChoreography } from './plateMotion'

export type StoryBeat =
  | 'claim' | 'takeover' | 'argument' | 'handoff' | 'bridge'
  | 'question' | 'machine-read' | 'recommendation' | 'release'

export interface StoryState {
  beat: StoryBeat
  chapterIndex: number
  device: StoryDevice
  localProgress: number
  /** 0 until the machine read starts, ramps to 1 across it, then holds. Drives the ledger rows. */
  ledgerProgress: number
}

export const STORY_BEATS = {
  claimEnd: 0.06,
  takeoverEnd: 0.14,
  argumentEnd: 0.54,
  handoffEnd: 0.64,
  bridgeEnd: 0.72,
  questionEnd: 0.78,
  machineReadEnd: 0.88,
  recommendationEnd: 0.94,
} as const

/** Each beat ends where the next begins: left-exclusive, right-inclusive. */
const BEAT_TABLE: ReadonlyArray<{ beat: StoryBeat; start: number; end: number }> = [
  { beat: 'claim', start: 0, end: STORY_BEATS.claimEnd },
  { beat: 'takeover', start: STORY_BEATS.claimEnd, end: STORY_BEATS.takeoverEnd },
  { beat: 'argument', start: STORY_BEATS.takeoverEnd, end: STORY_BEATS.argumentEnd },
  { beat: 'handoff', start: STORY_BEATS.argumentEnd, end: STORY_BEATS.handoffEnd },
  { beat: 'bridge', start: STORY_BEATS.handoffEnd, end: STORY_BEATS.bridgeEnd },
  { beat: 'question', start: STORY_BEATS.bridgeEnd, end: STORY_BEATS.questionEnd },
  { beat: 'machine-read', start: STORY_BEATS.questionEnd, end: STORY_BEATS.machineReadEnd },
  { beat: 'recommendation', start: STORY_BEATS.machineReadEnd, end: STORY_BEATS.recommendationEnd },
  { beat: 'release', start: STORY_BEATS.recommendationEnd, end: 1 },
]

/**
 * The mount that is readable in the server-rendered document — and therefore
 * the one that owns the un-suffixed element ids the site links to. Everything
 * that restores the un-enhanced state (SSR markup, `resetStoryMounts`) reads
 * this one constant, so the two can never disagree.
 */
export const SERVER_EXPOSED_MOUNT: StoryDevice = 'laptop'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Progress through `[start, end]`, safe when the two coincide. */
const span = (progress: number, start: number, end: number) => (end > start ? clamp01((progress - start) / (end - start)) : 1)

export function getStoryState(rawProgress: number): StoryState {
  const progress = clamp01(rawProgress)
  const { beat, start, end } = BEAT_TABLE.find((entry) => progress < entry.end) ?? BEAT_TABLE[BEAT_TABLE.length - 1]
  const localProgress = span(progress, start, end)

  let chapterIndex = 5
  if (progress < STORY_BEATS.argumentEnd) chapterIndex = beat === 'argument' ? Math.min(3, Math.floor(localProgress * 4 + 1e-9)) : 0
  else if (progress < STORY_BEATS.bridgeEnd) chapterIndex = 4

  return {
    beat,
    chapterIndex,
    device: progress < STORY_BEATS.argumentEnd ? 'laptop' : 'phone',
    localProgress,
    ledgerProgress: span(progress, STORY_BEATS.questionEnd, STORY_BEATS.machineReadEnd),
  }
}

export type AgentPhase = 'question' | 'answer' | 'approved'

/**
 * The phone-side exchange: the question holds while the machine reads, the
 * answer composes as the recommendation beat opens, and the human approval
 * lands halfway through it. Pure, so the finale is testable without scroll.
 */
export function getAgentPhase(state: StoryState): AgentPhase {
  if (state.beat === 'release') return 'approved'
  if (state.beat !== 'recommendation') return 'question'
  return state.localProgress < 0.5 ? 'answer' : 'approved'
}

/** How many ledger rows the machine has read at a given `ledgerProgress`. */
export function getRevealedRows(rows: number, ledgerProgress: number): number {
  return Math.min(rows, Math.floor(clamp01(ledgerProgress) * rows + 1e-9))
}

/**
 * How far row `index`'s dimension line has drawn: rows share the ramp evenly,
 * so each line draws during its own slice and is complete when its row reveals.
 */
export function getLineProgress(index: number, rows: number, ledgerProgress: number): number {
  return rows > 0 ? clamp01(clamp01(ledgerProgress) * rows - index) : 0
}

function setExposed(element: HTMLElement, exposed: boolean): void {
  element.toggleAttribute('inert', !exposed)
  if (exposed) element.removeAttribute('aria-hidden')
  else element.setAttribute('aria-hidden', 'true')
}

/**
 * Gate 1 of the single-voiced contract: the dual mount ships two identical
 * chapter trees, and only the one matching `getStoryState().device` may be in
 * the accessibility tree. The inactive tree is inerted whole.
 */
export function setActiveMount(root: HTMLElement, device: StoryDevice): void {
  root.querySelectorAll<HTMLElement>('[data-story-mount]').forEach((mount) => {
    const active = mount.dataset.storyMount === device
    setExposed(mount, active)
    mount.dataset.activeMount = String(active)
  })
}

/** Back to the server-rendered shape: one exposed mount, no runtime state. */
export function resetStoryMounts(root: HTMLElement): void {
  setActiveMount(root, SERVER_EXPOSED_MOUNT)
  root.querySelectorAll<HTMLElement>('[data-story-mount]').forEach((mount) => { delete mount.dataset.activeMount })
}

/**
 * Gate 2: exactly one chapter is exposed, and `activeIndex` is counted *inside*
 * the active mount — an index across both trees would voice the wrong chapter
 * and leave a stale `data-active` behind in the tree that just went quiet.
 * Chapters in the inactive mount are always inactive, so the invariant holds
 * from this function alone even before `setActiveMount` has run.
 */
export function setActiveChapter(root: HTMLElement, activeIndex: number): void {
  const activeMount = root.querySelector<HTMLElement>('[data-story-mount][data-active-mount="true"]')
  const inScope = Array.from((activeMount ?? root).querySelectorAll<HTMLElement>('[data-story-chapter]'))

  root.querySelectorAll<HTMLElement>('[data-story-chapter]').forEach((chapter) => {
    const active = inScope.indexOf(chapter) === activeIndex
    setExposed(chapter, active)
    chapter.dataset.active = String(active)
  })
}

export function setInvitationAccessibility(root: HTMLElement, visible: boolean): void {
  setExposed(requireStoryElement(root, '.story-invitation'), visible)
}

export function setAgentPhase(root: HTMLElement, phase: AgentPhase): void {
  root.querySelectorAll<HTMLElement>('[data-agent-exchange]').forEach((exchange) => { exchange.dataset.phase = phase })
}

/** Reveals ledger rows and draws their dimension lines for one `ledgerProgress`. */
export function setLedgerProgress(root: HTMLElement, ledgerProgress: number): void {
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-ledger-row]'))
  const revealed = getRevealedRows(rows.length, ledgerProgress)
  rows.forEach((row, index) => { row.dataset.revealed = String(index < revealed) })
  root.querySelectorAll<HTMLElement>('[data-dimension-line]').forEach((line, index) => {
    const progress = getLineProgress(index, rows.length, ledgerProgress)
    line.style.transform = `scaleX(${progress})`
    // The fact riding the line from the phone into its row.
    line.parentElement?.style.setProperty('--line-progress', String(progress))
  })
}

/**
 * The server-rendered finale is the static drafted panel: every row read,
 * every line drawn, the exchange shown through to approval. Reset returns there.
 */
export function resetStoryFinale(root: HTMLElement): void {
  setAgentPhase(root, 'approved')
  setLedgerProgress(root, 1)
}

export interface FontsReadyHost { fonts?: { ready?: PromiseLike<unknown> } }

/**
 * The dock slot's width is a grid track sized against the Playfair headline's
 * `clamp()` column, so measuring before the webfonts swap docks the laptop to
 * the wrong slot on first paint. Re-run the measurement once fonts settle.
 * Returns a cancel function so a torn-down story never refreshes late.
 */
export function refreshOnFontsReady(host: FontsReadyHost, refresh: () => void): () => void {
  const ready = host.fonts?.ready
  if (!ready || typeof ready.then !== 'function') return () => {}

  let cancelled = false
  ready.then(() => { if (!cancelled) refresh() })
  return () => { cancelled = true }
}

function requireStoryElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector)
  if (!element) throw new Error(`Immersive story is missing required element: ${selector}`)
  return element
}

/**
 * Snap-to-chapter, built and parked behind a flag (client decision 5): it is
 * the first thing cut if it fights trackpads.
 */
export const STORY_SNAP_ENABLED = false

export interface ScrollTriggerOptions { snap: boolean; onRefreshInit?: () => void }

export function buildScrollTriggerConfig(root: HTMLElement, { snap, onRefreshInit }: ScrollTriggerOptions): ScrollTrigger.Vars {
  return {
    trigger: root,
    start: 'top top',
    end: '+=600%',
    scrub: 0.6,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    ...(onRefreshInit ? { onRefreshInit } : {}),
    ...(snap ? { snap: { snapTo: 'labels', duration: { min: 0.2, max: 0.5 }, directional: true, ease: 'power1.inOut' } } : {}),
  }
}

/** Chapter changes inside the argument beat: four equal slices. */
const ARGUMENT_STEP = (STORY_BEATS.argumentEnd - STORY_BEATS.takeoverEnd) / 4
/**
 * Where the laptop settles for the argument: nudged left and slightly smaller,
 * clearing the stage's right-hand lane for the drafted figure plates (the lane
 * the ledger takes over at the finale).
 */
export const ARGUMENT_POSE = { x: -0.09, scale: 0.88 } as const

/**
 * The laptop screen's aperture in the 600×600 drawing (fractions of the shell),
 * mirrored from the `--story-laptop-*` vars that `laptopPortalAsset.test.ts` pins.
 */
const SCREEN = { x: 0.15927167, y: 0.21248333, w: 0.67609, h: 0.42128167 } as const
/** The shell's push-in at the end of the argument beat. */
const ARGUMENT_PUSH = 1.035

export interface HandoffOrigin { x: number; y: number; scale: number }

/**
 * Where the phone starts the handoff: centred on the laptop screen as it sits
 * at the end of the argument, rotated landscape, its long side matched to the
 * screen's width. Offsets are from the stage centre, where both devices are
 * laid out, so they are the phone wrapper's `x`/`y`.
 */
export function getHandoffOrigin(shellWidth: number, phoneHeight: number, viewportWidth: number): HandoffOrigin {
  const k = ARGUMENT_POSE.scale * ARGUMENT_PUSH
  return {
    x: ARGUMENT_POSE.x * viewportWidth + (SCREEN.x + SCREEN.w / 2 - 0.5) * shellWidth * k,
    y: (SCREEN.y + SCREEN.h / 2 - 0.5) * shellWidth * k,
    scale: phoneHeight > 0 ? (SCREEN.w * shellWidth * k) / phoneHeight : 1,
  }
}

/** Lid angle when folded onto the base; -90 would be edge-on to the viewer. */
export const LID_CLOSED = -86

/**
 * The laptop opens once as the enhanced hero appears. A one-off, time-based
 * entrance (not scrubbed), so it only plays when the story starts at the top —
 * landing mid-story must not replay it over the scrubbed state. The masthead
 * boots once the lid is most of the way up.
 */
export function playLidIntro(gsapApi: typeof gsap, root: HTMLElement, progress: number, hidden = false): void {
  // A background tab pauses the ticker on the tween's first frame — a shut lid —
  // so a page that loads unseen skips the entrance and shows the laptop open.
  if (progress > 0 || hidden) return
  const lid = root.querySelector<HTMLElement>('[data-story-lid]')
  const parts = Array.from(root.querySelectorAll<HTMLElement>('[data-masthead-part]'))
  if (!lid) return
  gsapApi.fromTo(lid, { rotationX: LID_CLOSED, transformPerspective: 1600 }, { rotationX: 0, duration: 1.4, delay: 0.25, ease: 'expo.out' })
  // The screen mirrors the hero: asking… while the question types, then the
  // answer (the wordmark) as the headline lands, then the recommendation chip.
  MASTHEAD_BEATS.forEach((delay, index) => {
    if (parts[index]) gsapApi.fromTo(parts[index], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, delay, ease: 'expo.out' })
  })
}

/** When each masthead part boots (seconds), paced against the hero intro. */
export const MASTHEAD_BEATS = [0.7, 1.9, 2.4] as const

/** Scan-wipe length for a chapter change inside the argument beat. */
const SCAN = 0.03

export function createStoryTimeline(gsapApi: typeof gsap, root: HTMLElement): gsap.core.Timeline {
  const laptop = requireStoryElement(root, '[data-story-device="laptop"]')
  const phone = requireStoryElement(root, '[data-story-device="phone"]')
  const invitationCopy = requireStoryElement(root, '.story-invitation > div')
  const cue = requireStoryElement(root, '.story-invitation__cue')
  const dockSlot = requireStoryElement(root, '[data-story-dock-slot]')
  const laptopShell = requireStoryElement(root, '[data-story-device="laptop"] .story-laptop')
  const laptopMount = requireStoryElement(root, '[data-story-mount="laptop"]')
  const phoneMount = requireStoryElement(root, '[data-story-mount="phone"]')
  const masthead = requireStoryElement(root, '[data-story-masthead]')
  const ledger = requireStoryElement(root, '[data-story-ledger]')
  const screen = requireStoryElement(root, '.story-laptop__viewport')
  const lid = requireStoryElement(root, '[data-story-lid]')
  const scan = requireStoryElement(root, '[data-story-scan]')
  const screenProgress = requireStoryElement(root, '[data-story-screen-progress]')
  const guides = Array.from(root.querySelectorAll<HTMLElement>('[data-story-guide]'))
  const phoneShell = requireStoryElement(root, '[data-story-device="phone"] .story-phone')
  const marks = Array.from(root.querySelectorAll<HTMLElement>('[data-story-mark]'))
  const dimension = requireStoryElement(root, '[data-story-dimension]')
  const readout = root.querySelector<HTMLElement>('[data-story-scale-readout]')

  // Scoped to the laptop mount: the phone mount holds an identical set of
  // chapters, so an unscoped query finds 12 and the crossfades would target
  // whichever tree happened to come first in the DOM. The phone's chapters are
  // state-driven (`data-active`), never tweened.
  const chapters = Array.from(laptopMount.querySelectorAll<HTMLElement>('[data-story-chapter]'))
  if (chapters.length !== 6) throw new Error(`Immersive story requires 6 chapters; found ${chapters.length}`)

  /**
   * The hero dock, measured once per ScrollTrigger refresh.
   *
   * The measured box is the *shell* (the hardware), because that is what has to
   * fit the slot — but the transform is applied to its full-stage wrapper. That
   * is sound because the wrapper is `inset: 0` with `place-items: center`, so
   * its transform origin is exactly the shell's centre: scaling the wrapper
   * scales the shell about itself, and `x`/`y` translate both together.
   */
  let dockCache: DockTransform | null = null
  const dock = (): DockTransform => (dockCache ??= getDockTransform(readLayoutBox(laptopShell), readLayoutBox(dockSlot)))
  // Viewport-relative travel, re-read on refresh like the dock.
  const vw = (fraction: number) => () => fraction * window.innerWidth
  const vh = (fraction: number) => () => fraction * window.innerHeight

  const timeline = gsapApi.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: buildScrollTriggerConfig(root, { snap: STORY_SNAP_ENABLED, onRefreshInit() { dockCache = null; originCache = null } }),
    onUpdate() {
      const state = getStoryState(timeline.progress())
      // Order matters: the mount gate decides which tree `activeIndex` counts in.
      setActiveMount(root, state.device)
      setActiveChapter(root, state.chapterIndex)
      setInvitationAccessibility(root, state.beat === 'claim')
      setAgentPhase(root, getAgentPhase(state))
      setLedgerProgress(root, state.ledgerProgress)
      root.dataset.beat = state.beat
      root.dataset.device = state.device
      root.style.setProperty('--story-progress', String(timeline.progress()))
      // The dimension line's live readout: the drawing's scale as the laptop
      // travels from the dock to full elevation and back into the witness.
      if (readout && typeof gsapApi.getProperty === 'function') {
        const text = `Scale ${Number(gsapApi.getProperty(laptop, 'scale')).toFixed(2)}`
        if (readout.textContent !== text) readout.textContent = text
      }
    },
  })

  const takeover = STORY_BEATS.takeoverEnd - STORY_BEATS.claimEnd
  const handoff = STORY_BEATS.handoffEnd - STORY_BEATS.argumentEnd
  // The axonometric "sketch" pose the laptop is docked in, and recedes back into.
  const PERSPECTIVE = 1600
  const SKETCH = { rotationX: 12, rotationY: -22, transformPerspective: PERSPECTIVE }
  const WITNESS = { rotationX: 10, rotationY: 24, transformPerspective: PERSPECTIVE }
  const SHOWN = 'inset(0% 0% 0% 0%)'
  const BELOW = 'inset(0% 0% 100% 0%)' // hidden, revealed top-down by the scan
  const ABOVE = 'inset(100% 0% 0% 0%)' // wiped away top-down by the scan

  /**
   * A cobalt scan line sweeps the screen top to bottom: above the line is the
   * new surface, below it the old. Both clips and the line share one linear
   * tween, so the edge of the reveal *is* the line.
   */
  const scanWipe = (outgoing: HTMLElement, incoming: HTMLElement, position: number, duration: number) => {
    timeline
      .fromTo(scan, { yPercent: 0, autoAlpha: 1 }, { yPercent: 100, autoAlpha: 1, duration, immediateRender: false }, position)
      .set(scan, { autoAlpha: 0 }, position + duration)
      .fromTo(outgoing, { clipPath: SHOWN }, { clipPath: ABOVE, duration, immediateRender: false }, position)
      .fromTo(incoming, { clipPath: BELOW }, { clipPath: SHOWN, duration, immediateRender: false }, position)
  }

  // Initial drawing state. Timeline `.set`s at 0 are reversible under scrub.
  timeline
    .set(laptopShell, { ...SKETCH, scale: 1 }, 0)
    .set(scan, { autoAlpha: 0 }, 0)
    .set(laptopMount, { clipPath: BELOW }, 0)
    .set(masthead, { clipPath: SHOWN }, 0)
    .set(chapters[0], { clipPath: SHOWN }, 0)
    .set(chapters.slice(1), { clipPath: BELOW }, 0)
    .set(guides, { scale: 0 }, 0)
    .set(marks, { autoAlpha: 0, scale: 1.6 }, 0)
    .set(dimension, { scaleX: 0 }, 0)
    .set(screenProgress, { scaleX: 0 }, 0)

  // Beat 1 — the claim. A hold, then the copy starts leaving while the drafting
  // apparatus is drawn around the docked sketch: marks settle onto the corners,
  // construction guides run out along the screen edges, the dimension line opens.
  timeline
    .addLabel('claim', 0)
    .to([invitationCopy, cue], { opacity: 0, x: vw(-0.04), duration: 0.08 }, 0.02)
    .to(marks, { autoAlpha: 1, scale: 1, duration: 0.03, stagger: 0.006 }, 0.015)
    .to(guides, { scale: 1, duration: 0.05, stagger: 0.008 }, 0.02)
    .to(dimension, { scaleX: 1, duration: 0.04 }, 0.03)
    .to(laptopShell, { rotationY: -16, duration: STORY_BEATS.claimEnd }, 0)

  // Beat 2 — the takeover. The laptop travels from the measured dock to the
  // stage centre while turning from sketch to orthographic elevation; then the
  // screen renders: the scan wipes the masthead away and draws the live tree.
  timeline
    .addLabel('takeover', STORY_BEATS.claimEnd)
    .fromTo(
      laptop,
      // Function-based values + invalidateOnRefresh: re-measured on resize.
      { x: () => dock().x, y: () => dock().y, scale: () => dock().scale },
      { x: vw(ARGUMENT_POSE.x), y: 0, scale: ARGUMENT_POSE.scale, duration: takeover },
      'takeover',
    )
    .to(laptopShell, { rotationX: 0, rotationY: 0, duration: takeover, ease: 'power1.out' }, 'takeover')
  scanWipe(masthead, laptopMount, STORY_BEATS.takeoverEnd - 0.045, 0.04)
  timeline
    // Construction guides are scaffolding: they retract once the drawing is
    // inked, leaving only the marks and the dimension readout on stage.
    .to(guides, { scale: 0, duration: 0.03, stagger: 0.004 }, STORY_BEATS.takeoverEnd - 0.005)
    .to(dimension, { opacity: 0.5, duration: 0.03 }, STORY_BEATS.takeoverEnd)

  // Beat 3 — the argument. The hardware holds (a slow push-in, nothing more);
  // chapters change by scan wipe and the progress rule fills across the screen.
  timeline
    .addLabel('argument-1', STORY_BEATS.takeoverEnd)
    .to(screenProgress, { scaleX: 1, duration: STORY_BEATS.argumentEnd - STORY_BEATS.takeoverEnd }, STORY_BEATS.takeoverEnd)
    .to(laptopShell, { scale: ARGUMENT_PUSH, duration: STORY_BEATS.argumentEnd - STORY_BEATS.takeoverEnd }, STORY_BEATS.takeoverEnd)
  ;[1, 2, 3].forEach((index) => {
    const position = STORY_BEATS.takeoverEnd + ARGUMENT_STEP * index
    timeline.addLabel(`argument-${index + 1}`, position)
    scanWipe(chapters[index - 1], chapters[index], position - SCAN / 2, SCAN)
  })
  // One drafted plate per laptop chapter, in the stage's right-hand lane.
  addPlateChoreography(timeline, root, [0, 1, 2, 3].map((index) => ({
    start: STORY_BEATS.takeoverEnd + ARGUMENT_STEP * index,
    end: STORY_BEATS.takeoverEnd + ARGUMENT_STEP * (index + 1),
  })))

  // Beat 4 — the handoff: the screen becomes the phone. The phone starts
  // exactly over the laptop's screen — turned landscape and matched to the
  // screen's width — as the screen lifts off; then it rotates upright and grows
  // to centre stage carrying the story. Behind it the lid folds shut and the
  // laptop sinks away into a faint drafted witness. Measured once per refresh.
  let originCache: HandoffOrigin | null = null
  const origin = (): HandoffOrigin => (originCache ??= getHandoffOrigin(readLayoutBox(laptopShell).width, readLayoutBox(phoneShell).height, window.innerWidth))
  const handoffStart = STORY_BEATS.argumentEnd
  timeline
    .addLabel('handoff', handoffStart)
    .to(screen, { opacity: 0, duration: 0.012 }, handoffStart)
    .fromTo(phone, { opacity: 0 }, { opacity: 1, duration: 0.012 }, handoffStart)
    // The phone lifts off as a blank lit screen; its story only fades in once it
    // is nearly upright, so no sideways text ever crosses the laptop's copy.
    .fromTo(phoneMount, { opacity: 0 }, { opacity: 1, duration: handoff * 0.3 }, handoffStart + handoff * 0.6)
    .fromTo(
      phone,
      { x: () => origin().x, y: () => origin().y, scale: () => origin().scale, rotation: -90 },
      { x: 0, y: 0, scale: 1, rotation: 0, duration: handoff, ease: 'power2.inOut' },
      handoffStart,
    )
    .to(lid, { rotationX: LID_CLOSED, transformPerspective: PERSPECTIVE, duration: handoff * 0.5, ease: 'power1.in' }, handoffStart + handoff * 0.2)
    .to(laptop, { x: vw(-0.3), y: vh(0.08), scale: 0.5, opacity: 0.2, duration: handoff * 0.7 }, handoffStart + handoff * 0.3)
    .to(laptopShell, { ...WITNESS, scale: 1, duration: handoff * 0.7, ease: 'power1.in' }, handoffStart + handoff * 0.3)
    .to(dimension, { scale: 0, duration: handoff * 0.4 }, handoffStart)

  // Beats 5a/5b — bridge and finale. Chapter state, the agent phase and ledger
  // rows are driven from `getStoryState` in onUpdate; only the ledger panel
  // itself fades in here, just ahead of the machine read.
  timeline
    .addLabel('bridge', STORY_BEATS.handoffEnd)
    .addLabel('question', STORY_BEATS.bridgeEnd)
    .fromTo(ledger, { opacity: 0 }, { opacity: 1, duration: 0.03 }, STORY_BEATS.questionEnd - 0.03)
    .addLabel('machine-read', STORY_BEATS.questionEnd)
    .addLabel('recommendation', STORY_BEATS.machineReadEnd)

  // Release — the finale owns its exit: phone and ledger drift up and fade, the
  // witness and its load path go with them.
  const release = 1 - STORY_BEATS.recommendationEnd
  timeline
    .addLabel('release', STORY_BEATS.recommendationEnd)
    .to([phone, ledger], { opacity: 0, yPercent: -6, duration: release }, 'release')
    .to(laptop, { opacity: 0, duration: release }, 'release')

  return timeline
}
