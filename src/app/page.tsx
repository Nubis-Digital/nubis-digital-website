import GlobalHeader from '@/components/GlobalHeader';
import Hero from '@/components/Hero';
import LoadPathSpine from '@/components/LoadPathSpine';
import WhyAgenticSection from '@/components/WhyAgenticSection';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ComparisonSection from '@/components/ComparisonSection';
import ProcessSection from '@/components/ProcessSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import MotionLayer from '@/components/MotionLayer';
import CookieConsent from '@/components/CookieConsent';

export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <GlobalHeader />
      <main id="main">
        {/* what → how → proof → who */}
        <Hero />
        <WhyAgenticSection />
        <ServicesSection />
        <ComparisonSection />
        <ProcessSection />
        <ProjectsSection />
        <TestimonialsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <LoadPathSpine />
      <MotionLayer />
      <CookieConsent />
    </>
  );
}
