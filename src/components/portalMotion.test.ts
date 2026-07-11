import { describe, expect, it } from 'vitest'
import { gsap } from 'gsap'
import {
  activatePortalTimeline,
  buildPortalSteps,
  createPortalTimeline,
  shouldEnablePortalMotion,
} from './portalMotion'

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

it('removes the chassis only after the portal has expanded', () => {
  expect(buildPortalSteps()).toEqual([
    { at: 0, target: 'shell', vars: { scale: 10.5, duration: 0.68 } },
    { at: 0, target: 'cue', vars: { opacity: 0, duration: 0.12 } },
    { at: 0.5, target: 'aperture', vars: { rotateX: 0, rotateY: 0, duration: 0.18 } },
    { at: 0.66, target: 'laptop', vars: { opacity: 0, duration: 0.06 } },
    { at: 0.68, target: 'surface', vars: { scale: 1, duration: 0.2 } },
  ])
})

it('records the portal choreography and scroll state contract', () => {
  const hero = document.createElement('section')
  const shell = document.createElement('div')
  const laptop = document.createElement('div')
  const aperture = document.createElement('div')
  const surface = document.createElement('div')
  const cue = document.createElement('div')
  const calls: Array<{ target: HTMLElement; vars: object; at: number }> = []
  let options: Record<string, unknown> = {}
  const timeline = {
    to(target: HTMLElement, vars: object, at: number) {
      calls.push({ target, vars, at })
      return this
    },
  }
  const recordingGsap = {
    timeline(received: Record<string, unknown>) {
      options = received
      return timeline
    },
  } as unknown as typeof gsap

  createPortalTimeline(recordingGsap, { hero, shell, laptop, aperture, surface, cue })

  expect(options).toMatchObject({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: hero, end: '+=300%', scrub: 0.6, pin: true },
  })
  expect(calls).toEqual([
    { target: shell, vars: { scale: 10.5, duration: 0.68, ease: 'power2.inOut' }, at: 0 },
    { target: cue, vars: { opacity: 0, duration: 0.12, ease: 'power2.in' }, at: 0 },
    { target: aperture, vars: { rotateX: 0, rotateY: 0, duration: 0.18 }, at: 0.5 },
    { target: laptop, vars: { opacity: 0, duration: 0.06 }, at: 0.66 },
    { target: surface, vars: { scale: 1, duration: 0.2, ease: 'power2.out' }, at: 0.68 },
  ])
  const scrollTrigger = options.scrollTrigger as {
    onLeave: () => void
    onEnterBack: () => void
  }
  scrollTrigger.onLeave()
  expect(shell.dataset.portalState).toBe('page')
  scrollTrigger.onEnterBack()
  expect(shell.dataset.portalState).toBe('screen')
})

it('restores portal classes, state, and inline animation properties on cleanup', () => {
  const hero = document.createElement('section')
  const shell = document.createElement('div')
  const laptop = document.createElement('div')
  const aperture = document.createElement('div')
  const surface = document.createElement('div')
  const cue = document.createElement('div')
  const sets: Array<{ target: unknown; vars: object }> = []
  const timeline = { to: () => timeline }
  const recordingGsap = {
    set(target: unknown, vars: object) {
      sets.push({ target, vars })
    },
    timeline: () => timeline,
  } as unknown as typeof gsap

  const cleanup = activatePortalTimeline(recordingGsap, {
    hero,
    shell,
    laptop,
    aperture,
    surface,
    cue,
  })
  expect(hero).toHaveClass('hero--portal-active')
  cleanup()

  expect(hero).not.toHaveClass('hero--portal-active')
  expect(shell.dataset.portalState).toBe('screen')
  expect(sets.at(-2)).toEqual({
    target: [shell, laptop, aperture, surface],
    vars: { clearProps: 'all' },
  })
  expect(sets.at(-1)).toEqual({ target: cue, vars: { clearProps: 'opacity' } })
})
