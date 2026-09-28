import type { LedgerRow } from '@/data/storyLedger'

export interface MachineReadLedgerProps {
  rows: readonly LedgerRow[]
  /** How many rows the machine has read; the rest render drafted-but-unread. */
  revealed: number
}

/**
 * The finale's machine read: the site as an assistant extracts it, set as a
 * title-block ledger of hairline field/value rows with check ticks. It is
 * `aria-hidden` wherever it renders — a visualisation of content already
 * voiced by the chapters — so the accessibility tree stays single-voiced.
 */
export function MachineReadLedger({ rows, revealed }: MachineReadLedgerProps) {
  return (
    <dl className="story-ledger__rows">
      {rows.map((row, index) => (
        <div key={row.field} className="story-ledger__row" data-ledger-row data-read={row.read} data-revealed={String(index < revealed)}>
          <dt>{row.field}</dt>
          <dd>{row.value}</dd>
          <span className="story-ledger__tick">{row.read === 'true' ? '✓ read' : '… pending'}</span>
        </div>
      ))}
    </dl>
  )
}
