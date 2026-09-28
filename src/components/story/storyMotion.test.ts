import { describe, expect, it } from 'vitest'

import type { gsap } from 'gsap'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { StoryPlates } from './StoryPlates'

import { ARGUMENT_POSE, MASTHEAD_BEATS, buildScrollTriggerConfig, getHandoffOrigin, LID_CLOSED, playLidIntro, createStoryTimeline, getAgentPhase, getLineProgress, getRevealedRows, getStoryState, refreshOnFontsReady, resetStoryFinale, setActiveChapter, setActiveMount, setAgentPhase, setInvitationAccessibility, setLedgerProgress, STORY_BEATS, STORY_SNAP_ENABLED, type StoryBeat } from './storyMotion'

/** A chapter tree as the dual mount ships it: one `<ol>` per device. */
function mountMarkup(mount: 'laptop' | 'phone') {
  const chapters = Array.from({ length: 6 }, () => '<li data-story-chapter><article></article></li>').join('')
  return `<ol class="story-chapters" data-story-mount="${mount}">${chapters}</ol>`
}

function dualMountRoot() {
  const root = document.createElement('main')
  root.innerHTML = `${mountMarkup('laptop')}${mountMarkup('phone')}`
  return root
}

/**
 * The invariant the whole dual mount exists to protect: an article is *exposed*
 * only when neither it nor any ancestor is `inert` or `aria-hidden`.
 */
function exposedArticles(root: HTMLElement) {
  return Array.from(root.querySelectorAll('article')).filter(
    (article) => !article.closest('[inert]') && !article.closest('[aria-hidden="true"]'),
  )
}

function mountState(root: HTMLElement) {
  return Array.from(root.querySelectorAll('[data-story-mount]'), (mount) => ({
    mount: mount.getAttribute('data-story-mount'),
    active: mount.getAttribute('data-active-mount'),
    hidden: mount.getAttribute('aria-hidden'),
    inert: mount.hasAttribute('inert'),
  }))
}

const EPSILON = 1e-9

describe('getStoryState', () => {
  const boundaries: Array<[number, StoryBeat, StoryBeat]> = [
    [STORY_BEATS.claimEnd, 'claim', 'takeover'],
    [STORY_BEATS.takeoverEnd, 'takeover', 'argument'],
    [STORY_BEATS.argumentEnd, 'argument', 'handoff'],
    [STORY_BEATS.handoffEnd, 'handoff', 'bridge'],
    [STORY_BEATS.bridgeEnd, 'bridge', 'question'],
    [STORY_BEATS.questionEnd, 'question', 'machine-read'],
    [STORY_BEATS.machineReadEnd, 'machine-read', 'recommendation'],
    [STORY_BEATS.recommendationEnd, 'recommendation', 'release'],
  ]

  it.each(boundaries)('treats %s as left-exclusive / right-inclusive (%s → %s)', (boundary, before, after) => {
    expect(getStoryState(boundary - EPSILON).beat).toBe(before)
    expect(getStoryState(boundary).beat).toBe(after)
  })

  it('splits the argument into four equal chapter slices', () => {
    expect(getStoryState(0.14).chapterIndex).toBe(0)
    expect(getStoryState(0.24).chapterIndex).toBe(1)
    expect(getStoryState(0.34).chapterIndex).toBe(2)
    expect(getStoryState(0.44).chapterIndex).toBe(3)
    expect(getStoryState(STORY_BEATS.argumentEnd - EPSILON).chapterIndex).toBe(3)
  })

  it('flips the device exactly at the handoff', () => {
    ;[0, 0.06, 0.2, STORY_BEATS.argumentEnd - EPSILON].forEach((p) => expect(getStoryState(p).device).toBe('laptop'))
    ;[STORY_BEATS.argumentEnd, 0.6, 0.8, 1].forEach((p) => expect(getStoryState(p).device).toBe('phone'))
  })

  it('holds chapter 5 through the bridge and chapter 6 from there on', () => {
    expect(getStoryState(STORY_BEATS.argumentEnd).chapterIndex).toBe(4)
    expect(getStoryState(STORY_BEATS.bridgeEnd - EPSILON).chapterIndex).toBe(4)
    expect(getStoryState(STORY_BEATS.bridgeEnd).chapterIndex).toBe(5)
    expect(getStoryState(1).chapterIndex).toBe(5)
    expect(getStoryState(0.03).chapterIndex).toBe(0)
    expect(getStoryState(0.1).chapterIndex).toBe(0)
  })

  it('keeps localProgress within [0, 1] at every boundary', () => {
    boundaries.flatMap(([b]) => [b - EPSILON, b, b + EPSILON]).concat([0, 1]).forEach((p) => {
      const { localProgress } = getStoryState(p)
      expect(localProgress).toBeGreaterThanOrEqual(0)
      expect(localProgress).toBeLessThanOrEqual(1)
      expect(Number.isFinite(localProgress)).toBe(true)
    })
  })

  it('ramps ledgerProgress across the machine read only', () => {
    expect(getStoryState(0.5).ledgerProgress).toBe(0)
    expect(getStoryState(STORY_BEATS.questionEnd).ledgerProgress).toBe(0)
    expect(getStoryState(0.83).ledgerProgress).toBeCloseTo(0.5)
    expect(getStoryState(STORY_BEATS.machineReadEnd).ledgerProgress).toBe(1)
    expect(getStoryState(0.97).ledgerProgress).toBe(1)
  })

  it('clamps out-of-range progress', () => {
    expect(getStoryState(-1)).toEqual({ beat: 'claim', chapterIndex: 0, device: 'laptop', localProgress: 0, ledgerProgress: 0 })
    expect(getStoryState(2)).toEqual({ beat: 'release', chapterIndex: 5, device: 'phone', localProgress: 1, ledgerProgress: 1 })
  })

  it('returns the same state for reverse and repeated calls', () => {
    const initialState = getStoryState(0.4)
    getStoryState(0.9)
    expect(getStoryState(0.4)).toEqual(initialState)
  })
})

