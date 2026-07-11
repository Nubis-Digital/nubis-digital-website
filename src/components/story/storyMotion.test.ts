import { describe, expect, it } from 'vitest'

import { getStoryState, STORY_BEATS } from './storyMotion'

describe('getStoryState', () => {
  it('maps progress boundaries to deterministic beats and chapters', () => {
    expect(getStoryState(STORY_BEATS.invitationEnd - Number.EPSILON).beat).toBe('invitation')
    expect(getStoryState(STORY_BEATS.invitationEnd).beat).toBe('laptop')
    expect(getStoryState(STORY_BEATS.invitationEnd + Number.EPSILON).beat).toBe('laptop')
    expect(getStoryState(STORY_BEATS.laptopEnd - Number.EPSILON).chapterIndex).toBe(3)
    expect(getStoryState(STORY_BEATS.laptopEnd).beat).toBe('handoff')
    expect(getStoryState(STORY_BEATS.laptopEnd + Number.EPSILON).beat).toBe('handoff')
    expect(getStoryState(STORY_BEATS.handoffEnd - Number.EPSILON).beat).toBe('handoff')
    expect(getStoryState(STORY_BEATS.handoffEnd).beat).toBe('phone')
    expect(getStoryState(STORY_BEATS.handoffEnd + Number.EPSILON).beat).toBe('phone')
    expect(getStoryState(STORY_BEATS.phoneEnd - Number.EPSILON).beat).toBe('phone')
    expect(getStoryState(STORY_BEATS.phoneEnd).beat).toBe('release')
    expect(getStoryState(STORY_BEATS.phoneEnd + Number.EPSILON).beat).toBe('release')
    expect(getStoryState(0.80).chapterIndex).toBe(4)
    expect(getStoryState(0.90).chapterIndex).toBe(5)
  })

  it('clamps out-of-range progress', () => {
    expect(getStoryState(-1)).toEqual({ beat: 'invitation', chapterIndex: 0, device: 'laptop', localProgress: 0 })
    expect(getStoryState(2)).toEqual({ beat: 'release', chapterIndex: 5, device: 'phone', localProgress: 1 })
  })

  it('returns the same state for reverse and repeated calls', () => {
    const initialState = getStoryState(0.4)
    getStoryState(0.9)
    expect(getStoryState(0.4)).toEqual(initialState)
  })
})
