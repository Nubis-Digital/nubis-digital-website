import { describe, expect, it } from 'vitest'
import { buildPortalSteps, shouldEnablePortalMotion } from './portalMotion'

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