describe('finale pacing', () => {
  it('holds the question through the machine read, then answers and approves', () => {
    expect(getAgentPhase(getStoryState(0.2))).toBe('question')
    expect(getAgentPhase(getStoryState(0.8))).toBe('question')
    expect(getAgentPhase(getStoryState(STORY_BEATS.machineReadEnd))).toBe('answer')
    expect(getAgentPhase(getStoryState(0.92))).toBe('approved')
    expect(getAgentPhase(getStoryState(1))).toBe('approved')
  })

  it('reveals rows one at a time and draws each line during its own slice', () => {
    expect(getRevealedRows(8, 0)).toBe(0)
    expect(getRevealedRows(8, 0.5)).toBe(4)
    expect(getRevealedRows(8, 0.49)).toBe(3)
    expect(getRevealedRows(8, 1)).toBe(8)
    expect(getRevealedRows(8, 2)).toBe(8)
    expect(getLineProgress(0, 8, 0)).toBe(0)
    expect(getLineProgress(3, 8, 0.4375)).toBeCloseTo(0.5)
    expect(getLineProgress(3, 8, 0.5)).toBe(1)
    expect(getLineProgress(7, 8, 1)).toBe(1)
    expect(getLineProgress(0, 0, 1)).toBe(0)
  })

  it('drives and resets the finale DOM deterministically', () => {
    const root = document.createElement('main')
    root.innerHTML = `<section data-agent-exchange data-phase="approved"></section>${'<div data-ledger-row></div>'.repeat(8)}${'<span data-dimension-line></span>'.repeat(8)}`

    setAgentPhase(root, 'question')
    setLedgerProgress(root, 0.5)
    expect(root.querySelector('[data-agent-exchange]')).toHaveAttribute('data-phase', 'question')
    expect(root.querySelectorAll('[data-ledger-row][data-revealed="true"]')).toHaveLength(4)
    expect(root.querySelectorAll<HTMLElement>('[data-dimension-line]')[3].style.transform).toBe('scaleX(1)')
    expect(root.querySelectorAll<HTMLElement>('[data-dimension-line]')[4].style.transform).toBe('scaleX(0)')

    resetStoryFinale(root)
    resetStoryFinale(root)
    expect(root.querySelector('[data-agent-exchange]')).toHaveAttribute('data-phase', 'approved')
    expect(root.querySelectorAll('[data-ledger-row][data-revealed="true"]')).toHaveLength(8)
  })
})

