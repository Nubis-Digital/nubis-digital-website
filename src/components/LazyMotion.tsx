'use client'

import dynamic from 'next/dynamic'

/**
 * GSAP-driven motion, split out of the first-load bundle. Every page is fully
 * server-rendered and visible without it (motion is additive), so the ~160KB
 * of GSAP + plugins is fetched after first paint instead of competing with it.
 */
export const LazyStoryMotion = dynamic(() => import('./story/ImmersiveStoryMotion').then((mod) => mod.ImmersiveStoryMotion), { ssr: false })

export const LazyMotionLayer = dynamic(() => import('./MotionLayer'), { ssr: false })
