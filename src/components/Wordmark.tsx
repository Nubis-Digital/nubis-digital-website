/**
 * Wordmark — the integrated Nubis Digital signature.
 *
 * The Signal mark (geometric N: ink stems + a rising cobalt beam) stands in as
 * the capital N, set immediately before the Playfair "ubis" letters and a cobalt
 * period. Logo and wordmark in one object.
 *
 * Sizing is driven by the surrounding `font-size` (em-relative) so the same mark
 * scales for the header (1.5rem) and footer (1.875rem) without changes here.
 */

interface WordmarkProps {
  /** Footer-on-ink usage: stems become paper; beam + period stay cobalt. */
  inverted?: boolean;
}

export default function Wordmark({ inverted = false }: WordmarkProps) {
  return (
    <span
      className="wm"
      aria-label="Nubis"
      style={inverted ? { color: 'var(--paper)' } : undefined}
    >
      {/* Tightly-cropped N glyph — viewBox trimmed to the strokes so it sets like a letter. */}
      <svg
        className="glyphN"
        viewBox="16 11 80 87"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="11" strokeLinecap="square" fill="none">
          <line x1="34" y1="30" x2="34" y2="90" />
          <line x1="86" y1="30" x2="86" y2="90" />
        </g>
        <path
          d="M86 90 L34 30 L24 18"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="11"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <span className="wm-rest">ubis</span>
      <span className="dot">.</span>
    </span>
  );
}
