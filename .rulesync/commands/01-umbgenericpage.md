---
description: 'Create Umbraco generic page with blocklist editor'
targets: ["*"]
---

# Create a Generic Page with Blocklist Editor in Umbraco

## Blocklist Elements

### 1. Hero Banner Element
* Create a HeroBannerElement document type for the blocklist:
  * Add a Layout dropdown property with 3 layout options:
    - "Standard" - Full width with centered content
    - "Split" - Two-column layout with content and image
    - "Minimal" - Clean, minimal design with overlay text
  * Add a Headline textstring property (required)
  * Add a RichText property for description/content
  * Add Primary CTA properties:
    - Primary CTA Text (textstring, optional)
    - Primary CTA Link (content picker or URL picker, optional)
  * Add Secondary CTA properties:
    - Secondary CTA Text (textstring, optional)
    - Secondary CTA Link (content picker or URL picker, optional)
  * Add Background Image property (media picker, optional)
  * Ensure there is a partial view template assigned for this element

### 2. Call To Action Element
* Create a CallToActionElement document type for the blocklist:
  * Add a Headline textstring property
  * Add a Description richtext property
  * Add Button Text property (textstring)
  * Add Button Link property (content picker or URL picker)
  * Add Background Color picker property (optional)
  * Ensure there is a partial view template assigned for this element

### 3. Informational Section Element
* Create an InformationalSectionElement document type for the blocklist:
  * Add a Section Title textstring property
  * Add a Content richtext property
  * Add an Image property (media picker, optional)
  * Add Image Position dropdown with options:
    - "Left"
    - "Right"
    - "Top"
    - "Bottom"
  * Ensure there is a partial view template assigned for this element

### 4. Contact Form Element
* Create a ContactFormElement document type for the blocklist:
  * Add a Form Title textstring property
  * Add a Form Description richtext property (optional)
  * Add Show Name Field checkbox property (default: true)
  * Add Show Email Field checkbox property (default: true)
  * Add Show Phone Field checkbox property (default: false)
  * Add Show Message Field checkbox property (default: true)
  * Add Submit Button Text property (default: "Send Message")
  * Add Success Message richtext property
  * Ensure there is a partial view template assigned for this element

## Generic Page Document Type
* Create a GenericPage document type:
  * Add a Page Title textstring property
  * Add a Page Content blocklist property configured with the above elements:
    - HeroBannerElement
    - CallToActionElement
    - InformationalSectionElement
    - ContactFormElement
  * Ensure there is a Template assigned for this Document Type
  * Allow this document type to be created under Home and other pages as needed

## Implementation Requirements

### Styling and Markup
* ALL HTML markup MUST use Tailwind CSS classes exclusively
* Reference the index.css file at NubisDigital.Site/wwwroot/css/index.css for:
  * Custom component classes (.btn-primary, .btn-secondary, .btn-outline)
  * Layout classes (.hero-section, .section-padding, .container-wrapper)
  * Typography classes (.text-heading-1, .text-heading-2, .text-heading-3, .text-body)
  * Form classes (.form-input, .form-textarea)
* Use Tailwind's responsive design classes (sm:, md:, lg:, xl:) for all layouts
* Implement consistent spacing using Tailwind's spacing scale
* Use custom color variables from index.css for brand consistency

### Component-Specific Styling Guidelines

#### Hero Banner Element
* Use .hero-section class for background and padding
* Standard Layout: Full-width with centered content using .container-wrapper
* Split Layout: Use Tailwind grid classes (grid grid-cols-1 lg:grid-cols-2)
* Minimal Layout: Use absolute positioning with overlay text
* Buttons should use .btn-primary and .btn-outline classes
* Headlines should use .text-heading-1 or .text-heading-2 classes

#### Call To Action Element
* Use .section-padding for consistent vertical spacing
* Center content with .container-wrapper and text-center
* Use .btn-primary for the main CTA button
* Background colors should use Tailwind's color palette

#### Informational Section Element
* Use .section-padding and .container-wrapper for layout
* Image positioning with Tailwind flexbox/grid classes
* Content should use .text-body class for typography
* Use .card-base for any card-like styling

#### Contact Form Element
* Use .form-input class for all input fields
* Use .form-textarea class for message field
* Use .btn-primary for submit button
* Implement proper form validation styling with Tailwind states

### Technical Requirements
* Produce the HTML, Razor templates with Tailwind CSS classes
* Ensure all partial views are created in Views/Partials/blocklist/Components/
* Implement responsive design using Tailwind's responsive prefixes
* Add proper form handling for the contact form element
* Ensure accessibility standards with proper ARIA attributes and focus states
* Create sample content to demonstrate each element type
* Ensure CSS is linked properly: `<link rel="stylesheet" href="/css/index.css">`