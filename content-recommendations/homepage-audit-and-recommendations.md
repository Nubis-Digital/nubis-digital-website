# 🔥 Homepage Content Audit & Recommendations
**Date:** October 20, 2025  
**Audited By:** Roo, Lead AI Developer  
**Site:** Nubis Digital Website  
**Mode:** Roast My Site

---

## Executive Summary

Your homepage is **completely empty**. Both English (`en-US`) and Spanish (`es-DO`) variants contain zero Block List content blocks. Users currently see only a "Build in progress" placeholder message.

**Current Homepage Data:**
```json
{
  "mainContent": "",  // English variant - EMPTY
  "mainContent": ""   // Spanish variant - EMPTY
}
```

For a portfolio piece meant to showcase Umbraco expertise at a major conference, this is **unacceptable**. You've built impressive technical infrastructure but forgot to add the actual content.

---

## 🔥 THE ROAST: What's Wrong

### 1. **No Hero Section** ❌
**The Problem:** No first impression. Users land on your site and see nothing compelling.

**Available Elements You're Not Using:**
- Hero Banner Element (3 style variants: fullscreen, split, centered)
- Hero Slider Element (dynamic slider with video support, Ken Burns effect)

**Impact:**
- Zero engagement on landing
- No clear value proposition
- Missed opportunity to showcase Umbraco Block List capabilities

### 2. **No Services Overview** ❌
**The Problem:** Potential clients have no idea what services you offer.

**Available Element:** `servicesOverviewElement` with 3 layout styles (grid, cards, list)

**Impact:**
- No service discovery
- No conversion path
- Wasted opportunity to demonstrate expertise

### 3. **No Blog Posts Showcase** ❌
**The Problem:** You're building blog posts about the development journey but not showcasing them on the homepage.

**Available Element:** `latestBlogPostsElement` with auto-discovery and glassmorphic cards

**Impact:**
- Hidden content that should be front and center
- No demonstration of thought leadership
- Poor SEO (no internal linking)

### 4. **No Call to Action** ❌
**The Problem:** No conversion path. What do you want visitors to do?

**Available Element:** `callToActionElement` with 3 style variants (banner, centered, split)

**Impact:**
- Zero conversion optimization
- No clear next steps for visitors
- Missed lead generation opportunities

### 5. **No Informational Content** ❌
**The Problem:** No "About" section, company story, or value proposition.

**Available Element:** `informationalSectionElement` for rich content with glassmorphic panels

**Impact:**
- No trust building
- No differentiation from competitors
- No brand storytelling

### 6. **No Contact Form** ❌
**The Problem:** No way for visitors to reach you.

**Available Element:** `contactFormElement` ready to capture leads

**Impact:**
- Lost business opportunities
- Poor user experience
- No lead capture mechanism

### 7. **Accessibility Failures** ❌
**Critical Issues:**
- No visible H1 heading (only sr-only if siteTitle exists)
- No meaningful content for screen readers
- No semantic structure
- Poor SEO - search engines see an empty page

**WCAG Violations:**
- Fails 2.4.1 Bypass Blocks (no skip navigation)
- Fails 2.4.2 Page Titled (no clear page purpose)
- Fails 2.4.6 Headings and Labels (no content structure)

### 8. **Performance Irony** 🤦
**What You Have:**
- ✅ 3D animated neural network background
- ✅ Glassmorphism effects with backdrop-filter
- ✅ Liquid glass hover effects
- ✅ Theme switching
- ✅ Responsive design
- ✅ Block List architecture

**What You're Missing:**
- ❌ Actual content to showcase all this engineering

It's like buying a $5,000 camera and only taking pictures of your feet.

---

## 💡 THE RECOMMENDATIONS: How to Fix This

### Priority 1: Add Content Immediately (P0 - Critical)

#### Recommended Homepage Structure

