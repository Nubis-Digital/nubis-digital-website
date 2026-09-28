import { content } from '@/data/content';
import { Icon } from '@/components/icons';

/**
 * Why Agentic Matters — dark section.
 * Faithful port of the prototype's WhyAgentic component.
 * Server component: no interactivity. GSAP MotionLayer reveals `.reveal` elements.
 */
export default function WhyAgenticSection() {
  const w = content.whyAgentic;

  return (
    <section className="section why" id="why-agentic">
      <div className="inner">
        <div className="section-head section-head--editorial reveal">
          <h2 className="js-head">
            {w.headline} <span className="em">{w.headlineEmphasis}</span>
          </h2>
          <p className="lede">{w.introText}</p>
        </div>
        <div className="why-grid">
          {w.benefits.map((b) => (
            <div className="why-card reveal" key={b.title}>
              <span className="why-mark" aria-hidden="true" />
              <h3>{b.title}</h3>
              <p>{b.description}</p>
            </div>
          ))}
        </div>
        <a href={w.ctaUrl} className="why-cta reveal">
          {w.cta}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </section>
  );
}
