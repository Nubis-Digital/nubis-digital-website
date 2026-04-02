'use client'

import { useRef, type ElementType } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
 * Splits text into individual character spans and cascades them in on scroll using GSAP.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const chars = el.querySelectorAll('[data-char]')
      if (!chars.length) return

      gsap.from(chars, {
        opacity: 0,
        y: 14,
        duration: 0.4,
        ease: 'power2.out',
        stagger: stagger / 1000,
        delay: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: ref },
  )

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {[...text].map((char, i) => (
        <span
          key={i}
          data-char
          aria-hidden="true"
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  )
}
