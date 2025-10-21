# Umbraco Document Update Safety Rules

## Critical Rule: Complete Property Preservation

**Date Created:** 2025-01-21  
**Severity:** CRITICAL  
**Incident:** Home page content loss during SEO update

## The Problem

When using the `update-document` MCP tool, **ANY property not included in the `values` array will be CLEARED by Umbraco**. This is not a bug - it's how Umbraco's update API works. The API assumes you're providing the complete state of the document.

### What Happened

During an SEO update, I called `update-document` with only the SEO properties:

```json
{
  "values": [
    {"alias": "metaTitle", "value": "..."},
    {"alias": "metaDescription", "value": "..."}
    // Missing: pageTitle, mainContent, and all other properties
  ]
}
```

**Result:** All properties not in the `values` array were cleared, including the required `pageTitle` and `mainContent` properties, making the page unpublishable.

## The Solution: Always Read Before Update

### Mandatory Workflow for Document Updates

1. **ALWAYS read the current document first:**
   ```javascript
   use_mcp_tool("umbraco-mcp", "get-document-by-id", {
     "id": "document-uuid"
   })
   ```

2. **Extract ALL existing values from the response**

3. **Merge your changes with existing values:**
   - Keep all existing properties unchanged
   - Only modify the specific properties you need to change
   - Include ALL properties in the update

4. **Update with complete property set:**
   ```javascript
   use_mcp_tool("umbraco-mcp", "update-document", {
     "id": "document-uuid",
     "data": {
       "values": [
         // ALL existing properties
         {"alias": "pageTitle", "culture": "en-US", "value": "existing value"},
         {"alias": "mainContent", "culture": "en-US", "value": {...existing...}},
         // Your new/updated properties
         {"alias": "metaTitle", "value": "new value"},
         {"alias": "metaDescription", "value": "new value"}
       ],
       "variants": [
         // ALL existing variants
       ]
     }
   })
   ```

## Multi-Language Content Requirements

### Site Languages

This Umbraco instance supports multiple languages:
- **English (US)**: `en-US` (primary)
- **Spanish (Dominican Republic)**: `es-DO`

### Language-Specific Rules

1. **Always Create Content for ALL Languages:**
   - When creating new content, provide values for BOTH `en-US` and `es-DO`
   - Never create content in only one language
   - Use appropriate translations for each language

2. **Culture-Variant Properties:**
   - Properties like `pageTitle` and `mainContent` vary by culture
   - Must include values for each culture: `"culture": "en-US"` and `"culture": "es-DO"`
   - Example:
     ```json
     {
       "alias": "pageTitle",
       "culture": "en-US",
       "value": "Home"
     },
     {
       "alias": "pageTitle",
       "culture": "es-DO",
       "value": "Inicio"
     }
     ```

3. **Culture-Invariant Properties:**
   - SEO properties (metaTitle, metaDescription, etc.) are culture-invariant
   - Use `"culture": null` for these properties
   - They apply to all language versions
   - Example:
     ```json
     {
       "alias": "metaTitle",
       "culture": null,
       "segment": null,
       "value": "Expert Umbraco Development | Nubis Digital"
     }
     ```

4. **Variants Array:**
   - Must include ALL language variants when updating
   - Each variant needs culture, segment, and name
   - Example:
     ```json
     "variants": [
       {
         "culture": "en-US",
         "segment": null,
         "name": "Home"
       },
       {
         "culture": "es-DO",
         "segment": null,
         "name": "Inicio"
       }
     ]
     ```

### Publishing Multi-Language Content

When publishing documents with multiple cultures:

```javascript
use_mcp_tool("umbraco-mcp", "publish-document", {
  "id": "document-uuid",
  "data": {
    "publishSchedules": [
      {
        "culture": "en-US",
        "schedule": null
      },
      {
        "culture": "es-DO",
        "schedule": null
      }
    ]
  }
})
```

**Never use `"culture": null` when publishing culture-variant documents** - this will cause an error.

## Property Types That Must Be Preserved

### Critical Properties (Required by Document Type)
- Properties marked as `"mandatory": true` in validation
- Culture-variant properties (pageTitle, mainContent, etc.)
- Template references

