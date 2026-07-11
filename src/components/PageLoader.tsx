import Wordmark from '@/components/Wordmark';

/**
 * PageLoader — the brand "drafting sheet" that lifts to reveal the page.
 *
 * Server-rendered and driven entirely by CSS: it plays once per full document
 * load (the root layout persists across client navigation, so it never replays
 * on internal links) and dismisses itself on a fixed ~1.1s timeline — no JS, no
 * hydration, no flash of content before it appears. With JS disabled the CSS
 * animation still lifts it; with `prefers-reduced-motion` the global motion-kill
 * collapses the timeline so it's gone instantly. The real page is rendered
 * underneath this overlay, so content is never gated on the loader.
 *
 * On-system: ink ground (seamless into the ink hero), cobalt load-path rule that
 * draws, corner registration ticks, and the integrated Nubis wordmark assembling.
 */
export default function PageLoader() {
  return (
    <div className="page-loader" aria-hidden="true">
      <div className="pl-frame">
        <span className="pl-tick pl-tl" />
        <span className="pl-tick pl-tr" />
        <span className="pl-tick pl-bl" />
        <span className="pl-tick pl-br" />
      </div>

      <div className="pl-stage">
        <span className="pl-wm">
          <Wordmark inverted />
        </span>
        <span className="pl-rule" />
        <span className="pl-label">Architectural Resilience</span>
      </div>
    </div>
  );
}
