'use client'

import { useEffect, useState } from 'react'

export interface TextMeasureResult {
  height: number
  lineCount: number
  ready: boolean
}

/**
 * Measures text dimensions using @chenglou/pretext (canvas-based, no DOM reflow).
 *
 * @param text       - The full string to measure
 * @param font       - CSS font shorthand, e.g. '14px Inter, ui-sans-serif, sans-serif'
 * @param maxWidth   - Available width in pixels (0 = skip measurement)
 * @param lineHeight - Line height in pixels
 * @param preWrap    - Set true for textarea-like text that preserves whitespace/newlines
 */
export function useTextMeasure(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  preWrap = false,
): TextMeasureResult {
  const [result, setResult] = useState<TextMeasureResult>({
    height: lineHeight,
    lineCount: 1,
    ready: false,
  })

  useEffect(() => {
    if (!text || maxWidth <= 0) return

    let cancelled = false

    import('@chenglou/pretext').then(({ prepare, layout }) => {
      if (cancelled) return
      const prepared = prepare(text, font, preWrap ? { whiteSpace: 'pre-wrap' } : undefined)
      const measured = layout(prepared, maxWidth, lineHeight)
      setResult({ height: measured.height, lineCount: measured.lineCount, ready: true })
    })

    return () => { cancelled = true }
  }, [text, font, maxWidth, lineHeight, preWrap])

  return result
}
