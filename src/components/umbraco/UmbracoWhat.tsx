import { content } from '@/data/content';
import { highlightUmbraco } from '@/components/umbraco/highlightUmbraco';

/**
 * UmbracoWhat — the plain-language explainer for non-technical readers. Paper
 * ground; three points as a hairline-divided row (not cards).
 */
export default function UmbracoWhat() {
  const w = content.umbraco.what;
  return (
    <section className="section umb-what">
      <div className="inner">
        <div className="umb-head reveal">
          <h2 className="js-head">{highlightUmbraco(w.headline)}</h2>
          <p className="umb-lead">{w.lead}</p>
        </div>

        <div className="umb-points reveal">
          {w.points.map((p) => (
            <div className="umb-point" key={p.title}>
              <span className="umb-mark" aria-hidden="true" />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
