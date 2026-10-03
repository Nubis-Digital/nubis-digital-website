import type { Metadata } from 'next';
import GlobalHeader from '@/components/GlobalHeader';
import { AiCheckCta, AiCheckFaq, AiCheckHero, AiCheckList, AiCheckSteps } from '@/components/aicheck/AiCheckSections';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { aiCheckJsonLd, jsonLdScript } from '@/data/machineReadable';

const title = 'Free AI Visibility Check — Does ChatGPT Recommend You? | Nubis Digital';
const description =
  'Find out what ChatGPT, Perplexity, Google AI and Copilot say about your business — free. We check by hand and send a short, plain-English report with the fixes that matter most.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/ai-visibility-check', types: { 'text/markdown': '/ai-visibility-check.md' } },
  openGraph: { type: 'website', url: '/ai-visibility-check', title: 'Does ChatGPT recommend your business?', description },
  twitter: { card: 'summary', title: 'Does ChatGPT recommend your business?', description },
};

export default function AiVisibilityCheckPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(aiCheckJsonLd()) }} />
      <a href="#main" className="skip-link">Skip to content</a>
      <GlobalHeader />
      <main id="main" className="chk-page">
        <AiCheckHero />
        <AiCheckList />
        <AiCheckSteps />
        <AiCheckFaq />
        <AiCheckCta />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
