import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { content } from '@/data/content'

import HomePage from './page'

vi.mock('@/components/LoadPathSpine', () => ({ default: () => <div data-testid="load-path-spine" /> }))
vi.mock('@/components/MotionLayer', () => ({ default: () => <div data-testid="motion-layer" /> }))
vi.mock('@/components/story/ImmersiveStoryMotion', () => ({
  ImmersiveStoryMotion: () => <div data-testid="story-motion" />,
  resetStoryEnhancement: vi.fn(),
}))

describe('HomePage', () => {
  beforeEach(() => window.localStorage.clear())

  it('composes the story, contact, and global furniture exactly once in order', async () => {
    const { container } = render(<HomePage />)

    await waitFor(() => expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeVisible())

    const main = container.querySelector<HTMLElement>('main#main')
    const story = container.querySelector<HTMLElement>('#immersive-story')
    const contact = container.querySelector<HTMLElement>('#contact')
    const footer = container.querySelector<HTMLElement>('footer.site-footer')

    expect(container.querySelectorAll('main#main')).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.querySelectorAll('[data-story-chapter]')).toHaveLength(6)
    expect(container.querySelectorAll('#contact')).toHaveLength(1)
    expect(container.querySelectorAll('footer.site-footer')).toHaveLength(1)
    expect(screen.getAllByRole('region', { name: 'Cookie consent' })).toHaveLength(1)
    expect(main).toContainElement(story)
    expect(main).toContainElement(contact)
    expect(story!.compareDocumentPosition(contact!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(main!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('keeps the keyboard sequence unique and ordered across page regions', async () => {
    const user = userEvent.setup()
    const { container } = render(<HomePage />)

    await waitFor(() => expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeVisible())

    const header = container.querySelector<HTMLElement>('header')!
    const story = container.querySelector<HTMLElement>('#immersive-story')!
    const contact = container.querySelector<HTMLElement>('#contact')!
    const footer = container.querySelector<HTMLElement>('footer.site-footer')!
    const selector = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const pageFocusables = Array.from(container.querySelectorAll<HTMLElement>(selector))
    const headerControls = pageFocusables.filter((element) => header.contains(element))
    const storyControls = pageFocusables.filter((element) => story.contains(element))
    const contactControls = pageFocusables.filter((element) => contact.contains(element))
    const footerControls = pageFocusables.filter((element) => footer.contains(element))
    const storyCta = screen.getByRole('link', { name: content.services.foundation.cta }) as HTMLAnchorElement
    const firstContactControl = screen.getByRole('textbox', { name: 'Name' })
    const firstFooterControl = footerControls[0]

    expect(headerControls.length).toBeGreaterThan(0)
    expect(storyControls).toEqual([storyCta])
    expect(storyCta).toHaveAttribute('href', content.services.foundation.ctaUrl)
    expect(document.getElementById(storyCta.hash.slice(1))).toBe(contact)
    expect(contactControls.length).toBeGreaterThan(0)
    expect(footerControls.length).toBeGreaterThan(0)
    expect(new Set(pageFocusables).size).toBe(pageFocusables.length)
    expect(Math.max(...headerControls.map((element) => pageFocusables.indexOf(element))))
      .toBeLessThan(pageFocusables.indexOf(storyCta))
    expect(pageFocusables.indexOf(storyCta)).toBeLessThan(pageFocusables.indexOf(firstContactControl))
    expect(Math.max(...contactControls.map((element) => pageFocusables.indexOf(element))))
      .toBeLessThan(Math.min(...footerControls.map((element) => pageFocusables.indexOf(element))))

    const tabSequence: HTMLElement[] = []
    for (let index = 0; index < pageFocusables.length; index += 1) {
      await user.tab()
      tabSequence.push(document.activeElement as HTMLElement)
    }

    expect(tabSequence).toContain(headerControls[0])
    expect(tabSequence.indexOf(headerControls.at(-1)!)).toBeLessThan(tabSequence.indexOf(storyCta))
    expect(tabSequence.indexOf(storyCta)).toBeLessThan(tabSequence.indexOf(firstContactControl))
    expect(tabSequence.indexOf(firstContactControl)).toBeLessThan(tabSequence.indexOf(firstFooterControl))
  })
})
