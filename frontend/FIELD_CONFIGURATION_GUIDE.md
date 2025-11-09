# Field Configuration Guide

This guide explains how to configure and extend dynamic form fields for Assets and Liabilities.

## Overview

Instead of hardcoding field visibility logic throughout the application, we use configuration files that define which fields appear for each category. This makes it easy to:

- Add new categories
- Modify which fields appear for a category
- Update field labels and help text
- Maintain consistency across the application

## Configuration Files

### Asset Fields Configuration
**Location:** `src/config/assetFieldsConfig.ts`

Defines which fields are visible for each asset category (land, gold, savings, etc.)

### Liability Fields Configuration
**Location:** `src/config/liabilityFieldsConfig.ts`

Defines which fields are visible for each liability category (credit, loan, mortgage, etc.)

## How to Add a New Field

### Step 1: Define the Field Type

Add your field name to the type definition:

```typescript
// In assetFieldsConfig.ts
export type AssetFieldName =
  | 'location'
  | 'purchaseDate'
  | 'newFieldName'  // Add your new field here
  // ... other fields
```

### Step 2: Add Field to Category Configuration

Add the field to the categories where it should appear:

```typescript
export const assetFieldsConfig: Record<AssetCategory, AssetFieldName[]> = {
  land: [
    'location',
    'purchaseDate',
    'newFieldName',  // Add here if it should appear for 'land'
    // ... other fields
  ],
  // ... other categories
};
```

### Step 3: Add Field Metadata

Define the label and helper text for the field:

```typescript
export const assetFieldMetadata: Record<AssetFieldName, {
  label: string;
  helperText?: string;
  placeholder?: string;
}> = {
  // ... other fields
  newFieldName: {
    label: 'My New Field',
    helperText: 'This is what the field is for',
    placeholder: 'Enter value',
  },
};
```

### Step 4: Add Field to Component

Add the field rendering logic to `AssetDynamicFields.tsx`:

```tsx
{shouldShowField('newFieldName') && (
  <TextField
    label={assetFieldMetadata.newFieldName.label}
    value={formValues.newFieldName || ''}
    onChange={handleChange('newFieldName')}
    fullWidth
    helperText={assetFieldMetadata.newFieldName.helperText}
  />
)}
```

### Step 5: Update Type Definitions

Make sure your field is included in the TypeScript types (`src/types/models.ts`):

```typescript
export interface Asset {
  // ... other fields
  newFieldName?: string;
}
```

## How to Add a New Category

### Step 1: Add Category to Types

Update the category type in `src/types/models.ts`:

```typescript
export type AssetCategory = 
  | 'savings'
  | 'land'
  | 'new_category'  // Add your new category
  // ... other categories
```

### Step 2: Add Category Label

Add a display label in the form dialog:

```typescript
// In AssetFormDialog.tsx
const categoryLabels: Record<AssetCategory, string> = {
  // ... other labels
  new_category: 'New Category',
};
```

### Step 3: Configure Fields for Category

Add the category to the configuration with its fields:

```typescript
// In assetFieldsConfig.ts
export const assetFieldsConfig: Record<AssetCategory, AssetFieldName[]> = {
  // ... other categories
  new_category: [
    'location',
    'purchaseDate',
    'institution',
    // Add all fields that should appear
  ],
};
```

### Step 4: Add to Category Options

Add it to the category select dropdown:

```typescript
// In AssetFormDialog.tsx
const assetCategoryOptions: AssetCategory[] = [
  'savings',
  'land',
  'new_category',  // Add here
  // ... other options
];
```

## Configuration Examples

### Example 1: Land Category

```typescript
land: [
  'location',        // Where the land is located
  'purchaseDate',    // When it was bought
  'initialValue',    // Original purchase price
  'description',     // Details about the land
  'documentURL',     // Documents/deeds
],
```

### Example 2: Gold Scheme Category

```typescript
gold_scheme: [
  'institution',     // Which jeweler/bank
  'purchaseDate',    // When scheme started
  'endDate',         // When scheme matures
  'initialValue',    // Down payment
  'monthlyPayment',  // Monthly installment
  'documentURL',     // Scheme documents
],
```

### Example 3: Savings Account

```typescript
savings: [
  'institution',     // Bank name
  'accountNumber',   // Account number
  'documentURL',     // Bank statements
],
```

## Field Metadata Properties

Each field can have the following metadata:

```typescript
{
  label: string;           // Required: Field label shown to user
  helperText?: string;     // Optional: Help text below the field
  placeholder?: string;    // Optional: Placeholder text in the field
}
```

## Best Practices

### 1. Keep Field Names Consistent
Use camelCase for field names: `purchaseDate`, `accountNumber`, `initialValue`

### 2. Use Descriptive Helper Text
Good: "When the asset was acquired"
Bad: "Date"

### 3. Group Related Fields
Keep similar fields together in the configuration (e.g., all date fields, all financial fields)

### 4. Consider Reusability
Before adding a new field, check if an existing field can be reused

### 5. Document Special Behaviors
If a field has special validation or logic, document it in code comments

## Configuration Validation

The TypeScript compiler ensures:
- All categories have a configuration
- Field names are typed and consistent
- No typos in field names
- All referenced fields exist

## Testing New Configurations

After making changes:

1. **Compile Check:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Visual Test:**
   - Open the form dialog
   - Select each category
   - Verify correct fields appear
   - Check labels and helper text

3. **Data Test:**
   - Fill in the form
   - Submit
   - Verify data is saved correctly

## Migration Guide

### From Hardcoded to Configuration

**Before:**
```typescript
const shouldShowField = (fieldName: string): boolean => {
  switch (fieldName) {
    case 'location':
      return category === 'land' || category === 'property';
    // ... many more cases
  }
};
```

**After:**
```typescript
const shouldShowField = (fieldName: AssetFieldName): boolean => {
  return shouldShowFieldForCategory(formValues.category, fieldName);
};
```

## Troubleshooting

### Field Not Showing
- Check if field is in the category's array in config
- Verify field name spelling matches exactly
- Ensure field is rendered in the component

### TypeScript Errors
- Make sure field name is in the type definition
- Check that field exists in metadata object
- Verify the type is imported correctly

### Field Shows for Wrong Category
- Double-check the configuration array
- Look for duplicate field names
- Verify category name is correct

## Future Enhancements

Potential improvements to the configuration system:

1. **Dynamic Field Rendering:**
   Generate fields automatically from configuration

2. **Field Validation Rules:**
   Add validation rules to the configuration

3. **Conditional Fields:**
   Show/hide fields based on other field values

4. **Field Groups:**
   Organize related fields into collapsible sections

5. **Backend Integration:**
   Store configurations in database for runtime changes

## Support

For questions or issues with field configuration:
1. Check this guide
2. Review the configuration files
3. Look at existing examples
4. Check TypeScript error messages

