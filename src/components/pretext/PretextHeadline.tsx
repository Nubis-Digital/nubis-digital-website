'use client'

/* PretextHeadline — canvas hero headline with line-by-line reveal.
 *
 * Faithful React port of the prototype's pretext-hero integration:
 *  - Renders the real DOM <h1> (part1 + italic <span className="em">emphasis</span>)
 *    so screen readers / SEO / no-JS always see the headline.
 *  - On mount, re-flows the headline with pretext's line-breaker and reveals it
 *    line-by-line on a <canvas> overlay.
 *  - Locks the headline box to the pretext-measured height BEFORE the canvas swap
 *    so the swap causes zero layout shift.
 *  - The DOM text goes `color: transparent` on BOTH the h1 and the .em span
 *    (the .em span carries its own color, which would otherwise show through).
 *  - setTimeout finalize safety-net guarantees a fully-painted headline even if
 *    requestAnimationFrame is throttled (backgrounded tab/iframe).
 *  - Respects prefers-reduced-motion (paints instantly, no reveal).
 *  - If the pretext import or layout fails, the DOM headline stays fully visible
 *    and the canvas is skipped entirely.
 *
 * Everything is a strict enhancement — nothing here is load-bearing for content.
 */

import { useEffect, useRef } from 'react'

type Props = {
  part1: string
  emphasis: string
  className?: string
}

type Line = { text: string; font: string; color: string }

const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3)

/** canvas/pretext font shorthand synced to the element's computed CSS */
function fontStr(cs: CSSStyleDeclaration): string {
  return `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`
}

