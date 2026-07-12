'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { createStoryTimeline, setActiveChapter } from './storyMotion'

interface ImmersiveStoryMotionProps { rootId: 'immersive-story' }

export function ImmersiveStoryMotion({ rootId }: ImmersiveStoryMotionProps) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || typeof window.matchMedia !== 'function') return

    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        root.dataset.enhanced = 'true'
        setActiveChapter(root, 0)
        createStoryTimeline(gsap, root)
      })
    }, root)

    return () => {
      root.removeAttribute('data-enhanced')
      root.removeAttribute('data-beat')
      root.removeAttribute('data-device')
      root.style.removeProperty('--story-progress')
      root.querySelectorAll('[data-story-chapter]').forEach((element) => {
        element.removeAttribute('aria-hidden')
        element.removeAttribute('inert')
        element.removeAttribute('data-active')
      })
      context.revert()
      media.revert()
    }
  }, [rootId])

  return null
}
