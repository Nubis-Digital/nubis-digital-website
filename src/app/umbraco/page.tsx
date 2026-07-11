import type { Metadata } from 'next';
import GlobalHeader from '@/components/GlobalHeader';
import UmbracoHero from '@/components/umbraco/UmbracoHero';
import UmbracoWhat from '@/components/umbraco/UmbracoWhat';
import UmbracoUsers from '@/components/umbraco/UmbracoUsers';
import UmbracoWhy from '@/components/umbraco/UmbracoWhy';
import ComparisonSection from '@/components/ComparisonSection';
import UmbracoMigration from '@/components/umbraco/UmbracoMigration';
import UmbracoCTA from '@/components/umbraco/UmbracoCTA';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import MotionLayer from '@/components/MotionLayer';

export const metadata: Metadata = {
  title: 'Umbraco — the platform we build on | Nubis Digital',
  description:
    'Umbraco is the open, secure, no-lock-in platform we build your website on — in plain terms, who uses it, and why it’s a smart, safe choice.',
};

export default function UmbracoPage() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <GlobalHeader />
      <main id="main" className="umbraco-page">
        <UmbracoHero />
        <UmbracoWhat />
        <UmbracoUsers />
        <UmbracoWhy />
        <ComparisonSection />
        <UmbracoMigration />
        <UmbracoCTA />
      </main>
      <Footer />
      <CookieConsent />
      <MotionLayer />
    </>
  );
}
