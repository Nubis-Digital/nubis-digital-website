## **root: false targets: \["*"\] description: "Create the Document Types for the blog list and individual blog posts." globs: \["\*\*/*"\]**

# **Task: Build the Blog Structure**

This task involves creating the two Document Types required for the blog: a parent list page and the individual post page.

## **Step 1: Create the Blog List Page Document Type**

This will be the main landing page for the blog.

* **Name:** Blog List  
* **Permissions:** Allow at root: No. Allow as child of Home Page.  
* **Template:** Create a default template. The logic in this template will render a list of its children (Blog Post pages).  
* **Properties:**  
  * Page Title: Textstring (e.g., "Blog")  
  * Introduction: Rich Text Editor

## **Step 2: Create the Blog Post Page Document Type**

This is the Document Type for individual articles.

* **Name:** Blog Post  
* **Permissions:** Allow at root: No. Allow as child of Blog List.  
* **Template:** Create a default template.  
* **Properties:**  
  * Post Title: Textstring (Required)  
  * Subtitle: Textstring  
  * Publication Date: Date/Time Picker (Required)  
  * Author: Textstring  
  * Featured Image: Media Picker  
  * Tags: Tags  
  * Main Content:  
    * **Editor:** Block Grid Editor  
    * **Available Blocks:** Configure with standard blocks like Rich Text, Headline, Image, Quote, and Code Block.