### Complex Properties (Difficult to Reconstruct)
- **Block List Editor** (`Umbraco.BlockList`) - Contains nested content structures
- **Block Grid Editor** (`Umbraco.BlockGrid`) - Contains layout and content data
- **Rich Text Editor** (`Umbraco.RichText`) - Contains markup and embedded blocks
- **Media Picker** (`Umbraco.MediaPicker3`) - Contains media references with crops
- **Content Picker** (`Umbraco.ContentPicker`) - Contains document references

### Simple Properties (Easier to Restore)
- Text strings (`Umbraco.TextBox`)
- Text areas (`Umbraco.TextArea`)
- Booleans (`Umbraco.TrueFalse`)
- Numbers (`Umbraco.Integer`, `Umbraco.Decimal`)

## Recovery Strategies

### If Content Is Lost

1. **Check Published Version:**
   ```javascript
   use_mcp_tool("umbraco-mcp", "get-document-publish", {
     "id": "document-uuid"
   })
   ```
   The published version may still have the content intact.

2. **Discard Draft Changes:**
   - Inform the user to discard changes in the backoffice
   - This reverts to the last published version
   - Then manually add the intended changes

3. **Never Attempt Automated Recovery:**
   - Don't try to restore content programmatically
   - The user should verify content integrity
   - Manual review prevents further data loss

## Prevention Checklist

Before calling `update-document`:

- [ ] Have you read the current document with `get-document-by-id`?
- [ ] Have you extracted ALL existing values from the response?
- [ ] Have you merged your changes with existing values?
- [ ] Have you included ALL properties in the update, not just changed ones?
- [ ] Have you verified all culture variants are included (en-US AND es-DO)?
- [ ] Have you preserved all complex property structures (Block List, Block Grid, etc.)?
- [ ] Have you included the template reference if it exists?
- [ ] For new content, have you provided values for BOTH languages?

## Code Pattern Template

```javascript
// Step 1: Read current document
const currentDoc = await use_mcp_tool("umbraco-mcp", "get-document-by-id", {
  "id": "document-uuid"
});

// Step 2: Extract existing values
const existingValues = currentDoc.values;
const existingVariants = currentDoc.variants;

// Step 3: Create updated values array
const updatedValues = [
  ...existingValues, // Keep all existing
  // Add or override specific properties
  {
    "alias": "metaTitle",
    "culture": null,
    "segment": null,
    "value": "New SEO Title"
  }
];

// Step 4: Update with complete data
await use_mcp_tool("umbraco-mcp", "update-document", {
  "id": "document-uuid",
  "data": {
    "values": updatedValues,
    "variants": existingVariants.map(v => ({
      "culture": v.culture,
      "segment": v.segment,
      "name": v.name
    }))
  }
});
```

## Multi-Language Content Creation Template

```javascript
// When creating new content
await use_mcp_tool("umbraco-mcp", "create-document", {
  "documentTypeId": "document-type-uuid",
  "parentId": "parent-uuid",
  "name": "Page Name",
  "cultures": ["en-US", "es-DO"], // ALWAYS include both languages
  "values": [
    // Culture-variant properties (one for each language)
    {
      "alias": "pageTitle",
      "culture": "en-US",
      "segment": null,
      "value": "English Title"
    },
    {
      "alias": "pageTitle",
      "culture": "es-DO",
      "segment": null,
      "value": "Título en Español"
    },
    // Culture-invariant properties
    {
      "alias": "metaTitle",
      "culture": null,
      "segment": null,
      "value": "SEO Title for All Languages"
    }
  ]
});
```

## Alternative: Property-Specific Updates

If Umbraco adds property-specific update endpoints in the future, prefer those over full document updates for single-property changes.

## Testing Requirements

After any document update:

1. Verify the update succeeded
2. Check that no properties were unintentionally cleared
3. Confirm all culture variants are intact (en-US AND es-DO)
4. Test that the document can still be published
5. Verify content exists in both languages

## Documentation References

- [Umbraco Management API - Update Document](https://docs.umbraco.com/umbraco-cms/reference/management-api)
- [Umbraco Content Delivery API](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api)
- [Umbraco Multi-Language Content](https://docs.umbraco.com/umbraco-cms/fundamentals/backoffice/variants)

---

**Last Updated:** 2025-01-21  
**Maintained By:** Roo, Lead AI Developer  
**Review Frequency:** After any document update incident  
**Version:** 1.1.0