export default function PretextHeadline({ part1, emphasis, className }: Props) {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const emRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const h1 = h1Ref.current
    const emEl = emRef.current
    if (!h1) return

    let cancelled = false
    // Cleanup handles registered as the effect progresses.
    let cleanup: (() => void) | null = null

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    async function run() {
      // pretext measures against the browser font engine, so the real fonts
      // must be resolved first or widths come back wrong.
      try {
        await (document as Document & { fonts?: FontFaceSet }).fonts?.ready
      } catch {
        /* ignore */
      }
      try {
        await Promise.all([
          document.fonts.load('700 72px "Playfair Display"'),
          document.fonts.load('italic 600 72px "Playfair Display"'),
        ])
      } catch {
        /* ignore */
      }

      if (cancelled || !h1) return
      if (h1.clientWidth <= 0) return // not laid out yet — keep DOM headline

      let pretext: typeof import('@/lib/pretext')
      try {
        pretext = await import('@/lib/pretext')
      } catch (e) {
        console.warn('[pretext] import failed — keeping DOM headline.', e)
        return
      }
      if (cancelled || !h1) return

      try {
        cleanup = canvasHero(pretext, h1, emEl)
      } catch (e) {
        console.warn('[pretext] hero canvas failed — keeping DOM headline.', e)
        restoreDom(h1, emEl)
      }
    }

    /** Re-show the DOM text (used on any failure path). */
    function restoreDom(h1: HTMLHeadingElement, emEl: HTMLSpanElement | null) {
      h1.style.color = ''
      if (emEl) emEl.style.color = ''
    }

    function canvasHero(
      PT: typeof import('@/lib/pretext'),
      h1: HTMLHeadingElement,
      emEl: HTMLSpanElement | null,
    ): () => void {
      const csH = getComputedStyle(h1)
      const csE = emEl ? getComputedStyle(emEl) : csH
      const lh = parseFloat(csH.lineHeight) || parseFloat(csH.fontSize) * 1.1
      const fontP = fontStr(csH)
      const fontE = fontStr(csE)
      const colP = csH.color
      const colE = csE.color

      // Normalize the styled runs straight from the props (text already in DOM).
      const textP = part1.replace(/\s+/g, ' ').trim()
      const textE = emphasis.replace(/\s+/g, ' ').trim()

      // One-time prepare() per run — the expensive analysis pass. layout() after
      // this is pure arithmetic, so resizes are cheap.
      const prepP = PT.prepareWithSegments(textP, fontP)
      const prepE = textE ? PT.prepareWithSegments(textE, fontE) : null

      let lines: Line[] = []
      function relayout(width: number) {
        const out: Line[] = PT.layoutWithLines(prepP, width, lh).lines.map((l) => ({
          text: l.text,
          font: fontP,
          color: colP,
        }))
        if (prepE) {
          PT.layoutWithLines(prepE, width, lh).lines.forEach((l) =>
            out.push({ text: l.text, font: fontE, color: colE }),
          )
        }
        lines = out
      }
      relayout(h1.clientWidth)

      // Lock the headline box to the pretext-measured height BEFORE we make the
      // text transparent, so swapping to canvas causes exactly zero layout shift.
      h1.style.minHeight = lines.length * lh + 'px'
      h1.style.position = 'relative'

      const cv = document.createElement('canvas')
      cv.setAttribute('aria-hidden', 'true')
      cv.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
      h1.appendChild(cv)

      // Keep the real text in the DOM for screen readers / SEO / no-JS — just
      // hidden. The .em span carries its own explicit color rule, so hide it
      // directly too (inline style beats the class selector).
      h1.style.color = 'transparent'
      if (emEl) emEl.style.color = 'transparent'

      const ctx = cv.getContext('2d')
      if (!ctx) {
        // Canvas unavailable — restore and bail without a reveal.
        h1.removeChild(cv)
        restoreDom(h1, emEl)
        return () => {}
      }

      function draw(progressFn?: (i: number) => number) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = h1.clientWidth
        const hgt = h1.clientHeight
        cv.width = Math.round(w * dpr)
        cv.height = Math.round(hgt * dpr)
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx!.clearRect(0, 0, w, hgt)
        ctx!.textBaseline = 'middle'
        ctx!.textAlign = 'left'
        for (let i = 0; i < lines.length; i++) {
          const p = progressFn ? progressFn(i) : 1
          if (p <= 0) continue
          const e = easeOut(Math.min(1, p))
          ctx!.globalAlpha = e
          ctx!.font = lines[i].font
          ctx!.fillStyle = lines[i].color
          ctx!.fillText(lines[i].text, 0, i * lh + lh / 2 + (1 - e) * 18)
        }
        ctx!.globalAlpha = 1
      }

      let rafId = 0
      let finishTimer: ReturnType<typeof setTimeout> | undefined
      let resizeTimer: ReturnType<typeof setTimeout> | undefined
      const onVisibility = () => {
        if (document.visibilityState === 'visible') finalize()
      }
      let finished = false
      const finalize = () => {
        if (finished) return
        finished = true
        draw()
      }

      if (reduceMotion || document.visibilityState !== 'visible') {
        // No animation (or page not visible so rAF would be throttled): paint final.
        draw()
      } else {
        const start = performance.now()
        const delay = 110
        const dur = 720
        const frame = (now: number) => {
          const t = now - start
          let done = true
          draw((i) => {
            const p = (t - i * delay) / dur
            if (p < 1) done = false
            return p
          })
          if (!done) rafId = requestAnimationFrame(frame)
          else finalize()
        }
        rafId = requestAnimationFrame(frame)
        // Safety net: requestAnimationFrame is paused when the tab/iframe is
        // backgrounded, which would leave the canvas stuck on its blank first
        // frame. This guarantees the headline always ends fully painted.
        finishTimer = setTimeout(finalize, lines.length * delay + dur + 600)
        // If the page was hidden mid-reveal and comes back, repaint the end state.
        document.addEventListener('visibilitychange', onVisibility)
      }

      const onResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          try {
            relayout(h1.clientWidth)
            h1.style.minHeight = lines.length * lh + 'px'
            draw()
          } catch {
            /* ignore */
          }
        }, 150)
      }
      window.addEventListener('resize', onResize)

      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        if (finishTimer) clearTimeout(finishTimer)
        if (resizeTimer) clearTimeout(resizeTimer)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibility)
        if (cv.parentNode === h1) h1.removeChild(cv)
        // Restore the headline to its plain DOM state.
        h1.style.color = ''
        h1.style.minHeight = ''
        h1.style.position = ''
        if (emEl) emEl.style.color = ''
      }
    }

    run()

    return () => {
      cancelled = true
      if (cleanup) cleanup()
    }
    // part1/emphasis are stable per-render props; re-run if they change.
  }, [part1, emphasis])

  return (
    <h1 ref={h1Ref} className={className}>
      {part1}
      {emphasis ? (
        <>
          {' '}
          <span ref={emRef} className="em">
            {emphasis}
          </span>
        </>
      ) : null}
    </h1>
  )
}
