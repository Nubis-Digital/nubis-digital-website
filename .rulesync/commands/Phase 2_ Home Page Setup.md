## **root: false targets: \["*"\] description: "Create the specific Home Page Document Type and its unique Block List elements." globs: \["\*\*/*"\]**

# **Task: Create the Home Page Structure**

This task focuses on creating the Home Page, which has a unique set of content requirements compared to generic pages.

## **Step 1: Create Home Page-Specific Block List Elements**

First, create the Element Types that will be used *only* on the Home Page. Use the umbraco-mcp tool and check 'Is an Element Type' for both.

### **1\. Services Overview Element**

* **Name:** Services Overview Element  
* **Properties:**  
  * Headline: Textstring (e.g., "Our Services")  
  * Content: Rich Text Editor  
  * Services Link: Content Picker (This should link to the main 'Services' page)

### **2\. Latest Blog Posts Element**

* **Name:** Latest Blog Posts Element  
* **Properties:**  
  * Headline: Textstring (e.g., "From the Blog")  
  * Number of Posts to Show: Numeric (Default: 3\)  
  * Blog List Link: Content Picker (This should link to the main 'Blog' list page)  
  * **Note:** The template for this block will need to contain logic to fetch and display the latest posts.

## **Step 2: Create the Home Page Document Type**

* **Name:** Home Page  
* **Permissions:** Allow at root: Yes.  
* **Template:** Create a default template.  
* **Properties:**  
  * Site Title: Textstring (Required)  
  * Main Content:  
    * **Editor:** Block List Editor  
    * **Available Blocks (configure this property):**  
      * Hero Banner Element (from Phase 1\)  
      * Services Overview Element (created above)  
      * Latest Blog Posts Element (created above)  
      * Call To Action Element (from Phase 1\)