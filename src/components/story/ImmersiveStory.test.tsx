import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { content } from '@/data/content'
import { storyChapters } from '@/data/story'

import { ImmersiveStory } from './ImmersiveStory'
import { resetStoryEnhancement } from './ImmersiveStoryMotion'
import { setActiveChapter } from './storyMotion'
import { getChapterAccessibility } from './StoryChapter'

describe('ImmersiveStory', () => {
  it('keeps fallback devices out of flow and overlays the enhanced stage', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')

    expect(css).toMatch(/\.story-device-rail\s*\{[^}]*display:\s*none;/s)
    expect(css).toMatch(/@media \(min-width: 900px\) and \(prefers-reduced-motion: no-preference\)[\s\S]*?\.immersive-story\[data-enhanced="true"\] \.story-stage\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*height:\s*100svh;/)
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-device-rail\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*display:\s*flex;/s)
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-chapters > li\[data-active="true"\] > article/)
  })

  it('renders one accessible chapter tree in document order', () => {
    const { container } = render(<ImmersiveStory />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getAllByText(/Chapter \d of 6/)).toHaveLength(6)
    expect(container.querySelectorAll('.story-chapters')).toHaveLength(1)
    expect(container.querySelectorAll('[data-story-surface]')).toHaveLength(1)
    expect(container.querySelector('[data-story-surface] > .story-chapters')).not.toBeNull()
    expect(screen.getByText(content.story.agent.oversightLabel)).toBeVisible()
    expect(screen.getByText(storyChapters[0].headline).compareDocumentPosition(screen.getByText(storyChapters[5].headline)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText(content.about.stance.byline)).toBeVisible()
    expect(screen.getByText(content.about.story)).toBeVisible()
    expect(screen.getByText(content.projects.intro)).toBeVisible()
    expect(screen.getByText(content.projects.empty.body)).toBeVisible()
    expect(screen.getByText(content.testimonials.empty.body)).toBeVisible()
  })

  it('clips the single live chapter surface to the active device aperture', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    expect(css).toMatch(/\.story-live-surface\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?overflow:\s*hidden;/)
    expect(css).toMatch(/\.story-live-surface\[data-surface-device="phone"\]\s*\{[\s\S]*?width:[\s\S]*?height:/)
    expect(css).not.toMatch(/\.story-chapters > li > article\s*\{[^}]*margin:\s*0 0 0 auto;/s)
  })

  it('keeps every chapter readable and exposed without enhancement', () => {
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector('.immersive-story')
    const articles = Array.from(container.querySelectorAll('article'))

    expect(root).toHaveAttribute('data-enhanced', 'false')
    expect(articles).toHaveLength(storyChapters.length)
    storyChapters.forEach((chapter) => {
      expect(screen.getByRole('heading', { level: 2, name: chapter.headline })).toBeVisible()
      expect(screen.getByText(chapter.body)).toBeVisible()
    })
    articles.forEach((article) => {
      expect(article).not.toHaveAttribute('aria-hidden')
      expect(article).not.toHaveAttribute('inert')
    })
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

  it('uses the runtime chapter-list state as the enhanced visibility contract', () => {
    const { container } = render(<ImmersiveStory enhanced />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!

    storyChapters.forEach((_, index) => {
      setActiveChapter(root, index)
      const activeItems = root.querySelectorAll('li[data-story-chapter][data-active="true"]')
      const visibleArticleTarget = root.querySelector('li[data-story-chapter][data-active="true"] > article')

      expect(activeItems).toHaveLength(1)
      expect(visibleArticleTarget).toBe(root.querySelectorAll('article')[index])
    })
  })

  it('restores progressive content when media eligibility stops matching', () => {
    const { container } = render(<ImmersiveStory enhanced activeChapterIndex={0} />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!
    const chapters = root.querySelectorAll<HTMLElement>('[data-story-chapter]')
    root.dataset.beat = 'laptop'
    root.dataset.device = 'laptop'
    root.style.setProperty('--story-progress', '0.3')
    chapters.forEach((chapter, index) => {
      chapter.dataset.active = String(index === 0)
      chapter.toggleAttribute('inert', index !== 0)
      if (index !== 0) chapter.setAttribute('aria-hidden', 'true')
    })

    resetStoryEnhancement(root)
    resetStoryEnhancement(root)

    expect(root).not.toHaveAttribute('data-enhanced')
    expect(root).not.toHaveAttribute('data-beat')
    expect(root).not.toHaveAttribute('data-device')
    expect(root.style.getPropertyValue('--story-progress')).toBe('')
    expect(root.querySelector('.story-invitation')).not.toHaveAttribute('aria-hidden')
    expect(root.querySelector('.story-invitation')).not.toHaveAttribute('inert')
    chapters.forEach((chapter) => {
      expect(chapter).not.toHaveAttribute('aria-hidden')
      expect(chapter).not.toHaveAttribute('inert')
      expect(chapter).not.toHaveAttribute('data-active')
    })
  })
})
