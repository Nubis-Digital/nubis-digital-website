'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

interface Props {
  text: string
  className?: string
  /** Wrapping element — default 'span' so it can live inside any heading */
  as?: ElementType
  /** Base delay before the first character animates (ms) */
  delay?: number
  /** Delay between each character (ms) */
  stagger?: number
}

/**
 * Splits text into individual character spans and cascades them in on scroll.
 * Render inside a semantic heading for proper document structure:
 *   <h2 className="font-serif ..."><CharReveal text={headline} /></h2>
 */
export default function CharReveal({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
  stagger = 8,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {[...text].map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block"
          style={{
            transitionProperty: 'opacity, transform',
            transitionDuration: '400ms',
            transitionTimingFunction: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
            transitionDelay: `${delay + i * stagger}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  )
}
