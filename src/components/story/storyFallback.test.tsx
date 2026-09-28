import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { storyChapters } from '@/data/story'

import { ImmersiveStory } from './ImmersiveStory'

/**
 * The frozen contract.
 *
 * This file exists to be the guardrail for the scroll-narrative rebuild: whatever the
 * enhanced experience becomes, the server-rendered / no-JS / reduced-motion document must
 * keep every chapter readable, exposed, and single-voiced. No phase may leave it red.
 */

/** The single width at which the enhanced experience turns on. */
const STORY_ENHANCED_MIN_WIDTH = 1024

const readSource = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), 'utf8')

/**
 * Exposed = reachable by assistive technology. `closest` includes the element
 * itself, so an element carrying either attribute is hidden, as is anything
 * inside a hidden ancestor — which is how the dual mount silences the tree that
 * is not currently on stage.
 */
const exposed = <T extends Element>(elements: readonly T[]): T[] =>
  elements.filter((element) => !element.closest('[inert]') && !element.closest('[aria-hidden="true"]'))

const articlesIn = (container: HTMLElement) => Array.from(container.querySelectorAll('article'))

describe('immersive story fallback contract', () => {
  it('server-renders exactly one readable, single-voiced chapter tree', () => {
    const { container } = render(<ImmersiveStory />)

    expect(container.querySelector('.immersive-story')).toHaveAttribute('data-enhanced', 'false')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    // The document really is dual-mounted — otherwise the assertions below
    // would be proving the invariant against a document that cannot break it.
    const mounts = container.querySelectorAll('[data-story-mount]')
    expect(mounts.length).toBe(2)
    expect(articlesIn(container)).toHaveLength(mounts.length * storyChapters.length)

    // …and exactly one voice comes out of it. Role queries skip whatever is
    // hidden from the accessibility tree, so a second exposed mount doubles
    // every one of these counts.
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(storyChapters.length)

    storyChapters.forEach((chapter) => {
      const headlines = screen.getAllByRole('heading', { level: 2, name: chapter.headline })
      const bodies = exposed(screen.getAllByText(chapter.body))
      expect(headlines).toHaveLength(1)
      expect(bodies).toHaveLength(1)
      expect(headlines[0]).toBeVisible()
      expect(bodies[0]).toBeVisible()
    })
  })

  it('leaves exactly one chapter tree in the accessibility tree without enhancement', () => {
    const { container } = render(<ImmersiveStory />)
    const exposedArticles = exposed(articlesIn(container))

    expect(exposedArticles).toHaveLength(storyChapters.length)
    expect(new Set(exposedArticles.map((article) => article.closest('[data-story-mount]'))).size).toBe(1)

    // Within the tree that *is* exposed, nothing may be selectively silenced:
    // un-enhanced, every chapter is readable.
    exposedArticles.forEach((article) => {
      expect(article).not.toHaveAttribute('aria-hidden')
      expect(article).not.toHaveAttribute('inert')
    })
  })

  it('ships the second mount inert, hidden, and out of the layout without JS', () => {
    const { container } = render(<ImmersiveStory />)
    const css = readSource('src/app/globals.css')
    const phoneMount = container.querySelector('[data-story-mount="phone"]')
    const enhancedBlockStart = css.indexOf('@media (min-width: 1024px) and (prefers-reduced-motion: no-preference)')

    expect(phoneMount).toHaveAttribute('aria-hidden', 'true')
    expect(phoneMount).toHaveAttribute('inert')

    // Non-empty on purpose. Next's vendored React 19 renderer treats `inert`
    // as a boolean attribute and drops an empty-string value on the server,
    // while the React 18 renderer these tests run on keeps it — so `inert=""`
    // is green here and absent from the shipped HTML.
    expect(phoneMount!.getAttribute('inert')).not.toBe('')

    // The `display: none` has to sit outside the enhanced media query, or a
    // no-JS visitor at ≥1024 gets the second tree laid out under the first.
    expect(enhancedBlockStart).toBeGreaterThan(0)
    expect(css.slice(0, enhancedBlockStart)).toMatch(/\[data-story-mount="phone"\]\s*\{[^}]*display:\s*none;/s)
  })

  it('gives the two mounts distinct ids so labels resolve inside their own tree', () => {
    const { container } = render(<ImmersiveStory />)
    const ids = Array.from(container.querySelectorAll('[id]'), (element) => element.id)

    expect(new Set(ids).size).toBe(ids.length)
    container.querySelectorAll('[aria-labelledby]').forEach((labelled) => {
      const label = container.querySelector(`#${CSS.escape(labelled.getAttribute('aria-labelledby')!)}`)
      expect(label).not.toBeNull()
      expect(labelled.closest('[data-story-mount]')).toBe(label!.closest('[data-story-mount]'))
    })
  })
})

