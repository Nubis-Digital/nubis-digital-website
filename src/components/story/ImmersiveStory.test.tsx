import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { content } from '@/data/content'
import { storyChapters } from '@/data/story'

import { ImmersiveStory } from './ImmersiveStory'
import { getChapterAccessibility, StoryChapter } from './StoryChapter'

describe('ImmersiveStory', () => {
  it('renders one accessible chapter tree in document order', () => {
    const { container } = render(<ImmersiveStory />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getAllByText(/Chapter \d of 6/)).toHaveLength(6)
    expect(container.querySelectorAll('.story-chapters')).toHaveLength(1)
    expect(screen.getByText(content.story.agent.oversightLabel)).toBeVisible()
    expect(screen.getByText(storyChapters[0].headline).compareDocumentPosition(screen.getByText(storyChapters[5].headline)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('removes inactive enhanced chapters from accessibility and focus', () => {
    const active = render(<StoryChapter chapter={storyChapters[2]} index={2} active enhanced />)
    const activeArticle = active.getByRole('article')
    expect(getChapterAccessibility(true, true)).toEqual({})
    expect(activeArticle).not.toHaveAttribute('aria-hidden')
    expect(activeArticle).not.toHaveAttribute('inert')
    active.unmount()

    const inactive = render(<StoryChapter chapter={storyChapters[2]} index={2} active={false} enhanced />)
    const inactiveArticle = inactive.container.querySelector('article')
    expect(getChapterAccessibility(false, true)).toEqual({ 'aria-hidden': true, inert: true })
    expect(inactiveArticle).toHaveAttribute('aria-hidden', 'true')
    expect(inactiveArticle).toHaveAttribute('inert')
  })
})
