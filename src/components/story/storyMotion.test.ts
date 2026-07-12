import { describe, expect, it } from 'vitest'

import type { gsap } from 'gsap'

import { createStoryTimeline, getStoryState, setActiveChapter, setInvitationAccessibility, STORY_BEATS } from './storyMotion'

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
    <section class="story-invitation"></section>
    <div data-story-device="laptop"></div>
    <div data-story-continuity></div>
    <div data-story-device="phone"></div>
    <div data-story-surface data-surface-device="laptop"></div>
    ${Array.from({ length: 6 }, () => '<article data-story-chapter></article>').join('')}
  `
  return root
}

describe('createStoryTimeline', () => {
  it('creates the pinned reversible sequence and synchronizes DOM state on update', () => {
    const calls: Array<{ method: string; args: unknown[] }> = []
    let config: Record<string, unknown> = {}
    let progress = 0.66
    const timeline = {
      addLabel: (...args: unknown[]) => { calls.push({ method: 'addLabel', args }); return timeline },
      to: (...args: unknown[]) => { calls.push({ method: 'to', args }); return timeline },
      fromTo: (...args: unknown[]) => { calls.push({ method: 'fromTo', args }); return timeline },
      progress: () => progress,
    }
    const gsapApi = { timeline: (options: Record<string, unknown>) => { config = options; return timeline } } as unknown as typeof gsap
    const root = storyRoot()

    expect(createStoryTimeline(gsapApi, root)).toBe(timeline)
    expect(config.scrollTrigger).toEqual(expect.objectContaining({ trigger: root, start: 'top top', end: '+=700%', scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true }))
    expect(calls.filter(({ method }) => method === 'addLabel').map(({ args }) => args[0])).toEqual([
      'invitation', 'laptop-1', 'laptop-2', 'laptop-3', 'laptop-4', 'handoff', 'phone-mobile', 'phone-agent', 'release',
    ])
    expect(calls.some(({ method, args }) => method === 'fromTo' && args[0] === root.querySelector('[data-story-device="phone"]') && args[3] === 'handoff')).toBe(true)
    expect(calls.some(({ method, args }) => method === 'to' && args[0] === root.querySelector('[data-story-surface]') && args[2] === 'handoff')).toBe(true)
    expect(calls.some(({ method, args }) => method === 'to' && Array.isArray(args[0]) && args[2] === 'release')).toBe(true)

    ;(config.onUpdate as () => void)()
    expect(root).toHaveAttribute('data-beat', 'handoff')
    expect(root).toHaveAttribute('data-device', 'phone')
    expect(root.querySelector('[data-story-surface]')).toHaveAttribute('data-surface-device', 'phone')
    expect(root.style.getPropertyValue('--story-progress')).toBe('0.66')
    expect(root.querySelectorAll('[data-story-chapter][aria-hidden="true"][inert]')).toHaveLength(5)
    expect(root.querySelector('.story-invitation')).toHaveAttribute('aria-hidden', 'true')
    expect(root.querySelector('.story-invitation')).toHaveAttribute('inert')

    progress = 0
    ;(config.onUpdate as () => void)()
    expect(root).toHaveAttribute('data-beat', 'invitation')
    expect(root.querySelectorAll('[data-story-chapter][data-active="true"]')).toHaveLength(1)
    expect(root.querySelector('.story-invitation')).not.toHaveAttribute('aria-hidden')
    expect(root.querySelector('.story-invitation')).not.toHaveAttribute('inert')
  })

  it('fails clearly when fixed story markup is missing', () => {
    const root = storyRoot()
    root.querySelector('[data-story-continuity]')?.remove()
    expect(() => createStoryTimeline({} as typeof gsap, root)).toThrow('Immersive story is missing required element: [data-story-continuity]')
  })
})
