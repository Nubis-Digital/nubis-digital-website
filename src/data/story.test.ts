import { describe, expect, it } from 'vitest'

import { storyChapters } from './story'

describe('storyChapters', () => {
  it('defines the narrative in device order', () => {
    expect(storyChapters.map(({ id }) => id)).toEqual(['tension', 'readiness', 'proposals', 'proof', 'mobile', 'agent'])
    expect(storyChapters.map(({ device }) => device)).toEqual(['laptop', 'laptop', 'laptop', 'laptop', 'phone', 'phone'])
  })
})