describe('buildScrollTriggerConfig', () => {
  it('ships with snap parked behind the flag', () => {
    const root = document.createElement('main')
    expect(STORY_SNAP_ENABLED).toBe(false)
    const config = buildScrollTriggerConfig(root, { snap: false })
    expect(config).toEqual({ trigger: root, start: 'top top', end: '+=600%', scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true })
    expect(config).not.toHaveProperty('snap')
  })

  it('snaps to labels, directionally, when enabled', () => {
    const onRefreshInit = () => {}
    const config = buildScrollTriggerConfig(document.createElement('main'), { snap: true, onRefreshInit })
    expect(config.snap).toEqual({ snapTo: 'labels', duration: { min: 0.2, max: 0.5 }, directional: true, ease: 'power1.inOut' })
    expect(config.onRefreshInit).toBe(onRefreshInit)
  })
})

describe('setActiveChapter', () => {
  it('is deterministic across forward and backward activation', () => {
    const root = document.createElement('main')
    root.innerHTML = Array.from({ length: 6 }, () => '<article data-story-chapter></article>').join('')
    setActiveChapter(root, 4)
    const expected = Array.from(root.querySelectorAll('[data-story-chapter]'), (chapter) => ({
      active: chapter.getAttribute('data-active'),
      hidden: chapter.getAttribute('aria-hidden'),
      inert: chapter.hasAttribute('inert'),
    }))
    setActiveChapter(root, 1)
    setActiveChapter(root, 4)
    expect(Array.from(root.querySelectorAll('[data-story-chapter]'), (chapter) => ({
      active: chapter.getAttribute('data-active'),
      hidden: chapter.getAttribute('aria-hidden'),
      inert: chapter.hasAttribute('inert'),
    }))).toEqual(expected)
    expect(root.querySelectorAll('[aria-hidden="true"][inert]')).toHaveLength(5)
  })

  it('counts the active index inside the active mount, never across both trees', () => {
    const root = dualMountRoot()
    setActiveMount(root, 'phone')
    setActiveChapter(root, 2)

    const [exposed, ...extras] = exposedArticles(root)
    expect(extras).toHaveLength(0)
    expect(exposed).toBe(root.querySelectorAll('[data-story-mount="phone"] article')[2])
    expect(root.querySelectorAll('[data-story-chapter][data-active="true"]')).toHaveLength(1)
  })
})

describe('setActiveMount', () => {
  it('exposes exactly one mount and is deterministic across repeated and reverse calls', () => {
    const root = dualMountRoot()

    setActiveMount(root, 'phone')
    const expected = mountState(root)
    setActiveMount(root, 'laptop')
    setActiveMount(root, 'phone')

    expect(mountState(root)).toEqual(expected)
    expect(expected).toEqual([
      { mount: 'laptop', active: 'false', hidden: 'true', inert: true },
      { mount: 'phone', active: 'true', hidden: null, inert: false },
    ])
  })

  it('leaves exactly one exposed article for every device and chapter pair', () => {
    const root = dualMountRoot()

    ;(['laptop', 'phone'] as const).forEach((device) => {
      for (let index = 0; index < 6; index += 1) {
        setActiveMount(root, device)
        setActiveChapter(root, index)

        const exposed = exposedArticles(root)
        expect(exposed).toHaveLength(1)
        expect(exposed[0]).toBe(root.querySelectorAll(`[data-story-mount="${device}"] article`)[index])
      }
    })
  })
})

describe('setInvitationAccessibility', () => {
  it('removes and restores the invitation CTA from the accessibility tree', () => {
    const root = document.createElement('main')
    root.innerHTML = '<section class="story-invitation"><a href="#contact">Continue</a></section>'
    const invitation = root.querySelector('.story-invitation')!

    setInvitationAccessibility(root, false)
    expect(invitation).toHaveAttribute('aria-hidden', 'true')
    expect(invitation).toHaveAttribute('inert')
    expect(root.querySelector('a')!.closest('[inert]')).toBe(invitation)

    setInvitationAccessibility(root, true)
    expect(invitation).not.toHaveAttribute('aria-hidden')
    expect(invitation).not.toHaveAttribute('inert')
    expect(root.querySelector('a')!.closest('[inert]')).toBeNull()
  })
})

