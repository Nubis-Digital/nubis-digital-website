import { content } from '@/data/content'

/**
 * The docked screen (client ruling, 2026-07-24: a still brand frame at legible
 * size) now mirrors the hero's answer: the assistant has been asked, and the
 * result it returns is the Nubis wordmark, cited. Decorative — the chapter tree
 * underneath carries the words for assistive tech.
 */
export function StoryMasthead() {
  return (
    <div className="story-masthead" data-story-masthead aria-hidden="true">
      <p className="story-masthead__query" data-masthead-part>› Asking an assistant…</p>
      <p className="story-masthead__mark" data-masthead-part>{content.header.logoText}</p>
      <p className="story-masthead__chip" data-masthead-part>✓ Recommended</p>
    </div>
  )
}
