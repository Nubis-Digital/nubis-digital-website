# Block List Element Type Container Requirements

## Critical Issue: Element Type Properties Must Have Containers

**Date Discovered:** 2025-10-11  
**Severity:** High - Prevents properties from rendering in Block List/Block Grid editors

## The Problem

When creating Element Types for use in Block List or Block Grid editors, properties MUST be organized into containers (Tabs or Groups). If properties have `"container": null`, they will NOT render in the Block Editor modal, making them impossible to edit.

### Symptoms
- Block List elements appear in the content editor
- Clicking "edit" on a block opens a modal
- The modal appears empty or properties are missing
- Properties exist in the Element Type definition but aren't visible

## Root Cause

Umbraco's Block Editor modal rendering requires properties to be organized into a container hierarchy. Properties without a container reference cannot be displayed in the modal interface.

From the Umbraco API structure:
```json
{
  "properties": [
    {
      "id": "property-uuid",
      "container": null,  // ❌ THIS CAUSES THE BUG
      "alias": "myProperty",
      "name": "My Property"
    }
  ],
  "containers": []  // ❌ NO CONTAINERS DEFINED
}
```

## The Solution

Every Element Type used in Block List or Block Grid editors MUST have:

1. **At least one container** (Tab or Group) defined
2. **All properties assigned** to a container via `container.id` reference

### Correct Structure

```json
{
  "properties": [
    {
      "id": "property-uuid",
      "container": {
        "id": "tab-uuid"  // ✅ PROPERTY REFERENCES CONTAINER
      },
      "alias": "myProperty",
      "name": "My Property"
    }
  ],
  "containers": [
    {
      "id": "tab-uuid",  // ✅ CONTAINER DEFINED
      "parent": null,
      "name": "Content",
      "type": "Tab",
      "sortOrder": 0
    }
  ]
}
```

## Implementation Guidelines

### When Creating Element Types

1. **Always create a container structure** - Even if you only have one tab named "Content", create it explicitly
2. **Use unique container IDs** - Each element type needs its own unique container UUID to avoid database conflicts
3. **Assign all properties** - Every property must reference a container.id
4. **Use Tab type for simplicity** - For basic element types, a single Tab container is sufficient

### Using Umbraco MCP Tools

When using the [`create-element-type`](NubisDigital.Site/uSync/v16/ContentTypes/) or [`update-document-type`](NubisDigital.Site/uSync/v16/ContentTypes/) MCP tools:

**Good Example:**
```json
{
  "name": "My Block Element",
  "alias": "myBlockElement",
  "icon": "icon-layout",
  "properties": [
    {
      "id": "abc-123",
      "container": {"id": "container-uuid"},
      "alias": "headline",
      "name": "Headline",
      "dataType": {"id": "textstring-datatype-id"}
    }
  ],
  "containers": [
    {
      "id": "container-uuid",
      "parent": null,
      "name": "Content",
      "type": "Tab",
      "sortOrder": 0
    }
  ]
}
```

**Bad Example (Will cause bug):**
```json
{
  "name": "My Block Element",
  "alias": "myBlockElement", 
  "icon": "icon-layout",
  "properties": [
    {
      "id": "abc-123",
      "container": null,  // ❌ BUG: No container
      "alias": "headline",
      "name": "Headline"
    }
  ],
  "containers": []  // ❌ BUG: No containers defined
}
```

## Container ID Strategy

To avoid database UNIQUE constraint errors when creating multiple element types:

- **Hero Banner Element**: Use container ID `00000000-0000-0000-0000-000000000001`
- **Call To Action Element**: Use container ID `11111111-1111-1111-1111-111111111111`
- **Services Overview Element**: Use container ID `22222222-2222-2222-2222-222222222222`
- **Latest Blog Posts Element**: Use container ID `33333333-3333-3333-3333-333333333333`
- **Informational Section Element**: Use container ID `44444444-4444-4444-4444-444444444444`
- **Contact Form Element**: Use container ID `55555555-5555-5555-5555-555555555555`

Each element type MUST use a unique container UUID to prevent SQLite "UNIQUE constraint failed" errors.

## Verification Steps

After creating or updating an element type:

1. Navigate to the content editor
2. Find a page using the Block List/Grid editor
3. Click "edit" on an element using the updated type
4. Verify ALL properties appear in the modal
5. Confirm properties are organized under tab/group headers

## Prevention Checklist

Before deploying any Element Type for Block List/Grid editors:

- [ ] Element Type has `"isElement": true`
- [ ] At least one container is defined in `containers` array
- [ ] Container has unique `id`, valid `name`, `type: "Tab"`, and `sortOrder: 0`
- [ ] Every property has `container: {"id": "container-uuid"}` reference
- [ ] Container UUID is unique across all element types
- [ ] Tested in browser that modal displays all properties

## Related Files

- Element Type definitions: [`NubisDigital.Site/uSync/v16/ContentTypes/`](NubisDigital.Site/uSync/v16/ContentTypes/)
- Block List Data Types: [`GenericPageBlocks.config`](NubisDigital.Site/uSync/v16/DataTypes/GenericPageBlocks.config), [`HomePageBlocks.config`](NubisDigital.Site/uSync/v16/DataTypes/HomePageBlocks.config)

## Key Takeaway

**Element Types for Block Editors MUST have container structure. Properties without containers will not render in the modal editor.**