function storyRoot() {
  const root = document.createElement('main')
  root.innerHTML = `
    <section class="story-invitation"><div><h1>Claim</h1></div><div data-story-dock-slot></div><p class="story-invitation__cue">Scroll</p></section>
    <div data-story-device="laptop"><div class="story-laptop">
      <div data-story-lid><div class="story-laptop__viewport"><div data-story-masthead><p data-masthead-part></p><p data-masthead-part></p><p data-masthead-part></p></div>${mountMarkup('laptop')}<span data-story-scan></span><span data-story-screen-progress></span></div></div>
      <div>${'<span data-story-guide></span>'.repeat(4)}${'<span data-story-mark></span>'.repeat(4)}<div data-story-dimension><span data-story-scale-readout></span></div></div>
    </div></div>
    <div data-story-device="phone"><div class="story-phone">${mountMarkup('phone')}</div></div>
    ${renderToStaticMarkup(createElement(StoryPlates))}
    <div data-story-ledger><section data-agent-exchange data-phase="approved"></section>${'<div data-ledger-row></div>'.repeat(8)}</div>
  `
  return root
}

interface Metrics { left: number; top: number; width: number; height: number }

/**
 * jsdom reports every layout metric as 0, so the dock measurement has to be
 * staged. Mutable on purpose: the refresh tests move the slot mid-test.
 */
function setLayout(element: HTMLElement, metrics: Metrics): Metrics {
  Object.defineProperties(element, {
    offsetLeft: { configurable: true, get: () => metrics.left },
    offsetTop: { configurable: true, get: () => metrics.top },
    offsetWidth: { configurable: true, get: () => metrics.width },
    offsetHeight: { configurable: true, get: () => metrics.height },
    offsetParent: { configurable: true, get: () => null },
  })
  element.getBoundingClientRect = () => {
    throw new Error('the dock measurement must read layout boxes, not bounding rects')
  }
  return metrics
}

/** Stages a 1440×900-ish hero: 616px stage laptop, 440px dock slot on the right. */
function stageDockLayout(root: HTMLElement) {
  const shell = setLayout(root.querySelector<HTMLElement>('.story-laptop')!, { left: 412, top: 142, width: 616, height: 616 })
  const slot = setLayout(root.querySelector<HTMLElement>('[data-story-dock-slot]')!, { left: 780, top: 230, width: 440, height: 440 })
  return { shell, slot }
}

function dockValues(vars: Record<string, unknown>) {
  return {
    x: (vars.x as () => number)(),
    y: (vars.y as () => number)(),
    scale: (vars.scale as () => number)(),
  }
}

