import type { StoryDevice } from '@/data/story'
import type { gsap } from 'gsap'

export type StoryBeat = 'invitation' | 'laptop' | 'handoff' | 'phone' | 'release'
export interface StoryState { beat: StoryBeat; chapterIndex: number; device: StoryDevice; localProgress: number }

export const STORY_BEATS = {
  invitationEnd: 0.10,
  laptopEnd: 0.62,
  handoffEnd: 0.72,
  phoneEnd: 0.94,
} as const

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function getStoryState(rawProgress: number): StoryState {
  const progress = clamp01(rawProgress)
  if (progress < STORY_BEATS.invitationEnd) return { beat: 'invitation', chapterIndex: 0, device: 'laptop', localProgress: progress / STORY_BEATS.invitationEnd }
  if (progress < STORY_BEATS.laptopEnd) {
    const local = (progress - STORY_BEATS.invitationEnd) / (STORY_BEATS.laptopEnd - STORY_BEATS.invitationEnd)
    return { beat: 'laptop', chapterIndex: Math.min(3, Math.floor(local * 4)), device: 'laptop', localProgress: local }
  }
  if (progress < STORY_BEATS.handoffEnd) return { beat: 'handoff', chapterIndex: 4, device: 'phone', localProgress: (progress - STORY_BEATS.laptopEnd) / (STORY_BEATS.handoffEnd - STORY_BEATS.laptopEnd) }
  if (progress < STORY_BEATS.phoneEnd) {
    const local = (progress - STORY_BEATS.handoffEnd) / (STORY_BEATS.phoneEnd - STORY_BEATS.handoffEnd)
    return { beat: 'phone', chapterIndex: local < 0.5 ? 4 : 5, device: 'phone', localProgress: local }
  }
  return { beat: 'release', chapterIndex: 5, device: 'phone', localProgress: (progress - STORY_BEATS.phoneEnd) / (1 - STORY_BEATS.phoneEnd) }
}

export function setActiveChapter(root: HTMLElement, activeIndex: number): void {
  root.querySelectorAll<HTMLElement>('[data-story-chapter]').forEach((chapter, index) => {
    const active = index === activeIndex
    chapter.toggleAttribute('inert', !active)
    if (active) chapter.removeAttribute('aria-hidden')
    else chapter.setAttribute('aria-hidden', 'true')
    chapter.dataset.active = String(active)
  })
}

export function setInvitationAccessibility(root: HTMLElement, visible: boolean): void {
  const invitation = requireStoryElement(root, '.story-invitation')
  invitation.toggleAttribute('inert', !visible)
  if (visible) invitation.removeAttribute('aria-hidden')
  else invitation.setAttribute('aria-hidden', 'true')
}

function requireStoryElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector)
  if (!element) throw new Error(`Immersive story is missing required element: ${selector}`)
  return element
}

export function createStoryTimeline(gsapApi: typeof gsap, root: HTMLElement): gsap.core.Timeline {
  const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-story-chapter]'))
  if (chapters.length !== 6) throw new Error(`Immersive story requires 6 chapters; found ${chapters.length}`)
  const laptop = requireStoryElement(root, '[data-story-device="laptop"]')
  const phone = requireStoryElement(root, '[data-story-device="phone"]')
  const invitation = requireStoryElement(root, '.story-invitation')
  const continuity = requireStoryElement(root, '[data-story-continuity]')
  const surface = requireStoryElement(root, '[data-story-surface]')

  const timeline = gsapApi.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: '+=700%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    onUpdate() {
      const state = getStoryState(timeline.progress())
      setActiveChapter(root, state.chapterIndex)
      setInvitationAccessibility(root, state.beat === 'invitation')
      root.dataset.beat = state.beat
      root.dataset.device = state.device
      surface.dataset.surfaceDevice = state.device
      root.style.setProperty('--story-progress', String(timeline.progress()))
    },
  })

  timeline
    .addLabel('invitation', 0)
    .to(invitation, { opacity: 0, yPercent: -12, duration: 0.1 }, 'invitation')
    .addLabel('laptop-1', 0.1)
    .fromTo(laptop, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.12 }, 'laptop-1')

  ;[0.23, 0.36, 0.49].forEach((position, index) => {
    timeline
      .addLabel(`laptop-${index + 2}`, position)
      .to(chapters[index], { opacity: 0, yPercent: -8, duration: 0.08 }, position)
      .fromTo(chapters[index + 1], { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.08 }, position)
  })

  timeline
    .addLabel('handoff', 0.62)
    .to(laptop, { scale: 0.76, xPercent: -20, opacity: 0.45, duration: 0.1 }, 'handoff')
    .to(surface, { opacity: 1, duration: 0.1 }, 'handoff')
    .fromTo(phone, { scale: 0.78, xPercent: -26, yPercent: -50, opacity: 0 }, { scale: 1, xPercent: -50, yPercent: -50, opacity: 1, duration: 0.1 }, 'handoff')
    .fromTo(continuity, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.1 }, 'handoff')
    .addLabel('phone-mobile', 0.72)
    .to(chapters[3], { opacity: 0, yPercent: -8, duration: 0.08 }, 'phone-mobile')
    .fromTo(chapters[4], { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.08 }, 'phone-mobile')
    .addLabel('phone-agent', 0.83)
    .to(chapters[4], { opacity: 0, yPercent: -8, duration: 0.08 }, 'phone-agent')
    .fromTo(chapters[5], { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.08 }, 'phone-agent')
    .addLabel('release', 0.94)
    .to([laptop, phone, continuity, surface], { opacity: 0, yPercent: -6, duration: 0.06 }, 'release')

  return timeline
}
