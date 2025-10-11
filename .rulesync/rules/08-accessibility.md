# Accessibility Rules for Nubis Digital Website

## Overview
This document defines accessibility standards and requirements for the Nubis Digital website to ensure WCAG 2.1 Level AA compliance (with AAA targets where feasible).

## Color Contrast Requirements

### Minimum Standards (WCAG AA)
- **Normal Text**: Minimum contrast ratio of 4.5:1
- **Large Text** (18pt+ or 14pt+ bold): Minimum contrast ratio of 3:1
- **UI Components**: Minimum contrast ratio of 3:1 for interactive elements

### Target Standards (WCAG AAA)
- **Normal Text**: Target contrast ratio of 7:1 or higher
- **Large Text**: Target contrast ratio of 4.5:1 or higher

### Verification Process
1. Use the a11y-accessibility MCP tool to verify all color combinations
2. Test with `check_color_contrast` function before implementing new color schemes
3. Document contrast ratios in code comments for critical UI elements

### Current Color Palette (Light Theme)
```css
--bg-color: #f1f5f9;           /* Background */
--text-color: #0f172a;         /* Primary text - 17.85:1 on white (AAA) */
--text-muted-color: #475569;   /* Secondary text - 7.57:1 on white (AAA) */
--glass-bg: rgba(255, 255, 255, 0.95);  /* Glass panels - 95% opacity */
```

### Current Color Palette (Dark Theme)
```css
--bg-color: #0f172a;           /* Background */
--text-color: #ffffff;         /* Primary text */
--text-muted-color: #94a3b8;   /* Secondary text */
--glass-bg: rgba(30, 41, 59, 0.4);  /* Glass panels */
```

## Glassmorphism Opacity Guidelines

### Critical Rule: Readability Over Aesthetics
When glassmorphism effects conflict with readability, **always prioritize readability**.

### Opacity Standards
- **Content Panels** (cards, sections with text): Minimum 95% opacity in light mode
- **Navigation Elements**: Minimum 95% opacity in light mode, 80% in dark mode
- **Decorative Elements**: Can use lower opacity (40-60%) as they don't contain text
- **Background Overlays**: Maximum 80% opacity to maintain depth

### Testing Glassmorphic Elements
1. View content over the 3D animated background
2. Test with both light and dark themes
3. Verify text remains readable at all scroll positions
4. Check on different screen sizes and resolutions

## Semantic HTML Requirements

### Document Structure
- Use proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- One `<h1>` per page (typically the page title)
- Use `<main>` for primary content
- Use `<nav>` for navigation sections
- Use `<article>` for blog posts and standalone content
- Use `<section>` for thematic groupings
- Use `<footer>` for footer content

### Interactive Elements
- All clickable elements must be `<button>` or `<a>` tags
- Buttons for actions, links for navigation
- Never use `<div>` or `<span>` with click handlers without proper ARIA roles

### Forms
- All form inputs must have associated `<label>` elements
- Use `placeholder` for hints, not as a replacement for labels
- Group related inputs with `<fieldset>` and `<legend>`
- Provide clear error messages with `aria-describedby`

## ARIA Labels and Roles

### When to Use ARIA
- **Icons without text**: Always include `aria-label`
- **Decorative images**: Use `alt=""` or `role="presentation"`
- **Complex widgets**: Use appropriate ARIA roles and states
- **Dynamic content**: Use `aria-live` regions for updates

### Examples
```html
<!-- Social media icons -->
<a href="https://github.com" aria-label="GitHub">
  <svg>...</svg>
</a>

<!-- Theme toggle -->
<button onclick="toggleTheme()" aria-label="Toggle theme">
  <svg>...</svg>
</button>

<!-- Decorative image -->
<img src="pattern.svg" alt="" role="presentation">
```

## Keyboard Navigation

### Requirements
- All interactive elements must be keyboard accessible
- Logical tab order (left-to-right, top-to-bottom)
- Visible focus indicators on all focusable elements
- Skip navigation link for keyboard users
- No keyboard traps

