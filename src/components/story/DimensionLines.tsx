import { getLineProgress } from './storyMotion'

export interface DimensionLinesProps {
  rows: number
  /** The story's `ledgerProgress`; each row's line draws during its own slice. */
  progress: number
}

/**
 * Drafting dimension lines from each ledger row toward the phone, annotating
 * exactly what the assistant read. One 1px cobalt rule per row, drawn from the
 * phone toward the row with `scaleX`, a dot riding its leading edge — the
 * fact travelling into the ledger. Plain boxes, so the hairline stays crisp.
 */
export function DimensionLines({ rows, progress }: DimensionLinesProps) {
  return (
    <div className="story-dimension-lines" aria-hidden="true" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="story-dimension-lines__track" style={{ '--line-progress': getLineProgress(index, rows, progress) } as React.CSSProperties}>
          <span data-dimension-line style={{ transform: `scaleX(${getLineProgress(index, rows, progress)})` }} />
          <span className="story-dimension-lines__dot" />
        </span>
      ))}
    </div>
  )
}
