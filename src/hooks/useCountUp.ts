'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `target` using ease-out quad.
 * Fires once when `inView` becomes true. Respects prefers-reduced-motion.
 */
export function useCountUp(target: number, duration = 1200, inView = false): number {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef(0)
  const done = useRef(false)

  useEffect(() => {
    if (!inView || done.current) return

    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      done.current = true
      return
    }

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress) // ease-out quad
      setValue(Math.round(target * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        done.current = true
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView, target, duration])

  return value
}

/**
 * Parses a metric string like "3x", "60%", "<200ms" into
 * { prefix, value, suffix } so the counter animates the numeric part only.
 */
export function parseMetricValue(raw: string): { prefix: string; value: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: '', value: 0, suffix: raw }
  return { prefix: match[1], value: parseFloat(match[2]), suffix: match[3] }
}