describe('createStoryTimeline', () => {
  it('creates the pinned reversible sequence and synchronizes DOM state on update', () => {
    const calls: Array<{ method: string; args: unknown[] }> = []
    let config: Record<string, unknown> = {}
    let progress = 0.6
    const timeline = {
      addLabel: (...args: unknown[]) => { calls.push({ method: 'addLabel', args }); return timeline },
      to: (...args: unknown[]) => { calls.push({ method: 'to', args }); return timeline },
      fromTo: (...args: unknown[]) => { calls.push({ method: 'fromTo', args }); return timeline },
      set: (...args: unknown[]) => { calls.push({ method: 'set', args }); return timeline },
      progress: () => progress,
    }
    const gsapApi = { timeline: (options: Record<string, unknown>) => { config = options; return timeline } } as unknown as typeof gsap
    const root = storyRoot()

    expect(createStoryTimeline(gsapApi, root)).toBe(timeline)
    expect(config.scrollTrigger).toEqual(expect.objectContaining({ trigger: root, start: 'top top', end: '+=600%', scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true }))
    expect(calls.filter(({ method }) => method === 'addLabel').map(({ args }) => args[0])).toEqual([
      'claim', 'takeover', 'argument-1', 'argument-2', 'argument-3', 'argument-4', 'handoff', 'bridge', 'question', 'machine-read', 'recommendation', 'release',
    ])
    // The screen becomes the phone: it starts over the laptop screen, rotated
    // landscape, and lands upright at the layout centre. The phone's wrapper is
    // `place-items: center`, so it is placed by x/y from the centre — never by
    // percent offsets (a `-50%` once parked it off the top-left corner).
    const phoneEl = root.querySelector('[data-story-device="phone"]')
    const phoneMove = calls.find(({ method, args }) => method === 'fromTo' && args[0] === phoneEl && 'rotation' in (args[1] as object))
    expect(phoneMove?.args[3]).toBe(STORY_BEATS.argumentEnd)
    expect(phoneMove?.args[1]).toEqual(expect.objectContaining({ rotation: -90 }))
    expect(phoneMove?.args[2]).toEqual(expect.objectContaining({ x: 0, y: 0, scale: 1, rotation: 0 }))
    ;[phoneMove?.args[1], phoneMove?.args[2]].forEach((v) => {
      expect(v).not.toHaveProperty('xPercent')
      expect(v).not.toHaveProperty('yPercent')
    })
    // It lifts off blank: the phone's story fades in only once it is nearly upright.
    const reveal = calls.find(({ method, args }) => method === 'fromTo' && args[0] === root.querySelector('[data-story-mount="phone"]'))
    expect(reveal?.args[1]).toEqual({ opacity: 0 })
    expect(reveal?.args[3]).toBeGreaterThan(STORY_BEATS.argumentEnd + (STORY_BEATS.handoffEnd - STORY_BEATS.argumentEnd) / 2)
    // …while the laptop's screen lifts off underneath it.
    const lift = calls.find(({ method, args }) => method === 'to' && args[0] === root.querySelector('.story-laptop__viewport'))
    expect(lift?.args[1]).toEqual(expect.objectContaining({ opacity: 0 }))
    expect(lift?.args[2]).toBe(STORY_BEATS.argumentEnd)
    // The finale owns its exit: phone + ledger drift up and fade; no blanket fade.
    const phone = root.querySelector('[data-story-device="phone"]')
    const ledger = root.querySelector('[data-story-ledger]')
    const releaseTweens = calls.filter(({ method, args }) => method === 'to' && args[2] === 'release')
    expect(releaseTweens.some(({ args }) => Array.isArray(args[0]) && args[0].includes(phone) && args[0].includes(ledger) && (args[1] as Record<string, unknown>).yPercent === -6)).toBe(true)
    // The laptop sinks away into a faint witness during the handoff.
    const recede = calls.find(({ method, args }) => method === 'to' && args[0] === root.querySelector('[data-story-device="laptop"]') && typeof args[2] === 'number' && args[2] > STORY_BEATS.argumentEnd && args[2] < STORY_BEATS.handoffEnd)
    expect(recede?.args[1]).toEqual(expect.objectContaining({ scale: 0.5, opacity: 0.2 }))
    // No hairline crosses the stage at the handoff any more.
    expect(root.querySelector('[data-story-load-path]')).toBeNull()
    // The masthead is wiped away by the takeover's scan as the live tree renders.
    const mastheadWipe = calls.find(({ method, args }) => method === 'fromTo' && args[0] === root.querySelector('[data-story-masthead]'))
    const mountReveal = calls.find(({ method, args }) => method === 'fromTo' && args[0] === root.querySelector('[data-story-mount="laptop"]'))
    expect(mastheadWipe?.args[2]).toEqual(expect.objectContaining({ clipPath: 'inset(100% 0% 0% 0%)' }))
    expect(mountReveal?.args[2]).toEqual(expect.objectContaining({ clipPath: 'inset(0% 0% 0% 0%)' }))
    // Laptop chapters change by scan wipe (clip-path under a moving line); the
    // phone mount stays state-driven. Four sweeps: the takeover render + three
    // chapter changes, each with its outgoing and incoming clip on the same beat.
    const laptopChapters = root.querySelectorAll('[data-story-mount="laptop"] [data-story-chapter]')
    const scan = root.querySelector('[data-story-scan]')
    const sweeps = calls.filter(({ method, args }) => method === 'fromTo' && args[0] === scan)
    expect(sweeps).toHaveLength(4)
    sweeps.forEach(({ args }) => {
      expect(args[1]).toEqual(expect.objectContaining({ yPercent: 0 }))
      expect(args[2]).toEqual(expect.objectContaining({ yPercent: 100, immediateRender: false }))
    })
    const outgoing = calls.find(({ method, args }) => method === 'fromTo' && args[0] === laptopChapters[0])
    const incoming = calls.find(({ method, args }) => method === 'fromTo' && args[0] === laptopChapters[1])
    expect(outgoing?.args[2]).toEqual(expect.objectContaining({ clipPath: 'inset(100% 0% 0% 0%)' }))
    expect(incoming?.args[1]).toEqual({ clipPath: 'inset(0% 0% 100% 0%)' })
    expect(outgoing?.args[3]).toBe(incoming?.args[3])

    // Sketch → elevation → witness: the shell is docked in an axonometric pose,
    // turns flat during the takeover, and turns back as it recedes.
    const shell = root.querySelector('.story-laptop')
    const shellCalls = calls.filter(({ args }) => args[0] === shell)
    expect(shellCalls[0].method).toBe('set')
    expect(shellCalls[0].args[1]).toEqual(expect.objectContaining({ rotationX: 12, rotationY: -22 }))
    expect(shellCalls.find(({ args }) => args[2] === 'takeover')?.args[1]).toEqual(expect.objectContaining({ rotationX: 0, rotationY: 0 }))
    expect(shellCalls.find(({ args }) => (args[1] as Record<string, unknown>).rotationY === 24)?.args[1]).toEqual(expect.objectContaining({ rotationX: 10 }))
    // The lid folds shut onto the base during the handoff (and re-opens in reverse).
    const fold = calls.find(({ method, args }) => method === 'to' && args[0] === root.querySelector('[data-story-lid]'))
    expect(fold?.args[1]).toEqual(expect.objectContaining({ rotationX: LID_CLOSED }))
    expect(fold?.args[2]).toBeGreaterThanOrEqual(STORY_BEATS.argumentEnd)
    expect(fold?.args[2]).toBeLessThan(STORY_BEATS.handoffEnd)

    ;(config.onUpdate as () => void)()
    expect(root).toHaveAttribute('data-beat', 'handoff')
    expect(root).toHaveAttribute('data-device', 'phone')
    expect(root.style.getPropertyValue('--story-progress')).toBe('0.6')
    // `getStoryState().device` is the single decider for which tree is voiced.
    expect(root.querySelector('[data-story-mount="phone"]')).toHaveAttribute('data-active-mount', 'true')
    expect(root.querySelector('[data-story-mount="laptop"]')).toHaveAttribute('aria-hidden', 'true')
    expect(exposedArticles(root)).toHaveLength(1)
    expect(root.querySelectorAll('[data-story-chapter][aria-hidden="true"][inert]')).toHaveLength(11)
    expect(root.querySelector('.story-invitation')).toHaveAttribute('aria-hidden', 'true')
    expect(root.querySelector('.story-invitation')).toHaveAttribute('inert')

    progress = 0.9
    ;(config.onUpdate as () => void)()
    expect(root).toHaveAttribute('data-beat', 'recommendation')
    expect(root.querySelector('[data-agent-exchange]')).toHaveAttribute('data-phase', 'answer')
    expect(root.querySelectorAll('[data-ledger-row][data-revealed="true"]')).toHaveLength(8)

    progress = 0.8
    ;(config.onUpdate as () => void)()
    expect(root.querySelector('[data-agent-exchange]')).toHaveAttribute('data-phase', 'question')
    expect(root.querySelectorAll('[data-ledger-row][data-revealed="true"]')).toHaveLength(1)

    progress = 0
    ;(config.onUpdate as () => void)()
    expect(root).toHaveAttribute('data-beat', 'claim')
    expect(root.querySelectorAll('[data-ledger-row][data-revealed="true"]')).toHaveLength(0)
    expect(root.querySelector('[data-story-mount="laptop"]')).toHaveAttribute('data-active-mount', 'true')
    expect(exposedArticles(root)).toHaveLength(1)
    expect(root.querySelectorAll('[data-story-chapter][data-active="true"]')).toHaveLength(1)
    expect(root.querySelector('.story-invitation')).not.toHaveAttribute('aria-hidden')
    expect(root.querySelector('.story-invitation')).not.toHaveAttribute('inert')
  })

  it('fails clearly when fixed story markup is missing', () => {
    const root = storyRoot()
    root.querySelector('[data-story-mount="phone"]')?.remove()
    expect(() => createStoryTimeline({} as typeof gsap, root)).toThrow('Immersive story is missing required element: [data-story-mount="phone"]')
  })

  it('fails clearly when the measured dock markup is missing', () => {
    const withoutSlot = storyRoot()
    withoutSlot.querySelector('[data-story-dock-slot]')?.remove()
    expect(() => createStoryTimeline({} as typeof gsap, withoutSlot)).toThrow('Immersive story is missing required element: [data-story-dock-slot]')

    const withoutShell = storyRoot()
    withoutShell.querySelector('.story-laptop')?.remove()
    expect(() => createStoryTimeline({} as typeof gsap, withoutShell)).toThrow('Immersive story is missing required element: [data-story-device="laptop"] .story-laptop')
  })
})