```
┌─────────────────────────────────────┐
│  1. Hero Slider Element             │
│     (3 slides, auto-play)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  2. Services Overview Element       │
│     (Grid layout, 6 services)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  3. Latest Blog Posts Element       │
│     (Auto-discover, 3 posts)         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  4. Informational Section           │
│     (Why Choose Us / Our Approach)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  5. Call to Action Element          │
│     (Banner style, consultation)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  6. Contact Form Element (Optional) │
│     (Could be separate page)         │
└─────────────────────────────────────┘
```

---

### 1. Hero Slider Element Configuration

**Why Slider Over Banner:**
- More dynamic and engaging
- Showcases multiple value propositions
- Demonstrates advanced Umbraco Block List capabilities
- Better portfolio piece for conference presentation

#### Recommended Slides

**Slide 1: Primary Value Proposition**
```yaml
Headline: "Expert Umbraco Development in New Jersey"
Subheadline: "Enterprise-grade CMS solutions for businesses across the tri-state area"
Background: High-quality image of modern office or technology
Primary CTA: "Get Started" → /contact
Secondary CTA: "View Our Work" → /blog
```

**Slide 2: Service Focus**
```yaml
Headline: "Enterprise CMS Solutions That Scale"
Subheadline: "From custom development to managed support, we handle every aspect of your Umbraco journey"
Background: Abstract technology or code visualization
Primary CTA: "Explore Services" → /services
Secondary CTA: "Schedule Consultation" → /contact
```

**Slide 3: Expertise Highlight**
```yaml
Headline: "From Migration to Managed Support"
Subheadline: "Seamless Umbraco migrations, API integrations, and 24/7 support for your peace of mind"
Background: Team collaboration or success imagery
Primary CTA: "Learn More" → /about
Secondary CTA: "Read Case Studies" → /blog
```

#### Technical Configuration
```json
{
  "autoPlay": true,
  "autoPlayDelay": 5000,
  "sliderVariant": "Fade",
  "slides": [
    {
      "headline": "Expert Umbraco Development in New Jersey",
      "subheadline": "Enterprise-grade CMS solutions for businesses across the tri-state area",
      "slideImage": "[Upload high-quality image]",
      "ctaText": "Get Started",
      "ctaLink": "[Link to Contact page]",
      "secondaryCtaText": "View Our Work",
      "secondaryCtaLink": "[Link to Blog]"
    }
    // ... additional slides
  ]
}
```

#### Image Requirements
- **Dimensions:** 1920x1080 minimum (16:9 aspect ratio)
- **Format:** WebP preferred, JPEG fallback
- **File Size:** Under 500KB (optimized)
- **Alt Text:** Descriptive and relevant to slide content
- **Quality:** Professional, high-resolution, on-brand

---

### 2. Services Overview Element Configuration

**Layout:** Grid (3 columns on desktop, 1 on mobile)

#### Service 1: Umbraco Development
```yaml
Icon: "icon-code"
Headline: "Custom Umbraco Development"
Description: "Tailored CMS solutions built with modern architecture, Block Editor expertise, and scalable design patterns that grow with your business."
Features:
  - Custom document types and data types
  - Block List and Block Grid implementations
  - Advanced property editors
  - Headless CMS architecture
```

#### Service 2: CMS Migration
```yaml
Icon: "icon-shuffle"
Headline: "Seamless CMS Migration"
Description: "Move from legacy systems to Umbraco with zero downtime. We handle data integrity, content preservation, and URL redirects for a smooth transition."
Features:
  - WordPress to Umbraco
  - Sitecore to Umbraco
  - Custom CMS migrations
  - Data validation and testing
```

#### Service 3: API Integration
```yaml
Icon: "icon-connection"
Headline: "API Integration & Headless"
Description: "Connect Umbraco to your existing systems. From CRM integrations to headless implementations, we build robust API solutions."
Features:
  - RESTful API development
  - Third-party service integration
  - Headless CMS setup
  - Custom endpoints
```

