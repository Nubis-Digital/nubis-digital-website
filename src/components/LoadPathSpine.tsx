'use client';

/**
 * LoadPathSpine — the page's scroll signature, built from the brand thesis:
 * "the cobalt signal marks the load path through the structure." A vertical
 * drafting rule in the left margin fills cobalt as you scroll, and a node per
 * section ignites when you reach it — scrolling literally traces the load path
 * down the architecture. A vertical mono label names the current section
 * (architect's margin annotation).
 *
 * Driven by a rAF-throttled scroll handler writing straight to refs (no per-
 * frame React render). Neutrals flip paper↔ink over dark sections so it reads
 * on any ground; cobalt stays cobalt. Informational, so it's safe under reduced
 * motion (the node/label transitions simply resolve instantly). On narrow
 * viewports the spine hides and a slim top progress bar takes over.
 */

import { useEffect, useRef } from 'react';

const SECTIONS = [
  { id: 'top', label: 'Cover', dark: true },
  { id: 'why-agentic', label: 'Why It Matters', dark: false },
  { id: 'services', label: 'Our Solutions', dark: true },
  { id: 'comparison', label: 'Comparison', dark: false },
  { id: 'process', label: 'Process', dark: false },
  { id: 'projects', label: 'Selected Work', dark: false },
  { id: 'testimonials', label: 'In Their Words', dark: true },
  { id: 'about', label: 'About', dark: false },
  { id: 'contact', label: 'Contact', dark: false },
] as const;

export default function LoadPathSpine() {
  const progRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    let geo: { top: number; height: number }[] = [];
    let docH = 1;
    let raf = 0;

    function measure() {
      docH = document.documentElement.scrollHeight || 1;
      geo = els.map((el) =>
        el ? { top: el.offsetTop, height: el.offsetHeight } : { top: 0, height: 0 },
      );
      geo.forEach((g, i) => {
        const n = nodeRefs.current[i];
        if (n) n.style.top = `${((g.top + g.height / 2) / docH) * 100}%`;
      });
    }

    function update() {
      raf = 0;
      const st = window.scrollY;
      const ih = window.innerHeight;
      const maxS = docH - ih;
      const prog = maxS > 0 ? Math.min(1, Math.max(0, st / maxS)) : 0;
      if (progRef.current) progRef.current.style.transform = `scaleX(${prog})`;

      const playFrac = Math.min(1, Math.max(0, (st + ih / 2) / docH));
      if (fillRef.current) fillRef.current.style.height = `${playFrac * 100}%`;

      const center = st + ih / 2;
      let active = 0;
      geo.forEach((g, i) => {
        const reached = (g.top + g.height / 2) / docH <= playFrac;
        const n = nodeRefs.current[i];
        if (n) n.classList.toggle('reached', reached);
        if (center >= g.top && center < g.top + g.height) active = i;
      });
      nodeRefs.current.forEach((n, i) => n?.classList.toggle('active', i === active));

      const ag = geo[active];
      if (labelRef.current && ag) {
        const mid = ((ag.top + ag.height / 2) / docH) * 100;
        labelRef.current.style.top = `${Math.min(92, Math.max(8, mid))}%`;
        labelRef.current.textContent = SECTIONS[active].label;
      }
      if (spineRef.current) spineRef.current.classList.toggle('on-dark', SECTIONS[active].dark);
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    function onResize() {
      measure();
      update();
    }

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    // Re-measure after layout settles — fonts, images, and any ScrollTrigger
    // pin-spacers (the About-stance pin) all shift section offsets.
    const t1 = window.setTimeout(onResize, 800);
    const t2 = window.setTimeout(onResize, 1800);
    if (document.fonts?.ready) document.fonts.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="read-progress" ref={progRef} aria-hidden="true" />
      <div className="spine" ref={spineRef} aria-hidden="true">
        <span className="spine-rule" />
        <span className="spine-fill" ref={fillRef} />
        {SECTIONS.map((s, i) => (
          <span
            key={s.id}
            className="spine-node"
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
          />
        ))}
        <span className="spine-label" ref={labelRef} />
      </div>
    </>
  );
}
