import type { StoryDevice } from '@/data/story'

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
