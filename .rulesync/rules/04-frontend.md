---
root: false
targets: ["*"]
description: "Rules for working with front-end files."
globs: ["**/*"]
---
# Frontend Development & Design Protocol

## 1. Guiding Principles

* **Consistency**: A consistent design language and user experience **MUST** be maintained across all pages and components of the website.
* **Framework First**: Adhere to the conventions and best practices of the specified frameworks (Umbraco, Tailwind CSS) before introducing custom solutions.

## 2. Styling (Tailwind CSS)

* **Primary Framework**: All HTML and CSS markup **MUST** use Tailwind CSS classes for styling. Do not write custom, non-utility CSS unless absolutely necessary for a complex component.
* **Central Stylesheet**: The file `index.css` is the single source of truth for all styles. This file **MUST** contain all Tailwind directives (`@tailwind`), custom component classes, and CSS variables.
* **No Separate Files**: Do not create additional CSS files for individual pages or components. All styles must be managed within the central stylesheet.
* **Theming**: All brand colors, fonts, and spacing properties **MUST** be defined as CSS variables at the root of `index.css` for site-wide consistency.
* **Responsive Design**: All layouts **MUST** be fully responsive. Use Tailwind's mobile-first breakpoint prefixes (e.g., `sm:`, `md:`, `lg:`) to adapt the design for different screen sizes.

## 3. Umbraco Views & Templates

### Templates (`.cshtml`)

* **Creation**: Templates **MUST** be created using the Umbraco Template MCP tool.
* **Modification**: After a template is created, modifying its `.cshtml` file content directly via the file system is permitted.
* **Content Rendering**:
    * Use Umbraco's built-in property rendering syntax exclusively: `@Model.Value("propertyName")`.
    * You **MUST NOT** install or use third-party rendering libraries (like Markdig). Umbraco's native functionality is sufficient for all content types, including markdown.

### Partial Views

* **Authoring**: All Razor partial views (`.cshtml` files used as components) **MUST** be authored manually in the file system.

## 4. File System Structure

To ensure consistency, all front-end assets must be stored in their designated locations.

* **Stylesheets**: `NubisDigital.Site/wwwroot/css/`
* **Partial Views**: `NubisDigital.Site/Views/Partials/`
