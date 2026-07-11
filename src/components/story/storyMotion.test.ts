import { describe, expect, it } from 'vitest'

import { getStoryState } from './storyMotion'

describe('getStoryState', () => {
  it('maps progress boundaries to deterministic beats and chapters', () => {
    expect(getStoryState(0.61).chapterIndex).toBe(3)
    expect(getStoryState(0.62).beat).toBe('handoff')
    expect(getStoryState(0.80).chapterIndex).toBe(4)
    expect(getStoryState(0.90).chapterIndex).toBe(5)
  })

  it('clamps out-of-range progress', () => {
    expect(getStoryState(-1)).toEqual({ beat: 'invitation', chapterIndex: 0, device: 'laptop', localProgress: 0 })
    expect(getStoryState(2)).toEqual({ beat: 'release', chapterIndex: 5, device: 'phone', localProgress: 1 })
  })

  it('returns the same state for reverse and repeated calls', () => {
    getStoryState(0.9)
    expect(getStoryState(0.4)).toEqual(getStoryState(0.4))
  })
})