#### Service 4: Managed Support
```yaml
Icon: "icon-support"
Headline: "24/7 Managed Support"
Description: "Keep your Umbraco site running smoothly with proactive monitoring, performance optimization, and security updates."
Features:
  - 24/7 uptime monitoring
  - Performance optimization
  - Security patches
  - Regular backups
```

#### Service 5: Training & Consulting
```yaml
Icon: "icon-users"
Headline: "Training & Consulting"
Description: "Empower your team with Umbraco expertise. From editor training to architecture reviews, we help you maximize your CMS investment."
Features:
  - Content editor training
  - Developer workshops
  - Architecture review
  - Best practices consulting
```

#### Service 6: Custom Development
```yaml
Icon: "icon-wrench"
Headline: "Custom Extensions"
Description: "Extend Umbraco's capabilities with custom property editors, packages, and integrations tailored to your unique requirements."
Features:
  - Custom property editors
  - Package development
  - Workflow automation
  - Custom dashboards
```

#### Technical Configuration
```json
{
  "headline": "Comprehensive Umbraco Services",
  "content": "<p>From initial development to ongoing support, we provide end-to-end Umbraco solutions for businesses of all sizes.</p>",
  "servicesStyle": "grid",
  "serviceItems": [
    {
      "icon": "icon-code",
      "headline": "Custom Umbraco Development",
      "description": "Tailored CMS solutions built with modern architecture..."
    }
    // ... additional services
  ],
  "servicesLink": "[Link to Services page]"
}
```

---

### 3. Latest Blog Posts Element Configuration

**Purpose:** Automatically showcase your latest blog posts about the Umbraco development journey.

#### Configuration
```json
{
  "headline": "Latest from the Build",
  "numberOfPostsToShow": 3,
  "blogListLink": null  // Auto-discover blog list page
}
```

**How It Works:**
- Automatically finds your Blog List page
- Displays the 3 most recent published blog posts
- Shows feature image, title, subtitle, publish date, author, and tags
- Includes "View all posts" link to blog archive

**Content Requirements:**
- Minimum 3 published blog posts for optimal display
- Each post should have:
  - Feature image (800x500px minimum)
  - Compelling title
  - Descriptive subtitle
  - Publish date
  - Author (default: "Roo, Lead AI Developer")
  - Relevant tags

---

### 4. Informational Section Element Configuration

**Purpose:** Build trust and explain your unique value proposition.

#### Option A: "Why Choose Nubis Digital?"
```yaml
Headline: "Why Choose Nubis Digital?"
Content: |
  We're not just another web agency. We're Umbraco specialists with a unique approach:
  
  **Deep Umbraco Expertise**
  Our team lives and breathes Umbraco CMS. From Block Editors to headless implementations, we know the platform inside and out.
  
  **Tri-State Area Presence**
  Based in New Jersey, we serve businesses across NY, NJ, and PA with local support and understanding of regional market needs.
  
  **Enterprise-Grade Solutions**
  We build scalable, secure, and performant Umbraco sites that handle enterprise traffic and complexity.
  
  **AI-Assisted Development**
  We leverage cutting-edge AI tools to accelerate development while maintaining code quality and best practices.
  
  **Accessibility First**
  Every site we build meets WCAG AA standards minimum, ensuring your content reaches all users.
```

#### Option B: "Our Approach"
```yaml
Headline: "Our Development Approach"
Content: |
  **Modern Development Practices**
  We use the latest Umbraco features, including Block List and Block Grid editors, to create flexible, maintainable content structures.
  
  **Accessibility-First Design**
  WCAG compliance isn't an afterthought—it's built into every component from day one.
  
  **Performance Optimization**
  Fast load times, optimized images, and efficient code ensure your site performs excellently on all devices.
  
  **Continuous Improvement**
  We don't just launch and leave. We monitor, optimize, and evolve your site based on real-world usage and feedback.
```

#### Technical Configuration
```json
{
  "headline": "Why Choose Nubis Digital?",
  "content": "<p>We're not just another web agency...</p>",
  "backgroundImage": "[Optional background image]"
}
```

---

### 5. Call to Action Element Configuration

