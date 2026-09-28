import { content } from '@/data/content';
import { highlightUmbraco } from '@/components/umbraco/highlightUmbraco';

/**
 * UmbracoWhy — the benefits, in plain terms. Umbraco-branded drenched band
 * (deep navy + teal/blue marks), hairline-divided grid.
 */
export default function UmbracoWhy() {
  const w = content.umbraco.why;
  return (
    <section className="umb-why">
      <div className="umb-grid" aria-hidden="true" />
      <div className="inner">
        <div className="umb-head umb-head--on-dark reveal">
          <h2 className="js-head">{highlightUmbraco(w.headline)}</h2>
        </div>

        <div className="umb-why-grid reveal">
          {w.items.map((it) => (
            <div className="umb-why-item" key={it.title}>
              <span className="umb-mark umb-mark--teal" aria-hidden="true" />
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
