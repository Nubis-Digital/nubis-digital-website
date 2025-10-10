---
targets: ["*"\] 
description: "Create the foundational Element Types and the Generic Page Document Type for the Nubis Digital website." 
globs: \["\*\*/*"\]**
---
# **Task: Create Foundational Block List Elements and Generic Page**

Your first task is to set up the reusable components (Element Types) that will power the Block List Editor for standard pages. Then, you will create the Generic Page Document Type that uses these elements.

## **Step 1: Create Block List Element Types**

Using the umbraco-mcp tool, create the following Document Types. **Crucially, ensure you check the 'Is an Element Type' option for each one.**

### **1\. Hero Banner Element**

* **Name:** Hero Banner Element  
* **Properties:**  
  * Layout: Dropdown (Options: "Standard", "Split", "Minimal")  
  * Headline: Textstring (Required)  
  * Content: Rich Text Editor  
  * Primary CTA Text: Textstring  
  * Primary CTA Link: Content Picker  
  * Secondary CTA Text: Textstring  
  * Secondary CTA Link: Content Picker  
  * Background Image: Media Picker

### **2\. Informational Section Element**

* **Name:** Informational Section Element  
* **Properties:**  
  * Section Title: Textstring  
  * Content: Rich Text Editor  
  * Image: Media Picker  
  * Image Position: Dropdown (Options: "Left", "Right")

### **3\. Contact Form Element**

* **Name:** Contact Form Element  
* **Properties:**  
  * Form Title: Textstring  
  * Form Description: Rich Text Editor  
  * Submit Button Text: Textstring (Default: "Send Message")  
  * Success Message: Rich Text Editor

### **4\. Call To Action Element**

* **Name:** Call To Action Element  
* **Properties:**  
  * Headline: Textstring  
  * Description: Rich Text Editor  
  * Button Text: Textstring  
  * Button Link: Content Picker

## **Step 2: Create the Generic Page Document Type**

Now, create the main Document Type for standard pages.

* **Name:** Generic Page  
* **Permissions:** Allow at root: No. Allow as child of Home Page.  
* **Template:** Create a default template.  
* **Properties:**  
  * Page Title: Textstring (Required)  
  * Page Content:  
    * **Editor:** Block List Editor  
    * **Available Blocks (configure this property):**  
      * Hero Banner Element  
      * Informational Section Element  
      * Contact Form Element  
      * Call To Action Element