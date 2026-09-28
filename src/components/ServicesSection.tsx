import { content } from '@/data/content';
import { Icon } from '@/components/icons';

const s = content.services;

/**
 * Services — "Our Solutions": the same agent-ready rebuild, framed as three
 * plain outcomes a non-technical owner cares about (get found / get recommended
 * / stay in control). Distilled to the message: header, the three outcomes,
 * and a single plain foundation line for the technical "how".
 */
export default function ServicesSection() {
  return (
    <section className="services-bp" id="services">
      <div className="depth-grid" aria-hidden="true" />
      <div className="services-bp-inner">
        <header className="bp-head reveal">
          <h2 className="js-head">
            {s.headlinePart1} <span className="em">{s.headlineEmphasis}</span>
          </h2>
          <p className="bp-intro">{s.introText}</p>
        </header>

        {/* Outcome packages — what the rebuild does for the business */}
        <ol className="bp-packages reveal">
          {s.packages.map((p, i) => (
            <li className="bp-package" key={p.title}>
              <span className="bp-package-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </li>
          ))}
        </ol>

        {/* Foundation — the plain "how", proof kept quiet and supporting */}
        <div className="bp-foundation reveal">
          <div>
            <h3>{s.foundation.title}</h3>
            <p>{s.foundation.description}</p>
          </div>
          <a href={s.foundation.ctaUrl} className="bp-cta">
            {s.foundation.cta}
            <Icon name="arrow-right" size={14} />
          </a>
        </div>

      </div>
    </section>
  );
}
