import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { content } from '@/data/content'
import { storyChapters } from '@/data/story'

import { ImmersiveStory } from './ImmersiveStory'
import { getChapterAccessibility } from './StoryChapter'

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
    const { container } = render(<ImmersiveStory enhanced activeChapterIndex={2} />)
    const articles = container.querySelectorAll('article')
    const activeArticle = articles[2]

    expect(container.querySelector('.immersive-story')).toHaveAttribute('data-enhanced', 'true')
    expect(getChapterAccessibility(true, true)).toEqual({})
    expect(activeArticle).not.toHaveAttribute('aria-hidden')
    expect(activeArticle).not.toHaveAttribute('inert')
    expect(getChapterAccessibility(false, true)).toEqual({ 'aria-hidden': true, inert: '' })

    Array.from(articles).forEach((article, index) => {
      if (index === 2) return
      expect(article).toHaveAttribute('aria-hidden', 'true')
      expect(article).toHaveAttribute('inert', '')
    })
  })
})