function timelineSpy() {
  const calls: Array<{ method: string; args: unknown[] }> = []
  let config: Record<string, unknown> = {}
  const timeline = {
    addLabel: (...args: unknown[]) => { calls.push({ method: 'addLabel', args }); return timeline },
    to: (...args: unknown[]) => { calls.push({ method: 'to', args }); return timeline },
    fromTo: (...args: unknown[]) => { calls.push({ method: 'fromTo', args }); return timeline },
    set: (...args: unknown[]) => { calls.push({ method: 'set', args }); return timeline },
    progress: () => 0,
  }
  const gsapApi = { timeline: (options: Record<string, unknown>) => { config = options; return timeline } } as unknown as typeof gsap
  return { calls, gsapApi, scrollTrigger: () => config.scrollTrigger as Record<string, unknown> }
}

describe('createStoryTimeline dock', () => {
  it('docks the laptop into the measured grid slot with function-based values', () => {
    const root = storyRoot()
    stageDockLayout(root)
    const { calls, gsapApi } = timelineSpy()

    createStoryTimeline(gsapApi, root)

    const laptop = root.querySelector('[data-story-device="laptop"]')
    const dockTween = calls.find(({ method, args }) => method === 'fromTo' && args[0] === laptop)
    expect(dockTween).toBeDefined()

    // From the dock slot (grid column 2)…
    expect(dockValues(dockTween!.args[1] as Record<string, unknown>)).toEqual({ x: 280, y: 0, scale: 440 / 616 })
    // …to the argument pose: nudged left and scaled to clear the plate lane.
    const pose = dockTween!.args[2] as Record<string, unknown>
    expect(pose).toEqual(expect.objectContaining({ y: 0, scale: ARGUMENT_POSE.scale }))
    expect((pose.x as () => number)()).toBeCloseTo(ARGUMENT_POSE.x * window.innerWidth)
  })

  it('re-measures the dock once per refresh, never per frame', () => {
    const root = storyRoot()
    const { slot } = stageDockLayout(root)
    const { calls, gsapApi, scrollTrigger } = timelineSpy()

    createStoryTimeline(gsapApi, root)
    const laptop = root.querySelector('[data-story-device="laptop"]')
    const from = calls.find(({ method, args }) => method === 'fromTo' && args[0] === laptop)!.args[1] as Record<string, unknown>

    expect(scrollTrigger()).toEqual(expect.objectContaining({ invalidateOnRefresh: true }))
    const measured = dockValues(from)
    expect(dockValues(from)).toEqual(measured)

    // Layout moves, but nothing re-measures until ScrollTrigger says so.
    slot.left = 900
    slot.width = 300
    expect(dockValues(from)).toEqual(measured)

    ;(scrollTrigger().onRefreshInit as () => void)()
    expect(dockValues(from)).toEqual({ x: 330, y: 0, scale: 300 / 616 })
  })
})

