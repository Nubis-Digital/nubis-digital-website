'use client';

/**
 * GlobalHeader — fixed site header.
 *
 * Wordmark logo (links to #top), primary nav, a language indicator (EN active),
 * the human-oversight toggle, and the primary CTA. Gains a `scrolled` class once
 * the page scrolls, matching the prototype's elevated-header treatment.
 */

import { useEffect, useState } from 'react';
import { content } from '@/data/content';
import Wordmark from '@/components/Wordmark';
import UmbracoLogo from '@/components/umbraco/UmbracoLogo';

export default function GlobalHeader() {
  const h = content.header;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const storyHref = (href: string) => ({
    '/#services': '/#story-proposals',
    '/#projects': '/#story-proof',
    '/#about': '/#contact',
  }[href] ?? href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape, and whenever the viewport grows to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const scrollToContact = () => {
    setMenuOpen(false);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = '/#contact'; // from a subpage, go home to the form
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <a className="site-logo" href="/#top">
        <Wordmark />
      </a>

      <nav className="site-nav">
        {h.nav.map((n) => {
          const isUmbraco = n.href === '/umbraco';
          return (
            <a key={n.href} href={storyHref(n.href)} className={isUmbraco ? 'nav-umb' : undefined}>
              {isUmbraco && <UmbracoLogo size={16} className="nav-umb-mark" />}
              {n.label}
            </a>
          );
        })}
      </nav>

      <div className="header-right">
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="nav-toggle-bars" data-open={menuOpen} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <button
          type="button"
          className="btn-primary header-cta"
          onClick={scrollToContact}
        >
          {h.cta}
        </button>
      </div>

      <nav id="mobile-nav" className="mobile-nav" data-open={menuOpen} aria-label="Mobile">
        {h.nav.map((n) => {
          const isUmbraco = n.href === '/umbraco';
          return (
            <a
              key={n.href}
              href={storyHref(n.href)}
              className={isUmbraco ? 'nav-umb' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {isUmbraco && <UmbracoLogo size={18} className="nav-umb-mark" />}
              {n.label}
            </a>
          );
        })}
        <button type="button" className="mobile-cta" onClick={scrollToContact}>
          {h.cta}
        </button>
      </nav>
    </header>
  );
}
