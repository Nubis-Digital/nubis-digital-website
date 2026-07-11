'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * BrandLogo — pulls a company logo live by domain (Clearbit logo CDN), with a
 * graceful fallback to the company name if the logo can't be loaded.
 *
 * The useEffect catches the SSR race: a static-rendered <img> can error BEFORE
 * React hydrates, so its onError is never seen. After mount we re-check
 * `complete && naturalWidth === 0` (the signature of a failed load) and fall
 * back. Result: the grid shows real logos where available and clean names
 * everywhere else — never a broken-image glyph.
 */
export default function BrandLogo({ name, domain }: { name: string; domain: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <span className="umb-logo-name">{name}</span>;

  return (
    <img
      ref={ref}
      className="umb-logo-img"
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={120}
      height={40}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
