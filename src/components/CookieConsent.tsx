'use client';

/**
 * CookieConsent — a minimal, on-brand consent banner (a drafting note pinned to
 * the corner). Shows once, until the visitor chooses; the choice is stored in
 * localStorage so it never nags again. Honest by construction: no non-essential
 * cookies / analytics run until consent is "all" — so wiring any future tracker
 * behind `getConsent() === 'all'` keeps the promise.
 *
 * Renders nothing on the server and nothing until mounted (avoids hydration
 * mismatch and a flash). Non-modal: it never traps focus or blocks the page.
 */

import { useEffect, useState } from 'react';
import { content } from '@/data/content';

const STORAGE_KEY = 'nubis-consent';
export type Consent = 'all' | 'essential';

/** Read the stored choice (null if undecided). Safe to call from anywhere. */
export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'all' || v === 'essential' ? v : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const c = content.cookies;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only surface when no choice has been made yet.
    if (getConsent() === null) setOpen(true);
  }, []);

  const choose = (value: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage blocked — still dismiss for this session */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside className="cookie" role="region" aria-label="Cookie consent">
      <div className="cookie-inner">
        <p className="cookie-kicker">{c.kicker}</p>
        <p className="cookie-msg">{c.message}</p>
        <div className="cookie-actions">
          <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => choose('all')}>
            {c.acceptLabel}
          </button>
          <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => choose('essential')}>
            {c.essentialLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}
