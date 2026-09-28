import { content } from '@/data/content';

/**
 * AboutSection — the page's closing "who we are." Opens with the folded
 * "Where We Stand" stance (a drenched-ink pull-moment, pinned + scrubbed on
 * desktop by MotionLayer), then the story on paper and two principles. No
 * invented facts: the story states the conviction, not a fabricated history —
 * `storyNote` invites the real specifics.
 */
export default function AboutSection() {
  const a = content.about;

  return (
    <section className="about-section" id="about">
      {/* Stance — the brand thesis, ink ground, held reveal on desktop */}
      <div className="about-stance">
        <div className="grid-overlay bg-grid" aria-hidden="true" />
        <div className="about-stance-inner">
          <blockquote className="stmt" id="about-stmt">
            {a.stance.pre} <span className="em">{a.stance.em}</span> {a.stance.post}
          </blockquote>
          <div className="rule" aria-hidden="true" />
          <p className="by">{a.stance.byline}</p>
        </div>
      </div>

      {/* Story + principles — paper ground */}
      <div className="about-body">
        <div className="inner">
          <div className="about-lead reveal">
            <h2 className="js-head">
              {a.headline} <span className="em">{a.headlineEmphasis}</span>
            </h2>
            <p className="lede">{a.lead}</p>
            <p className="about-story">{a.story}</p>
            <p className="about-note">{a.storyNote}</p>
          </div>

          <div className="about-grid reveal">
            {a.principles.map((p) => (
              <div className="about-card" key={p.title}>
                <span className="about-mark" aria-hidden="true" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
