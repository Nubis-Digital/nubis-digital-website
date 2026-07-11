'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { activatePortalTimeline } from './portalMotion'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power3.out'

/**
 * MotionLayer — the GSAP enhancement layer for the Nubis homepage.
 *
 * Philosophy: motion is purely ADDITIVE. All content is fully visible without
 * it (the .reveal / .hero-anim CSS classes are empty). We only animate when
 * GSAP is present AND the user has not requested reduced motion. fromTo is used
 * everywhere so elements always END at opacity 1 with cleared transforms —
 * content can never get stuck hidden.
 *
 * Renders nothing. Selects existing DOM by class in a post-mount effect.
 */
export default function MotionLayer() {
  useEffect(() => {
    // Reduced-motion or no GSAP → do nothing, content stays visible.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || typeof gsap === 'undefined') return

    const cleanups: Array<() => void> = []
    let ctx: gsap.Context | null = null

    try {
      ctx = gsap.context(() => {
        const $ = <T extends Element = Element>(sel: string): T | null =>
          document.querySelector<T>(sel)
        const $$ = <T extends Element = HTMLElement>(sel: string): T[] =>
          Array.from(document.querySelectorAll<T>(sel))

        /* =============================================================
           HERO — orchestrated entrance (fade + slight rise; figure scale)
           ============================================================= */
        const heroTL = gsap.timeline({ defaults: { ease: EASE } })
        const heroCopyChildren = $$('.hero-copy > *')
        const figure = $('.stage-wrap') || $('.hero-prism')

        if (heroCopyChildren.length) {
          heroTL.fromTo(
            heroCopyChildren,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              clearProps: 'transform,opacity',
            },
            0.1,
          )
        }
        if (figure) {
          heroTL.fromTo(
            figure,
            { opacity: 0, scale: 0.92 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.3,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
            0,
          )
        }

        // Drafting furniture joins the entrance: sheet frame settles, the title-block
        // dimension is "drawn" down the headline, margin notes and end-ticks fade in.
        const heroFrame = $('.hero-frame')
        const heroNotes = $$('.hero-note')
        const dimBar = $('.hero-dim-bar')
        const dimMarks = $$('.hero-dim-tick, .hero-dim-label')
        if (heroFrame)
          heroTL.fromTo(
            heroFrame,
            { opacity: 0, scale: 0.985 },
            { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', clearProps: 'transform,opacity' },
            0.05,
          )
        if (dimBar)
          heroTL.fromTo(
            dimBar,
            { scaleY: 0, transformOrigin: '50% 0%' },
            { scaleY: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform' },
            0.28,
          )
        if (dimMarks.length)
          heroTL.fromTo(
            dimMarks,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: 0.08, clearProps: 'opacity' },
            0.55,
          )
        if (heroNotes.length)
          heroTL.fromTo(
            heroNotes,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, stagger: 0.12, clearProps: 'opacity' },
            0.6,
          )

        // Safety net: fromTo sets the hero block to opacity:0 immediately. If rAF is
        // throttled (backgrounded tab/headless render) the timeline can stall there,
        // shipping the hero blank. Force the end state after a max window so the most
        // important block is never stuck hidden.
        const heroSafety = window.setTimeout(() => {
          if (heroCopyChildren.length)
            gsap.set(heroCopyChildren, { opacity: 1, y: 0, clearProps: 'transform,opacity' })
          if (figure) gsap.set(figure, { opacity: 1, scale: 1, clearProps: 'transform,opacity' })
          if (heroFrame) gsap.set(heroFrame, { opacity: 1, scale: 1, clearProps: 'transform,opacity' })
          if (heroNotes.length) gsap.set(heroNotes, { opacity: 1, clearProps: 'opacity' })
          if (dimBar) gsap.set(dimBar, { scaleY: 1, clearProps: 'transform' })
          if (dimMarks.length) gsap.set(dimMarks, { opacity: 1, clearProps: 'opacity' })
        }, 2200)
        cleanups.push(() => window.clearTimeout(heroSafety))

        /* =============================================================
           SCROLL REVEALS — scrubbed, the "Where We Stand" feel sitewide.
           Body elements fade + rise tied to scroll (you scrub them in);
           headings clip-wipe up (below). From-states are JS-set, so the
           no-JS / reduced-motion default is fully visible; the no-scroll
           safety (bottom) force-reveals everything for headless / idle loads.
           ============================================================= */
        const scrubTriggers: ScrollTrigger[] = []
        $$<HTMLElement>('.reveal').forEach((el) => {
          const tw = gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 66%', scrub: 0.5 },
            },
          )
          if (tw.scrollTrigger) scrubTriggers.push(tw.scrollTrigger)
        })

        /* =============================================================
           COUNT-UP METRICS — parse numeric portion of data-value,
           preserve prefix/suffix, animate 0→value, then set exact text.
           ============================================================= */
        $$<HTMLElement>('.metric-num').forEach((el) => {
          const raw = el.dataset.value ?? el.textContent ?? ''
          // Capture: prefix (non-digit), number, suffix (rest). e.g.
          // "3x" → "", "3", "x"; "60%" → "", "60", "%"; "< 200ms" → "< ", "200", "ms"
          const match = raw.match(/^(\D*)([\d.,]+)(.*)$/)
          if (!match) return

          const [, prefix, numStr, suffix] = match
          const target = parseFloat(numStr.replace(/,/g, ''))
          if (!Number.isFinite(target)) return

          // Preserve formatting: decimals + thousands separators.
          const decimals = numStr.includes('.')
            ? numStr.split('.')[1].length
            : 0
          const hasThousands = numStr.includes(',')

          const counter = { val: 0 }
          gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate: () => {
              const n = counter.val
              const formatted = hasThousands
                ? n.toLocaleString('en-US', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  })
                : n.toFixed(decimals)
              el.textContent = `${prefix}${formatted}${suffix}`
            },
            onComplete: () => {
              // Land exactly on the authored value text.
              el.textContent = raw
            },
          })
        })

        /* =============================================================
           MAGNETIC CTAs — every .btn-primary except the hero one.
           ============================================================= */
        $$<HTMLElement>('.btn-primary').forEach((btn) => {
          if (btn.closest('.hero-copy')) return

          const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' })
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' })

          const onMove = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect()
            xTo((e.clientX - r.left - r.width / 2) * 0.35)
            yTo((e.clientY - r.top - r.height / 2) * 0.35)
          }
          const onLeave = () => {
            xTo(0)
            yTo(0)
          }

          btn.addEventListener('pointermove', onMove)
          btn.addEventListener('pointerleave', onLeave)
          cleanups.push(() => {
            btn.removeEventListener('pointermove', onMove)
            btn.removeEventListener('pointerleave', onLeave)
          })
        })

        /* =============================================================
           HEADER LIFT — toggle .scrolled after scrollY > 8.
           ============================================================= */
        const header = $('.site-header')
        if (header) {
          const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 8)
          }
          onScroll()
          window.addEventListener('scroll', onScroll, { passive: true })
          cleanups.push(() => {
            window.removeEventListener('scroll', onScroll)
            header.classList.remove('scrolled')
          })
        }

        /* =============================================================
           THE DIVE — a pinned zoom THROUGH the laptop screen into the cream
           interior. The hero pins while a 400vh track passes underneath; the
           STRUCTA screen scales 1x→16x (easeInOutCubic = GSAP power2.inOut,
           anchored on the screen region), the eyebrow/cue/blueprint callouts
           fade as it begins, and a cream arrival curtain cross-fades in as you
           pass through the glass — landing you inside the product, on the same
           paper ground as the section that follows. Zoom completes at ~70% of
           the track; the last 30% lets the interior settle before the pin
           releases. Set up inside the matchMedia below so touch / small /
           reduced-motion visitors keep the static hero and normal page flow.
           (Supersedes the old hero-prism parallax — the dive owns hero scroll.)
           ============================================================= */

        /* =============================================================
           PARALLAX — restrained multi-layer depth, sitewide. Background
           drafting grids (ink bands + Umbraco bands) and the Umbraco hero
           image drift slower than the content as their section scrolls past,
           via compositor transforms only (GSAP writes transforms; ScrollTrigger
           batches in one rAF — no per-event layout/repaint). Layers are
           overscanned in CSS so the drift never exposes an edge. Content stays
           still (restrained, on-brand). Reduced motion early-returns above, so
           none of this runs; the static default is the full design.
           ============================================================= */
        const parallax = (el: HTMLElement, from: number, to: number) => {
          const sec = el.closest('section') || el.parentElement || el
          gsap.fromTo(
            el,
            { yPercent: from },
            {
              yPercent: to,
              ease: 'none',
              scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }
        // background grids: gentle vertical drift (skip the pinned About-stance).
        $$<HTMLElement>('.depth-grid, .umb-grid').forEach((el) => parallax(el, -8, 8))
        // the Umbraco editor shot: scaled a touch so its drift stays inside the frame.
        $$<HTMLElement>('.umb-shot').forEach((el) => {
          gsap.set(el, { scale: 1.08 })
          parallax(el, -5, 5)
        })

        /* =============================================================
           EDITORIAL HEADINGS — a drafted clip-wipe up. The site's
           typographic signature; differentiated from the body .reveal fade.
           ============================================================= */
        const heads = $$<HTMLElement>('.js-head')
        heads.forEach((el) => {
          const tw = gsap.fromTo(
            el,
            { clipPath: 'inset(0 0 100% 0)', y: 12 },
            {
              clipPath: 'inset(0 0 -8% 0)',
              y: 0,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 62%', scrub: 0.5 },
            },
          )
          if (tw.scrollTrigger) scrubTriggers.push(tw.scrollTrigger)
        })

        /* =============================================================
           SET-PIECE (desktop + motion only): the About stance PINS and reveals
           as a held cinematic beat (the folded "Where We Stand" pull-moment).
           Mobile / reduced motion: it stays on its visible CSS default (the
           matchMedia never runs).
           ============================================================= */
        const mm = gsap.matchMedia()
        cleanups.push(() => mm.revert())

        /* ---- Continuous laptop portal (desktop + motion) ---- */
        mm.add(
          '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          () => {
            const hero = $<HTMLElement>('.hero--portal')
            if (!hero) return
            const shell = hero.querySelector<HTMLElement>('.portal-shell')
            const laptop = hero.querySelector<HTMLElement>('.portal-laptop')
            const aperture = hero.querySelector<HTMLElement>('.portal-aperture')
            const surface = hero.querySelector<HTMLElement>('.portal-surface')
            const cue = hero.querySelector<HTMLElement>('.scroll-cue')
            if (!hero || !shell || !laptop || !aperture || !surface) return

            return activatePortalTimeline(gsap, { hero, shell, laptop, aperture, surface, cue })
          },
        )

        mm.add(
          '(min-width: 1000px) and (prefers-reduced-motion: no-preference)',
          () => {
            /* ---- About stance: pinned, held reveal ---- */
            const mani = $('.about-stance')
            if (mani) {
              const kick = mani.querySelector('.kicker')
              const stmt = mani.querySelector('.stmt')
              const rule = mani.querySelector('.rule')
              const by = mani.querySelector('.by')
              gsap.set(kick, { opacity: 0, y: 14 })
              gsap.set(stmt, { clipPath: 'inset(0 0 110% 0)', y: 24 })
              gsap.set(rule, { scaleX: 0 })
              gsap.set(by, { opacity: 0, y: 18 })

              const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: mani,
                  start: 'top top',
                  end: '+=110%',
                  scrub: 0.5,
                  pin: true,
                  anticipatePin: 1,
                },
              })
              tl.to(kick, { opacity: 1, y: 0, duration: 0.25 }, 0)
                .to(stmt, { clipPath: 'inset(0 0 -12% 0)', y: 0, duration: 1.0 }, 0.05)
                .to(rule, { scaleX: 1, duration: 0.5 }, 0.85)
                .to(by, { opacity: 1, y: 0, duration: 0.5 }, 1.05)
            }

          },
        )

        /* =============================================================
           PROCESS — it IS a sequence: a cobalt measure is drawn across the
           four steps on scroll, steps and numerals enter in order.
           ============================================================= */
        const pgrid = $('.process-grid')
        if (pgrid) {
          const steps = $$('.process-step')
          const twS = gsap.fromTo(
            steps,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: pgrid, start: 'top 84%', end: 'top 50%', scrub: 0.5 },
            },
          )
          if (twS.scrollTrigger) scrubTriggers.push(twS.scrollTrigger)
          const nums = $$('.process-step .num')
          const twN = gsap.fromTo(
            nums,
            { opacity: 0, scale: 0.72, transformOrigin: '0% 100%' },
            {
              opacity: 1,
              scale: 1,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: pgrid, start: 'top 82%', end: 'top 50%', scrub: 0.5 },
            },
          )
          if (twN.scrollTrigger) scrubTriggers.push(twN.scrollTrigger)
        }
        const prule = $('.process-rule')
        if (prule) {
          gsap.fromTo(
            prule,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: '.process-grid-wrap',
                start: 'top 80%',
                end: 'top 34%',
                scrub: 0.5,
              },
            },
          )
        }

        /* =============================================================
           COMPARISON — the matrix "builds": rows enter top-to-bottom.
           Same selector covers the mobile card reflow.
           ============================================================= */
        /* Comparison rows live inside a collapsed <details> now — no per-row
           reveal (it would strand them hidden until the toggle is opened). */

        /* =============================================================
           SAFETY NET — force every choreographed element visible after a max
           window. fromTo sets opacity:0 / clip immediately; if ScrollTrigger
           never fires (hidden tab, headless capture) nothing can ship blank.
           ============================================================= */
        let userScrolled = false
        const markScrolled = () => {
          userScrolled = true
        }
        window.addEventListener('scroll', markScrolled, { once: true, passive: true })
        cleanups.push(() => window.removeEventListener('scroll', markScrolled))
        const revealSafety = window.setTimeout(() => {
          if (userScrolled) return // real visitor is scrolling — let the scrubs play
          scrubTriggers.forEach((st) => st.kill())
          gsap.set('.reveal, .process-step, .process-step .num, .cmp tbody tr', {
            opacity: 1,
            clearProps: 'transform',
          })
          gsap.set('.js-head', { opacity: 1, clearProps: 'clipPath,transform' })
        }, 4000)
        cleanups.push(() => window.clearTimeout(revealSafety))

        /* Keep triggers honest as fonts / 3D settle the layout. */
        const onLoad = () => ScrollTrigger.refresh()
        window.addEventListener('load', onLoad)
        cleanups.push(() => window.removeEventListener('load', onLoad))

        const refreshTimer = window.setTimeout(
          () => ScrollTrigger.refresh(),
          800,
        )
        cleanups.push(() => window.clearTimeout(refreshTimer))

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {})
        }
      })
    } catch {
      // A motion failure must never break the page — content stays visible.
    }

    return () => {
      try {
        cleanups.forEach((fn) => fn())
        ScrollTrigger.getAll().forEach((st) => st.kill())
        ctx?.revert()
      } catch {
        // Swallow cleanup errors.
      }
    }
  }, [])

  return null
}
