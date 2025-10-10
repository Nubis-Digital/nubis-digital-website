## **root: false targets: \["*"\] description: "Create the site's main navigation and perform final accessibility checks." globs: \["\*\*/*"\]**

# **Task: Implement Navigation and Finalize the Site**

The final steps are to create the main menu so users can navigate the site, and then ensure the site is accessible.

## **Step 1: Create the Main Navigation Partial View**

1. Create a new Razor Partial View file at NubisDigital.Site/Views/Partials/\_MainNavigation.cshtml.  
2. In this file, write the necessary C\# and HTML to render a navigation bar.  
3. The navigation bar must be styled with Tailwind CSS and should be fully responsive.  
4. It must dynamically generate links to the following top-level pages:  
   * Home  
   * About  
   * Services  
   * Blog  
   * Contact  
5. Update the master template file (Master.cshtml or equivalent) to render this partial view, ensuring it appears on every page.

## **Step 2: Perform Accessibility Audit**

1. Once the navigation is in place and the site is fully functional, navigate to the home page.  
2. Run the a11y-accessibility MCP tool to scan the entire site for accessibility issues.  
3. Review the report and fix any critical issues identified.  
4. Repeat the scan until all major accessibility violations are resolved.