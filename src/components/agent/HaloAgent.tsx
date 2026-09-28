'use client';

/**
 * Halo — abstract AI voice-agent figure (replaces the 3D head in the hero).
 * An attentive iris: a cobalt core dilates inside concentric hairline rings
 * that pulse with the conversation. Pure SVG (no WebGL), so it renders
 * everywhere and stays flat + architectural. Ported from the design bundle's
 * agent-voice.jsx (Figure B · Halo), recolored uses the brand CSS vars.
 *
 * Driven by `agentState`: a rAF loop smooths an amplitude (0..1) per state and
 * mutates SVG attributes directly (no React re-render per frame).
 */

import { useEffect, useRef } from 'react';

export type AgentState = 'idle' | 'thinking' | 'listening' | 'speaking';

const BASE_R = [38, 66, 94, 122, 150];

export default function HaloAgent({ agentState }: { agentState: AgentState }) {
  const stateRef = useRef<AgentState>(agentState);
  useEffect(() => {
    stateRef.current = agentState;
  }, [agentState]);

  const core = useRef<SVGCircleElement>(null);
  const iris = useRef<SVGCircleElement>(null);
  const glow = useRef<SVGCircleElement>(null);
  const ringsG = useRef<SVGGElement>(null);
  const ringEls = useRef<(SVGCircleElement | null)[]>([]);
  const amp = useRef(0.12);

  useEffect(() => {
    let raf = 0;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    const paint = (a: number, t: number, s: AgentState) => {
      const active = s !== 'idle';
      if (core.current) core.current.setAttribute('r', (9 + a * 13).toFixed(2));
      if (iris.current) iris.current.setAttribute('r', (20 + a * 20).toFixed(2));
      if (glow.current) glow.current.style.opacity = (0.12 + a * 0.45).toFixed(3);
      if (ringsG.current) {
        const sc = 1 + a * 0.05;
        ringsG.current.setAttribute('transform', `translate(160 160) scale(${sc.toFixed(3)})`);
      }
      ringEls.current.forEach((el, i) => {
        if (!el) return;
        const phase = Math.sin(t * (active ? 3 : 1.2) - i * 0.7);
        const op = active
          ? 0.1 + (phase * 0.5 + 0.5) * (0.18 + a * 0.5)
          : 0.08 + (phase * 0.5 + 0.5) * 0.1;
        el.style.opacity = op.toFixed(3);
        el.setAttribute('r', (BASE_R[i] + (active ? phase * a * 6 : 0)).toFixed(2));
      });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now || 0) / 1000;
      const s = stateRef.current;
      let target: number;
      if (reduced) target = s === 'idle' ? 0.12 : 0.45;
      else if (s === 'speaking') target = 0.42 + Math.random() * 0.5;
      else if (s === 'listening') target = 0.28 + Math.random() * 0.38;
      else if (s === 'thinking') target = 0.2 + Math.sin(t * 4) * 0.08;
      else target = 0.12 + Math.sin(t * 1.6) * 0.05;
      amp.current += (target - amp.current) * (reduced ? 1 : 0.16);
      paint(amp.current, t, s);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      viewBox="0 0 320 320"
      width="100%"
      height="100%"
      aria-label="Nubis voice agent"
      style={{ position: 'absolute', inset: 0 }}
    >
      <circle
        ref={glow}
        cx="160"
        cy="160"
        r="120"
        fill="var(--peri)"
        opacity="0.12"
        style={{ filter: 'blur(26px)' }}
      />
      <g ref={ringsG} transform="translate(160 160)">
        {BASE_R.map((r, i) => (
          <circle
            key={i}
            ref={(el) => {
              ringEls.current[i] = el;
            }}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke={i % 2 ? 'var(--peri)' : 'var(--ink)'}
            strokeWidth={i % 2 ? 1 : 1.25}
            opacity="0.12"
          />
        ))}
      </g>
      <circle
        ref={iris}
        cx="160"
        cy="160"
        r="22"
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle ref={core} cx="160" cy="160" r="10" fill="var(--signal)" />
    </svg>
  );
}
