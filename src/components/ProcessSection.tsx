/**
 * ProcessSection — "From Audit to Agentic" (4-step process grid).
 * Server component. Ported from the design's <Process /> section.
 */
import { content } from '@/data/content';
import { Icon } from '@/components/icons';

export default function ProcessSection() {
  const p = content.process;
  return (
    <section className="section" id="process">
      <div className="inner">
        <div className="section-head section-head--center reveal">
          <h2 className="js-head">
            {p.headline} <span className="em">{p.headlineEmphasis}</span>
          </h2>
        </div>
        <div className="process-grid-wrap">
          <span className="process-rule" aria-hidden="true" />
          <ol className="process-grid">
            {p.steps.map((st) => (
              <li className="process-step" key={st.number}>
                <span className="num">{st.number}</span>
                <h3>
                  <Icon name={st.icon} size={16} />
                  {st.title}
                </h3>
                <p>{st.description}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="process-cta reveal">
          <a href={p.ctaUrl} className="btn-primary">
            {p.cta}
            <Icon name="arrow-right" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
