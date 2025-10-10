# Undo all Umbraco work to reset to defaults

* Delete all Templates.
* Delete all CSS.
* Delete all Media.
* Delete all Content.
* Delete all Document Types.
* Delete all CSS in NubisDigital.Site/wwwroot/css EXCEPT index.css (preserve the main Tailwind CSS file)
* Delete all non Umbraco partial views in NubisDigital.Site/Views/Partials.
    * Do NOT delete blockgrid/blocklist views.
    * Do not delete master.cshtml
    * PRESERVE index.css as it contains the main Tailwind CSS configuration and custom component classes.