### Focus Styles
```css
/* Minimum focus indicator */
:focus {
  outline: 2px solid var(--logo-color-1);
  outline-offset: 2px;
}

/* Enhanced focus for better visibility */
:focus-visible {
  outline: 3px solid var(--logo-color-1);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
}
```

## Responsive Design Accessibility

### Touch Targets
- Minimum size: 44x44 pixels (WCAG 2.1 Level AAA)
- Recommended size: 48x48 pixels
- Adequate spacing between interactive elements (8px minimum)

### Text Sizing
- Base font size: 16px minimum
- Allow text to scale up to 200% without loss of functionality
- Use relative units (rem, em) instead of fixed pixels
- Line height: 1.5 minimum for body text

### Viewport Requirements
- Support zoom up to 200%
- No horizontal scrolling at standard zoom levels
- Content reflows appropriately on mobile devices

## Image Accessibility

### Alt Text Guidelines
- **Informative images**: Describe the content and function
- **Decorative images**: Use empty alt (`alt=""`)
- **Complex images**: Provide detailed description nearby or in `longdesc`
- **Text in images**: Include the text in alt attribute

### Examples
```html
<!-- Informative -->
<img src="chart.png" alt="Sales increased 25% in Q4 2024">

<!-- Decorative -->
<img src="divider.svg" alt="">

<!-- Logo -->
<img src="logo.svg" alt="Nubis Digital">
```

## Animation and Motion

### Respect User Preferences
```css
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Guidelines
- Avoid flashing content (no more than 3 flashes per second)
- Provide pause/stop controls for auto-playing content
- Don't rely solely on animation to convey information

## Testing Checklist

### Before Deployment
- [ ] Run automated accessibility tests (axe, WAVE)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify keyboard navigation works throughout site
- [ ] Check color contrast with a11y MCP tool
- [ ] Test with browser zoom at 200%
- [ ] Verify on mobile devices
- [ ] Test with dark and light themes
- [ ] Check focus indicators are visible
- [ ] Validate HTML semantics
- [ ] Test forms with assistive technology

### Tools to Use
1. **a11y-accessibility MCP**: For color contrast verification
2. **Browser DevTools**: Lighthouse accessibility audit
3. **axe DevTools**: Browser extension for automated testing
4. **WAVE**: Web accessibility evaluation tool
5. **Screen Readers**: NVDA (Windows), VoiceOver (Mac), TalkBack (Android)

## Common Accessibility Pitfalls to Avoid

### ❌ Don't Do This
- Using color alone to convey information
- Creating keyboard traps
- Using `<div>` or `<span>` as buttons
- Removing focus outlines without replacement
- Using low contrast colors for text
- Relying on hover-only interactions
- Auto-playing videos with sound
- Using images of text instead of actual text

### ✅ Do This Instead
- Use color + icons/text for information
- Ensure all modals can be closed with Escape key
- Use semantic `<button>` and `<a>` elements
- Provide visible focus indicators
- Maintain WCAG AA contrast ratios minimum
- Provide keyboard alternatives for hover interactions
- Mute auto-playing videos, provide controls
- Use actual text with web fonts

## Continuous Improvement

### Regular Audits
- Run accessibility audits monthly
- Test with real users who use assistive technology
- Stay updated with WCAG guidelines
- Document and fix issues promptly

### Documentation
- Document accessibility decisions in code comments
- Maintain this rules file with updates
- Share accessibility knowledge with team
- Create accessibility-focused user stories

## Resources

### Official Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

### Testing Tools
- [a11y MCP Tool](https://github.com/modelcontextprotocol/servers) - Color contrast checker
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Learning Resources
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Enforcement

These accessibility rules are **mandatory** for all development work on the Nubis Digital website. Any pull request or change that violates these rules should be rejected until accessibility issues are resolved.

### Priority Levels
- **P0 (Critical)**: WCAG A violations - Must fix immediately
- **P1 (High)**: WCAG AA violations - Fix within sprint
- **P2 (Medium)**: WCAG AAA violations - Fix when possible
- **P3 (Low)**: Best practice improvements - Backlog items

---

**Last Updated**: 2025-01-11
**Maintained By**: Roo, Lead AI Developer
**Review Frequency**: Monthly