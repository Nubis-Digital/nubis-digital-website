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
