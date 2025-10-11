# Umbraco Development Rules

* **Tooling:** Always use the umbraco-mcp MCP tool for all backoffice operations. Do not attempt to log in or modify content through the browser manually.

* **Document Types & Templates:**

  * The following Document Types with corresponding templates must be created: Generic Page (for home, about us, etc.), Blog List Page, and Blog Page.

  * The Blog Page Document Type must include properties for a title, subtitle, feature image, publish date, author, and tags. The main content will be managed by the Block Grid Editor.

* Content Editing Experience:

  * Block List Editor (Core Page Builder): The Generic Page should use the Block List Editor as the primary tool for composing page layouts.

  * Suggested Block List Elements:

    * Hero Component: A full-width banner with a background image, headline, subheading, and optional call-to-action buttons.

    * Glassmorphic Card Grid: A grid of cards (using the brand's glassmorphism style) to feature blog posts or other content.

    * Rich Text Block: A simple block for flexible text content.

    * Call to Action (CTA): A visually distinct block to encourage user action.

* Block Grid Editor (Blog Content): The main content body for the Blog Page Document Type MUST be a Block Grid Editor. This provides a structured and flexible writing experience.

  * **Required Block Grid Elements:**

    * Rich Text: For standard paragraph content.

    * Headline: To create section headings (H2, H3, etc.).

    * Image with Caption: For embedding images within the article flow.

    * Code Block: For displaying formatted code snippets, which is essential for a technical blog.

    * Quote Block: To highlight important quotes or statements.

* Rendering Content: Render all Umbraco content, including Block List and Block Grid data, using the standard built-in syntax (@Model.Value("propertyName")). DO NOT install additional libraries or plugins.

* Best Practices: Follow all standard Umbraco best practices for schema design, content structure, and performance. Do not create custom users, members, packages, or property editors.

* Running the Site: The site runs at <https://localhost:44348>. If it is not running, start it with dotnet run --project NubisDigital.Site/NubisDigital.Site.csproj.
