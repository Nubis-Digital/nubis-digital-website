import GlobalHeader from '@/components/GlobalHeader';
import LoadPathSpine from '@/components/LoadPathSpine';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { LazyMotionLayer } from '@/components/LazyMotion';
import CookieConsent from '@/components/CookieConsent';
import { ImmersiveStory } from '@/components/story/ImmersiveStory';
import { homeJsonLd, jsonLdScript } from '@/data/machineReadable';

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(homeJsonLd()) }} />
      <a href="#main" className="skip-link">Skip to content</a>
      <GlobalHeader />
      <main id="main">
        <ImmersiveStory />
        <ContactSection />
      </main>
      <Footer />
      <LoadPathSpine />
      <LazyMotionLayer />
      <CookieConsent />
    </>
  );
}
