import { content } from '@/data/content';
import { Icon } from '@/components/icons';

/**
 * The free AI visibility check — the site's front door for a first
 * conversation. House ink/paper/signal throughout: an ink hero band, the
 * checks as a hairline grid, three numbered steps, a plain FAQ (mirrored as
 * FAQPage JSON-LD) and one closing call to action.
 */
const c = content.aiCheck;

export function AiCheckHero() {
  return (
    <section className="chk-hero" id="top">
      <div className="chk-hero-inner">
        <p className="chk-kicker">{c.hero.kicker}</p>
        <h1 className="chk-hero-h1">{c.hero.headline}</h1>
        <p className="chk-hero-sub">{c.hero.sub}</p>
        <a className="btn-primary chk-btn" href={c.hero.ctaUrl}>
          {c.hero.cta}
          <Icon name="arrow-right" size={16} />
        </a>
        <p className="chk-note">{c.hero.note}</p>
      </div>
    </section>
  );
}

export function AiCheckList() {
  return (
    <section className="section chk-list">
      <div className="inner">
        <div className="chk-head">
          <h2>{c.checks.headline}</h2>
          <p className="chk-lead">{c.checks.lead}</p>
        </div>
        <ul className="chk-grid">
          {c.checks.items.map((item) => (
            <li className="chk-item" key={item.title}>
              <span className="chk-mark" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AiCheckSteps() {
  return (
    <section className="section chk-steps-section">
      <div className="inner">
        <div className="chk-head">
          <h2>{c.steps.headline}</h2>
          <p className="chk-lead">{c.steps.lead}</p>
        </div>
        <ol className="chk-steps">
          {c.steps.items.map((step) => (
            <li className="chk-step" key={step.n}>
              <span className="chk-step-n">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AiCheckFaq() {
  return (
    <section className="section chk-faq">
      <div className="inner">
        <div className="chk-head">
          <h2>{c.faq.headline}</h2>
        </div>
        <dl className="chk-faq-list">
          {c.faq.items.map((item) => (
            <div className="chk-faq-item" key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function AiCheckCta() {
  return (
    <section className="chk-cta">
      <div className="chk-cta-inner">
        <h2 className="chk-cta-h2">{c.cta.headline}</h2>
        <p className="chk-cta-text">{c.cta.text}</p>
        <a className="btn-primary chk-btn" href={c.cta.buttonUrl}>
          {c.cta.button}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </section>
  );
}