describe('un-enhanced layout contract', () => {
  it('keeps the live chapter tree in flow when the story is not enhanced', () => {
    const css = readSource('src/app/globals.css')

    // The tree lives inside the laptop shell now, so nothing between the document
    // and the chapters may be display:none — or hardware-clipped — outside the
    // enhanced layer. Without JS, at any width, the chapters must still be a
    // plain block of readable text.
    expect(css).not.toMatch(/\.story-device-rail\s*\{[^}]*display:\s*none;/s)
    expect(css).not.toMatch(/^\.story-laptop__viewport\s*\{/m)
    expect(css).not.toMatch(/^\.story-laptop\s*\{[^}]*aspect-ratio:/ms)
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-laptop__viewport\s*\{[^}]*position:\s*absolute;[^}]*left:\s*var\(--story-laptop-x\);/s)
  })

  it('does not voice the decorative hardware over the chapters', () => {
    const { container } = render(<ImmersiveStory />)
    const rail = container.querySelector('.story-device-rail')
    const chapters = container.querySelector('.story-chapters')

    expect(rail).not.toBeNull()
    expect(rail).not.toHaveAttribute('aria-hidden')
    expect(chapters?.closest('[aria-hidden="true"]')).toBeNull()

    // The phone shell now carries a real chapter tree, so the wrapper can no
    // longer be blanket-hidden — the mount itself is what gets silenced, and
    // only the hardware decoration stays out of the accessibility tree.
    expect(container.querySelector('[data-story-device="phone"]')).not.toHaveAttribute('aria-hidden')
    expect(container.querySelector('.story-laptop > .story-laptop__art')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.story-phone__speaker')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('enhanced-experience media gate', () => {
  it('agrees on one breakpoint across CSS and the matchMedia query', () => {
    const css = readSource('src/app/globals.css')
    const motion = readSource('src/components/story/ImmersiveStoryMotion.tsx')

    const enhancedBlock = css.match(/@media \(min-width: (\d+)px\) and \(prefers-reduced-motion: no-preference\)/)
    const fallbackBlock = css.match(/@media \(max-width: (\d+)px\), \(prefers-reduced-motion: reduce\)/)
    const matchMediaQuery = motion.match(/\(min-width: (\d+)px\) and \(prefers-reduced-motion: no-preference\)/)

    expect(enhancedBlock).not.toBeNull()
    expect(fallbackBlock).not.toBeNull()
    expect(matchMediaQuery).not.toBeNull()

    const enhancedMin = Number(enhancedBlock![1])
    const fallbackMax = Number(fallbackBlock![1])
    const runtimeMin = Number(matchMediaQuery![1])

    expect(enhancedMin).toBe(STORY_ENHANCED_MIN_WIDTH)
    expect(runtimeMin).toBe(STORY_ENHANCED_MIN_WIDTH)
    expect(fallbackMax).toBe(STORY_ENHANCED_MIN_WIDTH - 1)
  })
})
