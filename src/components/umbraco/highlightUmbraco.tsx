import { Fragment, type ReactNode } from 'react';

/**
 * highlightUmbraco — wrap every "Umbraco" in a heading with the brand-coloured
 * span (.umb-word), so the name always wears Umbraco's own blue. Colour is set
 * in CSS (blue on light sections, brighter blue on the navy bands).
 */
export function highlightUmbraco(text: string): ReactNode {
  return text.split(/(Umbraco)/g).map((part, i) =>
    part === 'Umbraco' ? (
      <span key={i} className="umb-word">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
