import { render } from '@testing-library/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { content } from '@/data/content'

import { ImmersiveStory } from './ImmersiveStory'
import { activateFallbackReveal, activateStoryEnhancement, playHeroIntro } from './ImmersiveStoryMotion'

function enhancedRoot() {
  const { container } = render(<ImmersiveStory enhanced />)
  return container.querySelector<HTMLElement>('#immersive-story')!
}

function stubFonts(ready: PromiseLike<unknown>) {
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready } })
}

afterEach(() => {
  Reflect.deleteProperty(document, 'fonts')
  vi.restoreAllMocks()
})

describe('activateStoryEnhancement', () => {
  it('re-measures the dock once the webfonts have settled', async () => {
    const refresh = vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => ScrollTrigger)
    const ready = Promise.resolve()
    stubFonts(ready)

    const teardown = activateStoryEnhancement(enhancedRoot())
    expect(refresh).not.toHaveBeenCalled()

    await ready
    await Promise.resolve()
    expect(refresh).toHaveBeenCalledTimes(1)

    teardown()
  })

  it('does not refresh a story that was torn down before the fonts settled', async () => {
    const refresh = vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => ScrollTrigger)
    const ready = Promise.resolve()
    stubFonts(ready)

    activateStoryEnhancement(enhancedRoot())()

    await ready
    await Promise.resolve()
    expect(refresh).not.toHaveBeenCalled()
  })

  it('enhances normally where document.fonts is unavailable', () => {
    const refresh = vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => ScrollTrigger)
    const root = enhancedRoot()

    expect(() => activateStoryEnhancement(root)()).not.toThrow()
    expect(refresh).not.toHaveBeenCalled()
    expect(root).not.toHaveAttribute('data-enhanced')
  })
})

describe('finale state across enhancement', () => {
  it('starts the finale unread and restores the static panel on teardown, twice over', () => {
    vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => ScrollTrigger)
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!
    const revealed = () => root.querySelectorAll('[data-ledger-row][data-revealed="true"]').length
    const phases = () => Array.from(root.querySelectorAll('[data-agent-exchange]'), (el) => el.getAttribute('data-phase'))

    const teardown = activateStoryEnhancement(root)
    expect(revealed()).toBe(0)
    expect(phases()).toEqual(['question', 'question'])

    teardown()
    teardown()
    expect(revealed()).toBe(root.querySelectorAll('[data-ledger-row]').length)
    expect(phases()).toEqual(['approved', 'approved'])
    expect(root).not.toHaveAttribute('data-beat')
    expect(root.querySelector('[data-story-mount="phone"]')).not.toHaveAttribute('data-active-mount')
  })
})

describe('activateFallbackReveal', () => {
  it('is a no-op without IntersectionObserver, so every chapter stays visible', () => {
    const root = enhancedRoot()
    expect(() => activateFallbackReveal(root)()).not.toThrow()
    expect(root).not.toHaveAttribute('data-reveal')
  })

  it('reveals chapters on enter, marks the rail, and cleans up', () => {
    let callback: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', vi.fn(function (this: unknown, cb: IntersectionObserverCallback) {
      callback = cb
      return { observe: vi.fn(), disconnect }
    }))
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!
    const chapters = root.querySelectorAll<HTMLElement>('[data-story-mount="laptop"] [data-story-chapter]')

    const teardown = activateFallbackReveal(root)
    expect(root).toHaveAttribute('data-reveal', 'on')

    callback([{ isIntersecting: true, target: chapters[2] } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
    expect(chapters[2]).toHaveAttribute('data-revealed', 'true')
    expect(root.querySelectorAll('[data-story-rail-tick][data-current="true"]')).toHaveLength(1)
    expect(root.querySelectorAll('[data-story-rail-tick]')[2]).toHaveAttribute('data-current', 'true')

    teardown()
    expect(disconnect).toHaveBeenCalled()
    expect(root).not.toHaveAttribute('data-reveal')
    expect(root.querySelectorAll('[data-revealed]:not([data-ledger-row])')).toHaveLength(0)
    vi.unstubAllGlobals()
  })
})

describe('hero: The Answer', () => {
  it('keeps the whole question, the headline and the citation readable without the intro', () => {
    const { container } = render(<ImmersiveStory />)
    const hero = container.querySelector<HTMLElement>('.story-invitation')!
    // The typed copy is decoration; the sentence itself is always in the document.
    expect(hero.querySelector('.sr-only')).toHaveTextContent(content.hero.assistantPrompt)
    expect(hero.querySelector('[data-story-query]')).toHaveAttribute('aria-hidden', 'true')
    expect(hero.querySelector('[data-story-query]')).toHaveTextContent(content.hero.assistantPrompt)
    expect(hero.querySelector('h1')).toHaveTextContent(`${content.hero.headlinePart1} ${content.hero.headlineEmphasis}`)
    expect(hero.querySelector('[data-story-citation]')).toHaveTextContent(content.hero.citation)
  })

  it('never plays mid-scroll or in a background tab, leaving everything as rendered', () => {
    const { container } = render(<ImmersiveStory />)
    const root = container.querySelector<HTMLElement>('#immersive-story')!
    const query = root.querySelector('[data-story-query]')!

    playHeroIntro(root, 0.5)()
    expect(query).toHaveTextContent(content.hero.assistantPrompt)

    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    playHeroIntro(root, 0)()
    expect(query).toHaveTextContent(content.hero.assistantPrompt)
    expect(root.querySelector('#story-title')?.children).toHaveLength(1)
    visibility.mockRestore()
  })
})
