import { storyChapters } from '@/data/story'

/**
 * The fallback path's sticky progress rail: one mono tick per chapter, the
 * current one marked by `activateFallbackReveal`. Decorative — each chapter
 * already states "Chapter n of 6" in its own text.
 */
export function StoryRail() {
  return (
    <ol className="story-rail" aria-hidden="true">
      {storyChapters.map((chapter, index) => (
        <li key={chapter.id} data-story-rail-tick>{String(index + 1).padStart(2, '0')}</li>
      ))}
    </ol>
  )
}
