import PortalContent from '@/components/PortalContent'

export default function Hero() {
  return (
    <section className="hero hero--portal" id="top" aria-label="Nubis Digital introduction">
      <div className="hero-frame" aria-hidden="true">
        <span className="tick tl" /><span className="tick tr" />
        <span className="tick bl" /><span className="tick br" />
      </div>

      <div className="portal-shell" data-portal-state="screen">
        <img
          className="portal-laptop"
          src="/hero-recommend.webp"
          alt=""
          aria-hidden="true"
          width={1083}
          height={974}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="portal-aperture">
          <div className="portal-surface">
            <PortalContent compact />
          </div>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll to enter</span><span className="ln" />
      </div>
    </section>
  )
}
