# Page Design Consistency Rules

## Overview

This document defines the critical design patterns and consistency requirements discovered during the blog list page redesign. These rules ensure all pages maintain visual harmony and follow the established glassmorphic design system.

**Date Created:** 2025-01-18  
**Lesson Source:** Blog List Page Redesign  
**Priority:** High - Affects all page templates

## Core Design Principles

### 1. Card Styling Standards

**CRITICAL:** All cards across the site MUST use the exact same glassmorphic styling.

#### Required Card Classes

```html
<div class="rounded-2xl bg-white/95 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20 hover:ring-sky-500/50 dark:bg-slate-900/60 dark:ring-white/10 dark:hover:ring-sky-400/50">
  <!-- Card content -->
</div>
```

#### Key Card Properties

- **Border Radius:** `rounded-2xl` (NEVER squared corners)
- **Background:** `bg-white/95` (light) / `bg-slate-900/60` (dark)
- **Shadow:** `shadow-xl shadow-slate-900/10`
- **Ring:** `ring-1 ring-slate-900/10` (light) / `ring-white/10` (dark)
- **Backdrop Blur:** `backdrop-blur-xl` (essential for glassmorphism)
- **Hover Transform:** `hover:-translate-y-2`
- **Hover Shadow:** `hover:shadow-2xl hover:shadow-sky-500/20`
- **Hover Ring:** `hover:ring-sky-500/50` (light) / `hover:ring-sky-400/50` (dark)

### 2. Section Spacing Standards

**CRITICAL:** Consistent spacing between sections is essential for visual flow.

#### Spacing Classes by Section Type

| Section Type | Spacing Classes | Use Case |
|-------------|----------------|----------|
| Hero Section | `py-20 sm:py-28 lg:py-36` | Page headers, main banners |
| Content Section | `py-20 sm:py-28` | Main content areas, grids |
| Filter/Utility Section | `py-12 sm:py-16` | Filters, toolbars, secondary UI |
| Compact Section | `py-12 sm:py-16` | Tight spacing for related content |

#### Container Pattern

```html
<section class="py-20 sm:py-28">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Content -->
  </div>
</section>
```

### 3. Image Overlay Standards

All images in cards MUST include gradient overlays for text readability.

#### Standard Image Container

```html
<div class="relative aspect-[16/10] overflow-hidden">
  <img src="..." alt="..." class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
  
  <!-- Optional: Content overlays (tags, badges) -->
  <div class="absolute bottom-4 left-4">
    <!-- Overlay content -->
  </div>
</div>
```

#### Key Image Properties

- **Aspect Ratio:** `aspect-[16/10]` for consistency
- **Object Fit:** `object-cover` to fill container
- **Hover Scale:** `group-hover:scale-110` for interaction
- **Gradient Overlay:** `bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent`

## Common Design Mistakes to Avoid

### ❌ Don't Do This

1. **Squared Corners**
   ```html
   <!-- WRONG -->
   <div class="rounded-lg">...</div>
   ```

2. **Inconsistent Spacing**
   ```html
   <!-- WRONG -->
   <section class="py-16">...</section>
   <section class="py-24">...</section>
   ```

3. **Missing Backdrop Blur**
   ```html
   <!-- WRONG -->
   <div class="bg-white/95 shadow-xl">...</div>
   ```

4. **No Visual Separation Between Sections**
   ```html
   <!-- WRONG -->
   <section class="py-8">...</section>
   <section class="py-8 border-t">...</section>
   ```

### ✅ Do This Instead

1. **Rounded Corners**
   ```html
   <!-- CORRECT -->
   <div class="rounded-2xl">...</div>
   ```

2. **Consistent Spacing**
   ```html
   <!-- CORRECT -->
   <section class="py-20 sm:py-28">...</section>
   <section class="py-20 sm:py-28">...</section>
   ```

3. **Complete Glassmorphism**
   ```html
   <!-- CORRECT -->
   <div class="bg-white/95 shadow-xl backdrop-blur-xl">...</div>
   ```

4. **Natural Spacing Without Borders**
   ```html
   <!-- CORRECT -->
   <section class="py-20 sm:py-28">...</section>
   <section class="py-20 sm:py-28">...</section>
   ```

## Page Template Patterns

### Standard Page Structure

```html
<main class="relative min-h-screen transition-colors duration-300">
  <div class="gradient-bg">
    <div class="gradient-orb-1"></div>
    <div class="gradient-orb-2"></div>
  </div>

  <!-- Hero Section -->
  <section class="relative overflow-hidden py-20 sm:py-28 lg:py-36">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h1 class="text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl" style="letter-spacing: -0.02em;">
          Page Title
        </h1>
      </div>
    </div>
  </section>

  <!-- Content Section -->
  <section class="py-20 sm:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Content -->
    </div>
  </section>
</main>
```

### Card Grid Pattern

```html
<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  <a href="..." class="group block h-full">
    <article class="flex h-full flex-col overflow-hidden rounded-2xl bg-white/95 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20 hover:ring-sky-500/50 dark:bg-slate-900/60 dark:ring-white/10 dark:hover:ring-sky-400/50">
      <!-- Card content -->
    </article>
  </a>
</div>
```

## Testing Checklist

Before deploying any page template, verify:

- [ ] All cards use `rounded-2xl` corners
- [ ] Section spacing follows standard patterns (`py-20 sm:py-28` or `py-20 sm:py-28 lg:py-36`)
- [ ] All glassmorphic elements include `backdrop-blur-xl`
- [ ] Images have proper aspect ratios (`aspect-[16/10]`)
- [ ] Image overlays use gradient for text readability
- [ ] Hover effects are consistent (`hover:-translate-y-2`, `hover:shadow-2xl`)
- [ ] No visual "cuts" or borders between sections
- [ ] Responsive breakpoints work correctly (sm, md, lg)
- [ ] Dark mode styling is complete
- [ ] Accessibility standards are met (WCAG AA minimum)

## Reference Components

When creating new page templates, reference these existing components for correct styling:

1. **Card Design:** [`latestBlogPostsElement.cshtml`](NubisDigital.Site/Views/Partials/blocklist/Components/latestBlogPostsElement.cshtml)
2. **Hero Sections:** [`heroBannerElement.cshtml`](NubisDigital.Site/Views/Partials/blocklist/Components/heroBannerElement.cshtml)
3. **Blog List:** [`blogList.cshtml`](NubisDigital.Site/Views/blogList.cshtml)
4. **Blog Post:** [`blogPost.cshtml`](NubisDigital.Site/Views/blogPost.cshtml)

## Debugging Design Issues

### Issue: Cards Look Squared

**Cause:** Using `rounded-lg` or smaller border radius  
**Solution:** Change to `rounded-2xl`

### Issue: Sections Feel Cramped

**Cause:** Insufficient padding between sections  
**Solution:** Use `py-20 sm:py-28` for content sections

### Issue: Visual "Cuts" Between Sections

**Cause:** Using borders (`border-t`) to separate sections  
**Solution:** Remove borders, rely on natural spacing

### Issue: Cards Don't Look Glassmorphic

**Cause:** Missing `backdrop-blur-xl` or incorrect opacity  
**Solution:** Add complete glassmorphic class set

### Issue: Images Don't Scale on Hover

**Cause:** Missing `group` class on parent or `group-hover:scale-110` on image  
**Solution:** Add both classes correctly

## Version History

- **v1.0.0** (2025-01-18): Initial creation based on blog list page redesign lessons

---

**Last Updated:** 2025-01-18  
**Maintained By:** Roo, Lead AI Developer  
**Review Frequency:** After each major page template creation  
**Priority:** High - Core design consistency