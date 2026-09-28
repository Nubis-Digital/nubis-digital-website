import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { content } from '@/data/content'
import { storyLedger } from '@/data/storyLedger'

import { AgentExchange } from './AgentExchange'
import { DimensionLines } from './DimensionLines'
import { ImmersiveStory } from './ImmersiveStory'
import { MachineReadLedger } from './MachineReadLedger'

const revealedCount = (container: HTMLElement) => container.querySelectorAll('[data-ledger-row][data-revealed="true"]').length

describe('MachineReadLedger', () => {
  it.each([[0], [4], [storyLedger.length]])('reveals exactly %i rows', (revealed) => {
    const { container } = render(<MachineReadLedger rows={storyLedger} revealed={revealed} />)
    expect(container.querySelectorAll('[data-ledger-row]')).toHaveLength(storyLedger.length)
    expect(revealedCount(container)).toBe(revealed)
  })

  it('renders field/value rows with read and pending ticks', () => {
    const { container } = render(<MachineReadLedger rows={storyLedger} revealed={storyLedger.length} />)
    expect(container.querySelector('dl')).not.toBeNull()
    expect(container.querySelectorAll('[data-read="pending"]')).toHaveLength(1)
    expect(screen.getByText(content.projects.empty.title)).toBeInTheDocument()
  })
})

describe('DimensionLines', () => {
  const offsets = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>('[data-dimension-line]'), (line) => line.style.transform.replace(/scaleX\((.*)\)/, 'X$1'))

  it('draws no rows at 0, half the rows at mid, every row at 1', () => {
    expect(offsets(render(<DimensionLines rows={4} progress={0} />).container)).toEqual(['X0', 'X0', 'X0', 'X0'])
    expect(offsets(render(<DimensionLines rows={4} progress={0.5} />).container)).toEqual(['X1', 'X1', 'X0', 'X0'])
    expect(offsets(render(<DimensionLines rows={4} progress={1} />).container)).toEqual(['X1', 'X1', 'X1', 'X1'])
  })
})

describe('AgentExchange', () => {
  it.each(['question', 'answer', 'approved'] as const)('keeps the whole exchange readable in the %s phase', (phase) => {
    const { container } = render(<AgentExchange phase={phase} />)
    expect(container.querySelector('[data-agent-exchange]')).toHaveAttribute('data-phase', phase)
    // Phase only paces what the stage shows; assistive tech always gets it all.
    expect(screen.getByText(content.story.agent.visitorNeed)).toBeInTheDocument()
    expect(screen.getByText(content.story.agent.recommendation)).toBeInTheDocument()
    expect(screen.getByText(content.story.agent.oversightLabel)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: content.story.agent.approvalLabel })).toBeDisabled()
  })
})

describe('ImmersiveStory finale markup', () => {
  it('server-renders the machine read as a static, silenced, fully read panel', () => {
    const { container } = render(<ImmersiveStory />)
    const ledger = container.querySelector('[data-story-ledger]')!

    expect(ledger).toHaveAttribute('aria-hidden', 'true')
    expect(ledger.querySelectorAll('[data-ledger-row][data-revealed="true"]')).toHaveLength(storyLedger.length)
    expect(container.querySelector('[data-story-masthead]')).toHaveAttribute('aria-hidden', 'true')
    // The fallback shows the exchange through to approval in both mounts.
    expect(Array.from(container.querySelectorAll('[data-agent-exchange]'), (el) => el.getAttribute('data-phase'))).toEqual(['approved', 'approved'])
  })
})
