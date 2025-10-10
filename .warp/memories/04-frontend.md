# Rules for working with front-end files

Page design should be consistent between all pages.

## Umbraco Templates

* When creating Umbraco Templates, this must be done via the Umbraco Template MCP tools.
* After Umbraco Templates have been created, modifying the cshtml file content directly via the file system is acceptable.
* Rendering Umbraco content in the cshtml files DO NOT require additional plugins.
  * Even for markdown editors, etc... Umbraco has all of the functionality built in to render this correctly using the standard syntax: `@Model.Value("propertyName")`.
  * DO NOT install Markdig or other libraries, they are not needed.

## Partial Views

* Razor partial views or components will need to be manually authored via the file system and stored at: NubisDigital.Site\Views\Partials

# Design & Frontend Rules

* **Primary Framework:** ALL HTML and CSS markup MUST use Tailwind CSS classes for styling.

* **Stylesheet:** Use NubisDigital.Site/wwwroot/css/index.css as the single, main stylesheet for all site-wide styles, Tailwind directives, and custom component classes. Do not create separate CSS files for individual pages.


* **CSS Variables:** Define all brand colors and theme properties as CSS variables within index.css.

* **Responsive Design:** All layouts must be fully responsive using Tailwind's breakpoint prefixes (e.g., sm:, md:, lg:).

**File Locations:**

* CSS files must be stored at NubisDigital.Site/wwwroot/css/.

* Razor partial views must be stored at NubisDigital.Site\Views\Partials.