**Style:** Banner (most prominent and conversion-focused)

#### Configuration
```json
{
  "headline": "Ready to Transform Your Digital Presence?",
  "description": "<p>Let's discuss how Umbraco can power your next project. Schedule a free consultation to explore your options.</p>",
  "buttonText": "Schedule a Consultation",
  "buttonLink": "[Link to Contact page]",
  "ctaStyle": "banner"
}
```

**Alternative CTAs:**
- "Start Your Umbraco Journey Today"
- "Get a Free Umbraco Assessment"
- "Let's Build Something Amazing"
- "Upgrade to Enterprise CMS"

---

### 6. Contact Form Element (Optional)

**Recommendation:** Consider placing this on a dedicated Contact page rather than homepage to avoid cluttering the homepage.

**If Including on Homepage:**
```json
{
  "headline": "Get in Touch",
  "description": "<p>Have a project in mind? We'd love to hear about it.</p>",
  "formFields": [
    "name",
    "email",
    "company",
    "message"
  ],
  "submitButtonText": "Send Message"
}
```

---

## Priority 2: Content Quality Standards (P1 - High)

### Writing Guidelines

#### 1. Be Specific, Not Generic
**❌ Bad:** "We're experts in Umbraco development."  
**✅ Good:** "We've delivered 50+ Umbraco projects for enterprise clients across healthcare, finance, and education sectors."

#### 2. Use Numbers and Metrics
**❌ Bad:** "We have lots of experience."  
**✅ Good:** "10+ years of Umbraco expertise, 50+ projects delivered, 99.9% uptime guarantee."

#### 3. Include Social Proof
- Client testimonials
- Case studies
- Industry certifications
- Partnership badges

#### 4. Optimize for SEO
**Target Keywords:**
- Umbraco development
- Umbraco CMS
- Web design New Jersey
- Enterprise CMS
- Umbraco migration
- API integration
- Managed hosting
- New Jersey web agency

**Keyword Placement:**
- Page title (already optimized)
- H1 heading
- First paragraph
- Service descriptions
- Alt text for images
- Meta description (already optimized)

#### 5. Maintain Brand Voice
**Tone:** Professional yet approachable  
**Style:** Technical but accessible  
**Perspective:** First-person from Roo's viewpoint  
**Personality:** Confident, knowledgeable, helpful

**Example:**
> "As an AI developer building this site, I've learned that Umbraco's Block List editor is incredibly powerful for creating flexible page layouts. Let me show you how we can use it for your project."

---

### Image Requirements

#### Hero Slider Images
- **Dimensions:** 1920x1080 minimum (16:9 aspect ratio)
- **Format:** WebP with JPEG fallback
- **File Size:** Under 500KB each (optimized)
- **Quality:** Professional, high-resolution
- **Content:** Relevant to slide message
- **Alt Text:** Descriptive and keyword-rich

**Recommended Sources:**
- Unsplash (free, high-quality)
- Pexels (free, commercial use)
- Custom photography (best for authenticity)

#### Service Icons
- **Format:** SVG preferred (scalable)
- **Size:** 64x64px display size
- **Style:** Consistent with brand (line icons or filled)
- **Color:** Match brand palette (sky blue, indigo)

#### Blog Post Feature Images
- **Dimensions:** 800x500px minimum (16:10 aspect ratio)
- **Format:** WebP with JPEG fallback
- **File Size:** Under 200KB (optimized)
- **Content:** Relevant to blog post topic
- **Alt Text:** Descriptive of image content

---

## Priority 3: Technical Improvements (P2 - Medium)

### SEO Enhancements

#### Add Structured Data
Add to `master.cshtml` or homepage template:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nubis Digital",
  "description": "Expert Umbraco CMS Development & Web Design in New Jersey",
  "url": "https://nubisdigital.com",
  "logo": "https://nubisdigital.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "NJ",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://twitter.com/nubisdigital",
    "https://linkedin.com/company/nubisdigital",
    "https://github.com/nubisdigital"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": ["English", "Spanish"]
  }
}
</script>
```

#### Add Breadcrumb Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://nubisdigital.com"
  }]
}
</script>
```

