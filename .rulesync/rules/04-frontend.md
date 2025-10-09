---
root: false
targets: ["*"]
description: "Rules for working with front-end files"
globs: ["**/*"]
---

# Rules for working with front-end files

Page design should be consistent between all pages.

## Umbraco Templates

* When creating Umbraco Templates, this must be done via the Umbraco Template MCP tools.
* After Umbraco Templates have been created, modifying the cshtml file content directly via the file system is acceptable.
* Rendering Umbraco content in the cshtml files DO NOT require additional plugins.
  * Even for markdown editors, etc... Umbraco has all of the functionality built in to render this correctly using the standard syntax: `@Model.Value("propertyName")`.
  * DO NOT install Markdig or other libraries, they are not needed.

## Partial Views

* Razor partial views or components will need to be manually authored via the file system and stored at: src\MyProject\Views\Partials

## CSS and Styling

### Tailwind CSS Framework
* ALL HTML and CSS markup MUST use Tailwind CSS classes for styling.
* Use the index.css file located at NubisDigital.Site/wwwroot/css/index.css as the main stylesheet.
* The index.css file contains:
  * Tailwind CSS directives (@tailwind base, components, utilities)
  * Custom CSS variables for brand colors (primary, secondary, accent color palettes)
  * Pre-defined component classes for consistent styling across the site
* Reference custom component classes from index.css for common UI elements:
  * Buttons: .btn-primary, .btn-secondary, .btn-outline
  * Layout: .hero-section, .section-padding, .container-wrapper
  * Typography: .text-heading-1, .text-heading-2, .text-heading-3, .text-body
  * Components: .card-base, .form-input, .form-textarea

### CSS File Management
* CSS files should be stored at: NubisDigital.Site/wwwroot/css/
* CSS files stored there can be referenced in HTML by the absolute path /css/*
* DO NOT create separate CSS files for every page
* Use the main index.css file for all site-wide styles
* If page-specific styles are needed, add them to index.css using @layer components or utilities

### Styling Guidelines
* Use Tailwind's responsive design classes (sm:, md:, lg:, xl:, 2xl:)
* Implement consistent spacing using Tailwind's spacing scale
* Use the custom color variables defined in index.css for brand consistency
* Ensure accessibility with proper contrast ratios and focus states
* All custom components should follow the established design system