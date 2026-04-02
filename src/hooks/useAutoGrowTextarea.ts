'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const FONT = '14px Inter, ui-sans-serif, system-ui, sans-serif'
const LINE_HEIGHT = 23 // text-sm leading-relaxed ≈ 14px × 1.625
const PADDING_Y = 24  // py-3 × 2 = 12px × 2
const MIN_HEIGHT = 96 // ~4 rows

/**
 * Auto-grows a textarea by measuring text with @chenglou/pretext instead of
 * querying scrollHeight (which forces layout reflow).
 *
 * Returns a ref to attach to the <textarea> and the calculated height (px).
 * Height is null until measurement is ready — callers should fall back to CSS rows.
 */
export function useAutoGrowTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [height, setHeight] = useState<number | null>(null)

  const measure = useCallback(async (text: string) => {
    if (!ref.current) return
    const el = ref.current
    // Subtract horizontal padding (px-4 = 16px each side)
    const textWidth = el.offsetWidth - 32
    if (textWidth <= 0) return

    const { prepare, layout } = await import('@chenglou/pretext')
    // Use pre-wrap so newlines and consecutive spaces are preserved
    const prepared = prepare(text || ' ', FONT, { whiteSpace: 'pre-wrap' })
    const { height: textHeight } = layout(prepared, textWidth, LINE_HEIGHT)
    setHeight(Math.max(textHeight + PADDING_Y, MIN_HEIGHT))
  }, [])

  useEffect(() => {
    measure(value)
  }, [value, measure])

  return { ref, height }
}
