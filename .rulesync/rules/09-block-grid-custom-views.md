# Block Grid Custom Views Implementation Guide

## Overview
This document describes the implementation of custom views for Umbraco Block Grid editor blocks in the backoffice. Custom views provide a better content editing experience by showing meaningful previews of block content instead of generic placeholders.

## Problem Statement
The Block Grid editor in Umbraco's backoffice was not displaying custom views for blog content blocks. The `umbraco-package.json` file referenced TypeScript files (`.ts`) that didn't exist, and no JavaScript implementation files were present.

## Solution Architecture

### File Structure
```
NubisDigital.Site/App_Plugins/BlockGridCustomViews/
├── umbraco-package.json          # Extension manifest
└── dist/                          # Compiled JavaScript files
    ├── blog-richtext-view.js
    ├── blog-headline-view.js
    ├── blog-image-view.js
    ├── blog-quote-view.js
    └── blog-code-view.js
```

### Key Components

#### 1. Extension Manifest (`umbraco-package.json`)
Defines the custom view extensions and maps them to element types:

```json
{
  "$schema": "../../umbraco-package-schema.json",
  "name": "Nubis.BlockGridCustomViews",
  "version": "1.0.0",
  "extensions": [
    {
      "type": "blockEditorCustomView",
      "alias": "nubis.blockEditorCustomView.richText",
      "name": "Blog Rich Text Custom View",
      "element": "/App_Plugins/BlockGridCustomViews/dist/blog-richtext-view.js",
      "forContentTypeAlias": "blogRichTextBlock"
    }
    // ... additional extensions
  ]
}
```

**Critical Requirements:**
- Extension type MUST be `"blockEditorCustomView"`
- Element path MUST point to a `.js` file (not `.ts`)
- `forContentTypeAlias` MUST match the element type alias exactly

#### 2. Custom View JavaScript Files
Each custom view is a Lit Element web component that:
- Extends `UmbElementMixin(LitElement)`
- Receives block content via the `content` property
- Renders a preview of the block's data
- Uses Umbraco's design tokens for consistent styling

### Implementation Pattern

```javascript
import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogRichTextCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		// Extract and format content for preview
		const contentText = this.content?.content || '';
		const textContent = typeof contentText === 'string' 
			? contentText 
			: (contentText?.markup || '');
		const textPreview = textContent.replace(/<[^>]*>/g, '').substring(0, 150);
		
		return html`
			<div class="block-preview">
				<div class="block-icon">📝</div>
				<div class="block-content">
					<h5>Rich Text</h5>
					<p>${textPreview}${textPreview.length >= 150 ? '...' : ''}</p>
				</div>
			</div>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
				height: 100%;
				box-sizing: border-box;
			}
			.block-preview {
				display: flex;
				align-items: flex-start;
				gap: 12px;
				padding: 12px;
				background: var(--uui-color-surface);
				border: 1px solid var(--uui-color-border);
				border-radius: 6px;
				height: 100%;
			}
			/* Additional styles... */
		`,
	];
}

customElements.define('blog-richtext-custom-view', BlogRichTextCustomView);
```

## Custom View Implementations

### 1. Rich Text Block (`blog-richtext-view.js`)
- **Icon:** 📝
- **Preview:** First 150 characters of text content (HTML stripped)
- **Special Handling:** Supports both string content and object with `markup` property

### 2. Headline Block (`blog-headline-view.js`)
- **Icon:** 📰
- **Preview:** Headline text and level (H2, H3, etc.)
- **Display:** Shows headline level as a badge

### 3. Image Block (`blog-image-view.js`)
- **Icon:** 🖼️
- **Preview:** Caption and alt text
- **Layout:** Caption as primary text, alt text as secondary

### 4. Quote Block (`blog-quote-view.js`)
- **Icon:** 💬
- **Preview:** Quote text and author
- **Styling:** Left border accent to indicate quotation

### 5. Code Block (`blog-code-view.js`)
- **Icon:** 💻
- **Preview:** First 3 lines of code with language badge
- **Styling:** Monospace font, code background color

## Design Principles

### Visual Consistency
- All blocks use emoji icons for quick visual identification
- Consistent padding, borders, and spacing
- Umbraco design tokens for colors and typography

### Content Preview
- Show meaningful content snippets
- Truncate long content with ellipsis
- Display metadata (language, author, etc.) when relevant

### Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Color contrast using Umbraco's design tokens

## Common Issues and Solutions

### Issue 1: TypeError - contentText.replace is not a function
**Cause:** The `content` property may be an object with a `markup` property instead of a plain string.

**Solution:** Check the type before calling string methods:
```javascript
const textContent = typeof contentText === 'string' 
	? contentText 
	: (contentText?.markup || '');
```

### Issue 2: Custom views not appearing
**Causes:**
1. File extension is `.ts` instead of `.js` in `umbraco-package.json`
2. JavaScript files don't exist in the specified path
3. `forContentTypeAlias` doesn't match element type alias
4. Web component not properly registered with `customElements.define()`

**Solution:** Verify all paths, aliases, and ensure files exist.

### Issue 3: Styling conflicts
**Cause:** Not using Umbraco's design tokens.

**Solution:** Use CSS custom properties:
- `var(--uui-color-surface)` for backgrounds
- `var(--uui-color-border)` for borders
- `var(--uui-color-text)` for text
- `var(--uui-color-text-alt)` for secondary text

## Testing Checklist

- [ ] All custom view JavaScript files exist in `/dist/` folder
- [ ] `umbraco-package.json` references `.js` files (not `.ts`)
- [ ] Each `forContentTypeAlias` matches an element type alias
- [ ] Web components are properly registered
- [ ] Custom views display in backoffice Block Grid editor
- [ ] No JavaScript console errors
- [ ] Content previews are meaningful and accurate
- [ ] Styling is consistent with Umbraco's design system

## Maintenance Notes

### Adding New Block Types
1. Create element type in Umbraco
2. Create custom view JavaScript file in `/dist/` folder
3. Add extension entry to `umbraco-package.json`
4. Test in backoffice

### Updating Existing Views
1. Modify the JavaScript file
2. Refresh the backoffice page (hard refresh may be needed)
3. Verify changes appear correctly

## References

- [Umbraco Block Custom View Documentation](https://docs.umbraco.com/umbraco-cms/customizing/extending-overview/extension-types/block-custom-view)
- [Lit Element Documentation](https://lit.dev/)
- [Umbraco Backoffice Extension API](https://docs.umbraco.com/umbraco-cms/customizing/extending-overview)

---

**Last Updated:** 2025-01-11  
**Author:** Roo, Lead AI Developer  
**Status:** Implemented and Tested