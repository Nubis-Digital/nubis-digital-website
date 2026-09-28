import type { HTMLAttributes } from 'react'

import { storyChapters, type StoryDevice } from '@/data/story'

import { SERVER_EXPOSED_MOUNT } from './storyMotion'
import { silencedAttributes, StoryChapter, type StoryHiddenAttributes } from './StoryChapter'

export interface StoryChapterTreeProps {
  mount: StoryDevice
  activeChapterIndex: number
  enhanced: boolean
}

/**
 * The dual mount ships the same six chapters inside both device shells, so the
 * timeline can hand the story from the laptop to the phone without moving DOM.
 *
 * That means the server-rendered document contains two identical trees, and a
 * screen reader would announce the whole site twice if both were exposed. Only
 * `SERVER_EXPOSED_MOUNT` is readable out of the box; the other ships `inert` +
 * `aria-hidden` (and `display: none` from the base stylesheet, so no-JS
 * visitors never see it either). `setActiveMount` takes over at runtime.
 */
export function getMountAccessibility(mount: StoryDevice): StoryHiddenAttributes {
  return mount === SERVER_EXPOSED_MOUNT ? {} : silencedAttributes()
}

export function StoryChapterTree({ mount, activeChapterIndex, enhanced }: StoryChapterTreeProps) {
  return (
    <ol
      className="story-chapters"
      data-story-mount={mount}
      {...(getMountAccessibility(mount) as HTMLAttributes<HTMLElement>)}
    >
      {storyChapters.map((chapter, index) => (
        <li key={chapter.id} data-story-chapter>
          <StoryChapter chapter={chapter} index={index} active={index === activeChapterIndex} enhanced={enhanced} mount={mount} />
        </li>
      ))}
    </ol>
  )
}