---

### Performance Optimization

#### 1. Lazy Load Images Below Fold
Update image tags for services and blog posts:

```html
<img 
  src="placeholder.jpg" 
  data-src="actual-image.jpg" 
  loading="lazy"
  alt="Descriptive alt text"
/>
```

#### 2. Preload Hero Images
Add to `<head>` section:

```html
<link rel="preload" as="image" href="/hero-slide-1.webp" />
```

#### 3. Defer Non-Critical JavaScript
```html
<script src="/js/non-critical.js" defer></script>
```

#### 4. Optimize Swiper.js Loading
Only load Swiper if Hero Slider is present:

```razor
@if (mainContent?.Any(x => x.Content.ContentType.Alias == "heroSlider") == true)
{
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
}
```

---

### Accessibility Fixes

#### 1. Add Visible H1
Update `homePage.cshtml`:

```razor
@if (!string.IsNullOrWhiteSpace(siteTitle))
{
    <header class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white">
            @siteTitle
        </h1>
    </header>
}
```

#### 2. Ensure Proper Heading Hierarchy
- H1: Page title (site title or hero headline)
- H2: Section headings (Services, Blog Posts, etc.)
- H3: Subsection headings (individual services, blog post titles)
- H4: Minor headings within content

#### 3. Add Skip Navigation Link
Add to `master.cshtml` before navigation:

```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:rounded">
    Skip to main content
</a>
```

Then add `id="main-content"` to the `<main>` element.

#### 4. Test with Screen Readers
- **NVDA** (Windows) - Free
- **JAWS** (Windows) - Commercial
- **VoiceOver** (Mac) - Built-in
- **TalkBack** (Android) - Built-in

**Testing Checklist:**
- [ ] All images have descriptive alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Heading hierarchy is logical
- [ ] Form labels are properly associated
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)

---

## Priority 4: Multilingual Content (P3 - Low)

### Spanish Translation Strategy

You have Spanish (`es-DO`) variants configured but empty. Consider:

#### 1. Translate All Homepage Content
**Hero Slider Slides:**
- Slide 1: "Desarrollo Experto de Umbraco en New Jersey"
- Slide 2: "Soluciones CMS Empresariales que Escalan"
- Slide 3: "Desde Migración hasta Soporte Administrado"

**Services:**
- Custom Umbraco Development → Desarrollo Personalizado de Umbraco
- CMS Migration → Migración de CMS
- API Integration → Integración de API
- Managed Support → Soporte Administrado
- Training & Consulting → Capacitación y Consultoría
- Custom Extensions → Extensiones Personalizadas

#### 2. Cultural Appropriateness
- Not just literal translation
- Consider Dominican Republic Spanish dialect
- Use appropriate business terminology
- Adapt examples to local context

#### 3. Test Language Switcher
- Verify language toggle works
- Ensure URLs are properly localized
- Check that all content switches correctly
- Test with native Spanish speakers

#### 4. SEO for Spanish Market
**Target Keywords (Spanish):**
- Desarrollo Umbraco
- CMS empresarial
- Diseño web New Jersey
- Migración CMS
- Integración API
- Soporte administrado

---

## Implementation Timeline

### Phase 1: Immediate (Today)
**Goal:** Get content on the homepage

- [ ] Create Hero Slider with 3 slides
- [ ] Add Services Overview with 6 services
- [ ] Add Latest Blog Posts element
- [ ] Publish homepage
- [ ] Test on mobile and desktop

**Estimated Time:** 4-6 hours

---

### Phase 2: Short-term (This Week)
**Goal:** Polish and optimize

- [ ] Source/create high-quality hero images
- [ ] Write compelling service descriptions
- [ ] Add Call to Action element
- [ ] Add Informational Section
- [ ] Optimize all images (WebP format)
- [ ] Run accessibility audit with a11y MCP tool
- [ ] Fix any WCAG violations
- [ ] Test with screen readers

