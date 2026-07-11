import { content } from '@/data/content';
import { Icon } from '@/components/icons';
import PretextHeadline from '@/components/pretext/PretextHeadline';

/**
 * Hero — "The Architect's Sheet": a drenched-ink drawing sheet. Title-block
 * typography on the left, a hairline tied-arch (load-bearing resilience) drawn
 * on the right, with drafting furniture (sheet frame, registration ticks, mono
 * margin notes) framing the whole. The page's strongest statement of the brand
 * north star — "Architectural Resilience for the Agentic Web" — made literal.
 */
export default function Hero() {
  const { hero } = content;

  return (
    <section className="hero hero--sheet" id="top">
      {/* drafting sheet frame + corner registration ticks */}
      <div className="hero-frame" aria-hidden="true">
        <span className="tick tl" />
        <span className="tick tr" />
        <span className="tick bl" />
        <span className="tick br" />
      </div>

      <div className="hero-copy">
        {/* title block: an architect's vertical dimension measures the headline */}
        <div className="hero-head-row">
          <span className="hero-dim" aria-hidden="true">
            <span className="hero-dim-tick t" />
            <span className="hero-dim-bar" />
            <span className="hero-dim-tick b" />
            <span className="hero-dim-label">DWG · H</span>
          </span>
          <PretextHeadline part1={hero.headlinePart1} emphasis={hero.headlineEmphasis} />
        </div>

        <p className="body">{hero.bodyText}</p>
        <a className="btn-primary" href={hero.ctaUrl}>
          {hero.ctaText}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>

      <div className="hero-prism hero-stage">
        <div className="hs-depth">
          <img
            className="hero-shot"
            src="/hero-recommend.webp"
            alt="A business's website beside an AI assistant recommending it among other firms — the highlighted, chosen result."
            width={1083}
            height={974}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Blueprint callouts — a nod to the mockup's own registration marks.
            Static drafting furniture on the sheet; the dive fades them away. */}
        <span className="dive-callout dive-callout--screen" aria-hidden="true">
          <span className="dot" />
          <span>01 — Interface</span>
          <span className="lead" />
        </span>
        <span className="dive-callout dive-callout--panel" aria-hidden="true">
          <span className="dot" />
          <span>02 — AI Assistant</span>
          <span className="lead" />
        </span>
      </div>

      {/* The Dive, beat 2 — the crisp vector interface you resolve INTO as you
          pass through the glass. A flat, razor-sharp Nubis oversight console
          (the product's "show the oversight" principle, made literal), echoing
          the mockup's own numbered AI panel. Replaces the softening raster
          screen at full zoom. Inert until MotionLayer activates it. */}
      <div className="dive-ui" aria-hidden="true">
        <div className="dui-sheet">
          <span className="dui-frame" />
          <header className="dui-bar">
            <span className="dui-wm">Nubis<span className="dot">.</span></span>
            <span className="dui-live"><span className="pip" />Session · Live</span>
          </header>
          <div className="dui-body">
            <div className="dui-main">
              <span className="dui-kick">Agent · Supervised</span>
              <p className="dui-prompt">
                “Find us a partner to migrate our CMS and run a governed AI assistant.”
              </p>
              <div className="dui-answer">
                <span className="dui-a-tag">Nubis Agent</span>
                <p>
                  Strongest match for your stack: an Umbraco migration paired with a
                  supervised agent — capability with human oversight built in.
                </p>
              </div>
              <div className="dui-oversight">
                <span className="dui-ov-label">Human oversight</span>
                <span className="dui-ov-state"><span className="chk">✓</span> Reviewed · Approved</span>
              </div>
            </div>
            <aside className="dui-side">
              <span className="dui-side-h">Transparency log</span>
              <ul className="dui-log">
                <li><span className="n">01</span> Retrieved sources<span className="chk">✓</span></li>
                <li className="on"><span className="n">02</span> Drafted recommendation<span className="chk">✓</span></li>
                <li><span className="n">03</span> Flagged for human review<span className="chk">✓</span></li>
              </ul>
            </aside>
          </div>
        </div>
      </div>

      {/* The Dive's arrival curtain — the cream interior you land in once the
          screen fills the frame. Shares the paper ground of the section below
          so the pin releases seamlessly. Inert until MotionLayer activates it. */}
      <div className="dive-reveal" aria-hidden="true">
        <span className="dive-reveal-grid" />
        <span className="dive-reveal-frame" />
        <span className="dive-reveal-mark">
          <img src="/assets/logomark.svg" alt="" width={46} height={46} decoding="async" />
          <span className="dive-reveal-kicker">{content.whyAgentic.label}</span>
        </span>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="ln" />
      </div>
    </section>
  );
}