describe('refreshOnFontsReady', () => {
  it('refreshes once the webfonts have settled, because the dock slot is font-sized', async () => {
    let refreshes = 0
    const ready = Promise.resolve()

    refreshOnFontsReady({ fonts: { ready } }, () => { refreshes += 1 })
    expect(refreshes).toBe(0)

    await ready
    await Promise.resolve()
    expect(refreshes).toBe(1)
  })

  it('is a no-op where document.fonts is unavailable', () => {
    let refreshes = 0
    expect(() => refreshOnFontsReady({}, () => { refreshes += 1 })).not.toThrow()
    expect(() => refreshOnFontsReady({ fonts: {} }, () => { refreshes += 1 })).not.toThrow()
    expect(refreshes).toBe(0)
  })

  it('does not refresh a torn-down story', async () => {
    let refreshes = 0
    const ready = Promise.resolve()

    refreshOnFontsReady({ fonts: { ready } }, () => { refreshes += 1 })()

    await ready
    await Promise.resolve()
    expect(refreshes).toBe(0)
  })
})

describe('playLidIntro', () => {
  function gsapSpy() {
    const tweens: unknown[][] = []
    return { tweens, api: { fromTo: (...args: unknown[]) => { tweens.push(args) } } as unknown as typeof gsap }
  }

  it('opens the lid from closed, then boots the masthead, when the story starts at the top', () => {
    const root = storyRoot()
    const { tweens, api } = gsapSpy()
    playLidIntro(api, root, 0)
    expect(tweens[0][0]).toBe(root.querySelector('[data-story-lid]'))
    expect(tweens[0][1]).toEqual(expect.objectContaining({ rotationX: LID_CLOSED }))
    expect(tweens[0][2]).toEqual(expect.objectContaining({ rotationX: 0 }))
    // The screen mirrors the hero: asking…, then the wordmark, then the chip.
    const parts = Array.from(root.querySelectorAll('[data-masthead-part]'))
    expect(tweens.slice(1).map((tween) => tween[0])).toEqual(parts)
    expect(tweens.slice(1).map((tween) => (tween[2] as Record<string, unknown>).delay)).toEqual([...MASTHEAD_BEATS])
  })

  it('skips the entrance in a background tab, where it would freeze shut', () => {
    const { tweens, api } = gsapSpy()
    playLidIntro(api, storyRoot(), 0, true)
    expect(tweens).toHaveLength(0)
  })

  it('never replays over a story that loaded mid-scroll', () => {
    const { tweens, api } = gsapSpy()
    playLidIntro(api, storyRoot(), 0.4)
    expect(tweens).toHaveLength(0)
  })
})

