// Design-system barrel for /design-sync (claude.ai/design).
// Named re-exports of every component the design agent may build with.
// Build inputs only — the app itself does not import this file.

export { default as AboutSection } from './components/AboutSection';
export { default as ComparisonSection } from './components/ComparisonSection';
export { default as ContactSection } from './components/ContactSection';
export { default as CookieConsent } from './components/CookieConsent';
export { default as Footer } from './components/Footer';
export { default as GlobalHeader } from './components/GlobalHeader';
export { Icon } from './components/icons';
export { default as LoadPathSpine } from './components/LoadPathSpine';
export { default as MotionLayer } from './components/MotionLayer';
export { default as ProcessSection } from './components/ProcessSection';
export { default as ProjectsSection } from './components/ProjectsSection';
export { default as ServicesSection } from './components/ServicesSection';
export { default as TestimonialsSection } from './components/TestimonialsSection';
export { default as WhyAgenticSection } from './components/WhyAgenticSection';
export { default as Wordmark } from './components/Wordmark';

export { default as HaloAgent } from './components/agent/HaloAgent';
export { default as PretextHeadline } from './components/pretext/PretextHeadline';

export { ImmersiveStory } from './components/story/ImmersiveStory';
export { ImmersiveStoryMotion } from './components/story/ImmersiveStoryMotion';
export { LaptopShell } from './components/story/LaptopShell';
export { PhoneShell } from './components/story/PhoneShell';
export { StoryChapter } from './components/story/StoryChapter';

export { default as BrandLogo } from './components/umbraco/BrandLogo';
export { default as UmbracoCTA } from './components/umbraco/UmbracoCTA';
export { default as UmbracoHero } from './components/umbraco/UmbracoHero';
export { default as UmbracoLogo } from './components/umbraco/UmbracoLogo';
export { default as UmbracoMigration } from './components/umbraco/UmbracoMigration';
export { default as UmbracoUsers } from './components/umbraco/UmbracoUsers';
export { default as UmbracoWhat } from './components/umbraco/UmbracoWhat';
export { default as UmbracoWhy } from './components/umbraco/UmbracoWhy';
