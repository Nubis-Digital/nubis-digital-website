# Create a Blog pages in Umbraco

* Ensure the Document Type structure to support a Blog List page that can exist under the Home page.
  * Ensure there is a Template assigned for this Document Type.
  * Produce the HTML and Razor markup using Tailwind CSS classes to render the Blog List page with links to the latest Blog posts.
  * Use the following Tailwind styling approach:
    - Container: .container-wrapper for main layout
    - Grid layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` for blog post cards
    - Blog cards: .card-base with `p-6` padding
    - Titles: .text-heading-3 for blog post titles
    - Excerpts: .text-body for blog post previews
    - Read more links: .btn-outline or text-blue-600 hover:text-blue-800
  * Ensure there is a Blog List created under the Home page and published.
  * Ensure this document type has a Collection type of List View Content.
* Ensure the Document Type structure to support a Blog page that can exist under the Blog List page.
  * Blog posts should be authored in Markdown so choose an appropriate property editor to allow for this.
  * Ensure there is a Template assigned for this Document Type.
  * Produce the HTML and Razor markup using Tailwind CSS classes to render the Blog page:
    - Article header: Use .section-padding and .container-wrapper
    - Title: .text-heading-1 class
    - Meta information: `text-sm text-gray-500` for date/author
    - Content: .text-body with proper typography classes
    - Navigation: Previous/Next post navigation with .btn-secondary
  * Ensure there are a few Blog pages created and published.
  * Reference index.css at /css/index.css for consistent styling.
