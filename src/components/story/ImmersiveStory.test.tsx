import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { content } from '@/data/content'
import { storyChapters } from '@/data/story'

import { ImmersiveStory } from './ImmersiveStory'
import { resetStoryEnhancement } from './ImmersiveStoryMotion'
import { setActiveChapter, setActiveMount, setInvitationAccessibility } from './storyMotion'
import { getChapterAccessibility } from './StoryChapter'

/** Reachable by assistive technology: not hidden, and inside nothing hidden. */
const exposed = <T extends Element>(elements: readonly T[]): T[] =>
  elements.filter((element) => !element.closest('[inert]') && !element.closest('[aria-hidden="true"]'))

const exposedArticles = (root: ParentNode) => exposed(Array.from(root.querySelectorAll('article')))

describe('ImmersiveStory', () => {
  it('lays the enhanced hero out as one grid with a measured dock slot', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    const { container } = render(<ImmersiveStory enhanced />)

    // Hardware, load path, masthead and dimension lines are stage-only decoration.
    expect(css).toMatch(/\.story-device-rail > \[data-story-device="phone"\],\s*\.story-masthead,\s*\.story-rail,\s*\.story-dimension-lines,\s*\.story-blueprint,\s*\.story-scan,\s*\.story-screen-progress,\s*\.story-plates\s*\{[^}]*display:\s*none;/s)
    expect(css).not.toMatch(/story-continuity/)
    // The pin spacer supplies the scroll distance; a taller root scrolls past as
    // a blank screen of ink after the pin releases.
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\]\s*\{[^}]*height:\s*100svh;/)
    expect(css).not.toMatch(/\.immersive-story\[data-enhanced="true"\]\s*\{[^}]*min-height:\s*\d{3}vh/)
    expect(css).toMatch(/@media \(min-width: 1024px\) and \(prefers-reduced-motion: no-preference\)[\s\S]*?\.immersive-story\[data-enhanced="true"\] \.story-stage\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*height:\s*100svh;/)
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-device-rail\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*73px 0 0;[^}]*display:\s*flex;/s)
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-chapters > li\[data-active="true"\] > article/)

    // One coordinate system for the hero: copy in column 1, dock slot in column 2.
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-invitation\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(30ch, 42rem\) minmax\(0, 1fr\);/s)
    expect(css).toMatch(/\[data-story-dock-slot\]\s*\{[^}]*grid-column:\s*2;[^}]*aspect-ratio:\s*1;/s)
    expect(css).not.toMatch(/padding-right:\s*52vw/)

    // The dock slot is layout-only: measured, never painted, never voiced.
    const dockSlots = container.querySelectorAll('[data-story-dock-slot]')
    expect(dockSlots).toHaveLength(1)
    expect(dockSlots[0]).toHaveAttribute('aria-hidden', 'true')
    expect(dockSlots[0].children).toHaveLength(0)
    expect(dockSlots[0].textContent).toBe('')
  })

  it('positions the device layer by transform, never by viewport percentages', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')

    expect(css).not.toMatch(/left:\s*72%/)
    expect(css).not.toMatch(/width:\s*min\(78vw, 600px\)/)
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-device-rail > \[data-story-device\]\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*display:\s*grid;[^}]*place-items:\s*center;/s)
    expect(css).not.toMatch(/\.immersive-story\[data-enhanced="true"\] \.story-laptop > img\s*\{[^}]*filter:/s)
  })

  it('keeps the dock slot and the device stage in one measurable coordinate space', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    const motion = readFileSync(resolve(process.cwd(), 'src/components/story/storyMotion.ts'), 'utf8')

    // The stage is `position: absolute; inset: 0`. Without a positioned root it
    // resolves against the initial containing block while unpinned and against
    // the root once pinned — two different origins, so the measured dock delta
    // would be off by the header height until the pin engaged.
    expect(css).toMatch(/\.immersive-story\[data-enhanced="true"\]\s*\{[^}]*position:\s*relative;/s)

    // Bounding rects already contain the transform being computed; measuring
    // one would make the dock drift on every refresh.
    expect(motion).not.toMatch(/getBoundingClientRect/)
    expect(motion).toMatch(/readLayoutBox/)
  })

  it('mounts a chapter tree in each device shell but voices only one', () => {
    const { container } = render(<ImmersiveStory />)
    const mounts = container.querySelectorAll('.story-chapters')

    expect(Array.from(mounts, (mount) => mount.getAttribute('data-story-mount'))).toEqual(['laptop', 'phone'])
    expect(container.querySelector('.story-laptop__viewport > .story-chapters[data-story-mount="laptop"]')).not.toBeNull()
    expect(container.querySelector('.story-phone__viewport > .story-chapters[data-story-mount="phone"]')).not.toBeNull()

    // Both trees are in the DOM; exactly one is in the accessibility tree.
    expect(container.querySelectorAll('article')).toHaveLength(12)
    expect(screen.getAllByText(/^Chapter \d of 6$/)).toHaveLength(12)
    expect(exposedArticles(container)).toHaveLength(6)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    // Document order and copy still read once through, in the exposed tree.
    const [oversight, ...oversightDuplicates] = exposed(screen.getAllByText(content.story.agent.oversightLabel))
    const [firstHeadline] = exposed(screen.getAllByText(storyChapters[0].headline))
    const [lastHeadline] = exposed(screen.getAllByText(storyChapters[5].headline))
    expect(oversightDuplicates).toHaveLength(0)
    expect(oversight).toBeVisible()
    expect(firstHeadline.compareDocumentPosition(lastHeadline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    ;[content.about.stance.byline, content.about.story, content.projects.intro, content.projects.empty.body, content.testimonials.empty.body].forEach((copy) => {
      const [visible, ...duplicates] = exposed(screen.getAllByText(copy))
      expect(duplicates).toHaveLength(0)
      expect(visible).toBeVisible()
    })
  })

  it('mounts the live chapter tree inside the shell aperture, with no second copy of the geometry', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    const motion = readFileSync(resolve(process.cwd(), 'src/components/story/storyMotion.ts'), 'utf8')
    const enhancement = readFileSync(resolve(process.cwd(), 'src/components/story/ImmersiveStoryMotion.tsx'), 'utf8')
    const { container } = render(<ImmersiveStory enhanced />)

    // The duplicated aperture math is gone — the shell's own vars are the only truth.
    expect(css).not.toMatch(/0\.34072833/)
    expect(css).not.toMatch(/0\.28751667/)
    expect(css).not.toMatch(/--story-laptop-size/)
    expect(css).not.toMatch(/--story-phone-size/)
    expect(css).toMatch(/\.story-laptop\s*\{[^}]*--story-laptop-x:[^}]*--story-laptop-y:[^}]*--story-laptop-w:[^}]*--story-laptop-h:/s)

    // Scrubbed motion and CSS transitions fight; the timeline owns surface motion.
    expect(css).not.toMatch(/\.story-chapters > li > article\s*\{[^}]*transition:/s)

    // The synced sibling surface is gone entirely — each mount is the surface.
    expect(css).not.toMatch(/story-live-surface/)
    expect(motion).not.toMatch(/story-surface/)
    expect(container.querySelector('[data-story-surface]')).toBeNull()

    // The device-flavour plumbing that kept the sibling surface in sync is gone.
    expect(css).not.toMatch(/data-surface-device/)
    expect(motion).not.toMatch(/surfaceDevice/)
    expect(enhancement).not.toMatch(/surfaceDevice|data-surface-device/)

    // The tree is a child of the shell, not a synced sibling of it.
    expect(container.querySelector('.story-laptop__viewport .story-chapters')).not.toBeNull()
  })

  it('keeps every chapter readable and exposed without enhancement', () => {
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector('.immersive-story')
    const readable = exposedArticles(container)

    expect(root).toHaveAttribute('data-enhanced', 'false')
    expect(readable).toHaveLength(storyChapters.length)
    storyChapters.forEach((chapter) => {
      expect(screen.getByRole('heading', { level: 2, name: chapter.headline })).toBeVisible()
      expect(exposed(screen.getAllByText(chapter.body))).toHaveLength(1)
    })
    readable.forEach((article) => {
      expect(article).not.toHaveAttribute('aria-hidden')
      expect(article).not.toHaveAttribute('inert')
    })
  })

  it('exposes exactly one enhanced chapter, in the mounted-on-stage tree', () => {
    const { container } = render(<ImmersiveStory enhanced activeChapterIndex={2} />)
    const laptopChapters = container.querySelectorAll('[data-story-mount="laptop"] article')
    const [activeArticle, ...alsoExposed] = exposedArticles(container)

    expect(container.querySelector('.immersive-story')).toHaveAttribute('data-enhanced', 'true')
    expect(getChapterAccessibility(true, true)).toEqual({})
    // `inert: ''` would vanish in Next's server renderer — see StoryChapter.
    expect(getChapterAccessibility(false, true)).toEqual({ 'aria-hidden': true, inert: 'inert' })

    // Not "index 2 of the articles" — index 2 of the tree that is on stage.
    expect(alsoExposed).toHaveLength(0)
    expect(activeArticle).toBe(laptopChapters[2])
    expect(activeArticle).not.toHaveAttribute('aria-hidden')
    expect(activeArticle).not.toHaveAttribute('inert')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
  })

  it('uses the runtime mount and chapter state as the enhanced visibility contract', () => {
    // Server-rendered shape on purpose: the runtime gates always run against a
    // document that was rendered un-enhanced, which is what page.tsx ships.
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!

    ;(['laptop', 'phone'] as const).forEach((device) => {
      storyChapters.forEach((_, index) => {
        setActiveMount(root, device)
        setActiveChapter(root, index)

        const [visible, ...duplicates] = exposedArticles(root)
        expect(duplicates).toHaveLength(0)
        expect(visible).toBe(root.querySelectorAll(`[data-story-mount="${device}"] article`)[index])
        expect(root.querySelectorAll('li[data-story-chapter][data-active="true"]')).toHaveLength(1)
        expect(root.querySelector('li[data-story-chapter][data-active="true"] > article')).toBe(visible)
      })
    })
  })

  it('restores progressive content when media eligibility stops matching', () => {
    // Server-rendered document, enhanced at runtime — the exact sequence the
    // media-query teardown has to undo.
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!
    const chapters = root.querySelectorAll<HTMLElement>('[data-story-chapter]')
    root.dataset.enhanced = 'true'
    root.dataset.beat = 'phone'
    root.dataset.device = 'phone'
    root.style.setProperty('--story-progress', '0.8')
    setInvitationAccessibility(root, false)
    setActiveMount(root, 'phone')
    setActiveChapter(root, 5)

    resetStoryEnhancement(root)
    resetStoryEnhancement(root)

    // Back to the server-rendered shape: the laptop tree readable, the phone
    // tree inert and hidden, and no runtime mount state left behind.
    expect(exposedArticles(root)).toHaveLength(storyChapters.length)
    expect(root.querySelector('[data-story-mount="laptop"]')).not.toHaveAttribute('aria-hidden')
    expect(root.querySelector('[data-story-mount="laptop"]')).not.toHaveAttribute('inert')
    expect(root.querySelector('[data-story-mount="phone"]')).toHaveAttribute('aria-hidden', 'true')
    expect(root.querySelector('[data-story-mount="phone"]')).toHaveAttribute('inert')
    root.querySelectorAll('[data-story-mount]').forEach((mount) => expect(mount).not.toHaveAttribute('data-active-mount'))

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