describe('plate choreography', () => {
  it('plays one drafted plate per laptop chapter, each inside its own slice', () => {
    const root = storyRoot()
    const { calls, gsapApi } = timelineSpy()
    createStoryTimeline(gsapApi, root)

    const plates = Array.from(root.querySelectorAll<HTMLElement>('[data-story-plate]'))
    expect(plates.map((plate) => plate.dataset.storyPlate)).toEqual(['tension', 'readiness', 'proposals', 'proof'])
    plates.forEach((plate, index) => {
      const fades = calls.filter(({ method, args }) => method === 'to' && args[0] === plate)
      const [enter, exit] = fades.map(({ args }) => args[2] as number)
      const sliceStart = STORY_BEATS.takeoverEnd + 0.1 * index
      // Enters as its chapter's wipe lands, leaves before the next chapter's.
      expect(enter).toBeCloseTo(sliceStart - 0.01)
      expect(exit).toBeLessThan(sliceStart + 0.1)
      expect(exit).toBeGreaterThan(enter)
    })
  })

  it('draws, morphs and assembles the artwork with scrubbed, reversible tweens', () => {
    const root = storyRoot()
    const { calls, gsapApi } = timelineSpy()
    createStoryTimeline(gsapApi, root)

    const vars = calls.map(({ args }) => args[1] as Record<string, unknown>)
    expect(vars.some((v) => v?.drawSVG === '100%')).toBe(true)
    expect(vars.some((v) => typeof v?.morphSVG === 'string')).toBe(true)
    // Initial states are `.set`s — never `from` tweens that would render early.
    expect(calls.some(({ method }) => method === 'from')).toBe(false)
    const stamp = root.querySelector('[data-plate-stamp]')
    expect(calls.find(({ method, args }) => method === 'to' && Array.isArray(args[0]) && args[0].includes(stamp))?.args[1]).toEqual(expect.objectContaining({ rotation: -8, autoAlpha: 1 }))
  })
})

describe('getHandoffOrigin', () => {
  it('centres the phone on the laptop screen as it sits at the end of the argument', () => {
    // 700px shell, 600px phone, 1400px viewport.
    const origin = getHandoffOrigin(700, 600, 1400)
    const k = ARGUMENT_POSE.scale * 1.035
    expect(origin.x).toBeCloseTo(ARGUMENT_POSE.x * 1400 + (0.15927167 + 0.67609 / 2 - 0.5) * 700 * k)
    // The screen sits above the shell's centre.
    expect(origin.y).toBeLessThan(0)
    // Landscape phone's long side matches the screen's width.
    expect(origin.scale * 600).toBeCloseTo(0.67609 * 700 * k)
  })

  it('degrades to scale 1 before the phone has been laid out', () => {
    expect(getHandoffOrigin(700, 0, 1400).scale).toBe(1)
  })
})
