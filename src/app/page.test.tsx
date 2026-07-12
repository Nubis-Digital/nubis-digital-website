import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
})
