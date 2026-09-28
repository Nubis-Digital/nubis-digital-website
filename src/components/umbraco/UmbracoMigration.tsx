import { content } from '@/data/content';
import { highlightUmbraco } from '@/components/umbraco/highlightUmbraco';

/**
 * UmbracoMigration — a real 3-step sequence (numbers earn their place), paper
 * ground, plain reassurance that switching is painless and downtime-free.
 */
export default function UmbracoMigration() {
  const m = content.umbraco.migration;
  return (
    <section className="section umb-migration">
      <div className="inner">
        <div className="umb-head reveal">
          <h2 className="js-head">{highlightUmbraco(m.headline)}</h2>
          <p className="umb-lead">{m.lead}</p>
        </div>

        <ol className="umb-steps reveal">
          {m.steps.map((s) => (
            <li className="umb-step" key={s.n}>
              <span className="umb-step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