**Estimated Time:** 8-12 hours

---

### Phase 3: Medium-term (This Month)
**Goal:** Complete and enhance

- [ ] Add Spanish translations for all content
- [ ] Create 5+ blog posts about development journey
- [ ] Add client testimonials (if available)
- [ ] Implement structured data (Schema.org)
- [ ] Add Contact Form element
- [ ] Performance optimization (lazy loading, preloading)
- [ ] Cross-browser testing
- [ ] User testing and feedback

**Estimated Time:** 20-30 hours

---

## Success Metrics

### Before Launch
- [ ] Homepage has all 5-6 recommended content blocks
- [ ] All images are optimized and have alt text
- [ ] WCAG AA compliance verified
- [ ] Mobile responsive on all devices
- [ ] Page load time under 3 seconds
- [ ] No console errors
- [ ] All links work correctly

### After Launch
- **Traffic Metrics:**
  - Bounce rate under 60%
  - Average session duration over 2 minutes
  - Pages per session over 2

- **Engagement Metrics:**
  - CTA click-through rate over 5%
  - Blog post views increasing
  - Contact form submissions

- **Technical Metrics:**
  - Lighthouse score over 90
  - Core Web Vitals passing
  - Zero accessibility errors

---

## Content Maintenance Plan

### Weekly
- [ ] Review analytics for user behavior
- [ ] Check for broken links
- [ ] Monitor page load times
- [ ] Review and respond to contact form submissions

### Monthly
- [ ] Update blog posts (minimum 1 new post)
- [ ] Refresh hero slider images/content
- [ ] Review and update service descriptions
- [ ] Check for outdated information
- [ ] Run accessibility audit

### Quarterly
- [ ] Major content refresh
- [ ] Add new case studies/testimonials
- [ ] Update statistics and metrics
- [ ] Review SEO performance
- [ ] Conduct user testing

---

## The Bottom Line

Your homepage is like a beautiful empty restaurant—great ambiance, but no food. You've built an impressive technical foundation with:

✅ Glassmorphism design system  
✅ 3D neural network background  
✅ Block List architecture  
✅ Responsive design  
✅ Theme switching  
✅ Liquid glass effects  

But you **forgot to add the actual content**.

For a portfolio piece meant to showcase Umbraco expertise at a conference, an empty homepage is unacceptable. It's like showing up to a job interview with a blank resume.

**The good news:** You have all the tools ready. You just need to use them.

**Action Required:**
1. Add the 5-6 recommended content blocks
2. Write compelling copy
3. Source quality images
4. Test and optimize
5. Launch with confidence

Your homepage can go from "embarrassing placeholder" to "impressive portfolio piece" in a matter of hours.

**Your conference presentation depends on it. Get to work.**

---

## Additional Resources

### Umbraco Documentation
- [Block List Editor](https://docs.umbraco.com/umbraco-cms/fundamentals/backoffice/property-editors/built-in-umbraco-property-editors/block-editor/block-list-editor)
- [Block Grid Editor](https://docs.umbraco.com/umbraco-cms/fundamentals/backoffice/property-editors/built-in-umbraco-property-editors/block-editor/block-grid-editor)
- [Content Management](https://docs.umbraco.com/umbraco-cms/fundamentals/data/creating-content)

### Design Resources
- [Unsplash](https://unsplash.com) - Free high-quality images
- [Pexels](https://pexels.com) - Free stock photos
- [Heroicons](https://heroicons.com) - Free SVG icons
- [Coolors](https://coolors.co) - Color palette generator

### SEO Tools
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org](https://schema.org) - Structured data reference
- [Google Rich Results Test](https://search.google.com/test/rich-results)

### Accessibility Tools
- [WAVE](https://wave.webaim.org) - Web accessibility evaluation
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Performance Tools
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [WebPageTest](https://www.webpagetest.org)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Next Review:** After homepage content implementation