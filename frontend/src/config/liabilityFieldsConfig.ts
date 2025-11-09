import type { LiabilityCategory } from '../types';

export type LiabilityFieldName =
  | 'interestRate'
  | 'dueDate'
  | 'institution';

export interface LiabilityCategoryFieldConfig {
  category: LiabilityCategory;
  fields: LiabilityFieldName[];
  description?: string;
}

/**
 * Configuration for which fields are visible for each liability category
 * Easy to maintain and extend - just add/remove fields from the arrays
 */
export const liabilityFieldsConfig: Record<LiabilityCategory, LiabilityFieldName[]> = {
  // Credit Card
  credit: [
    'institution',
    'dueDate',
    'interestRate',
  ],

  // Loan - Personal, auto, education loans
  loan: [
    'institution',
    'dueDate',
    'interestRate',
  ],

  // Mortgage - Home loans
  mortgage: [
    'institution',
    'dueDate',
    'interestRate',
  ],

  // Tax - Tax liabilities
  tax: [
    'dueDate',
  ],

  // Other
  other: [
    'dueDate',
  ],

  // Custom - User-defined categories (uses custom fields instead)
  custom: [],
};

/**
 * Helper function to check if a field should be shown for a given category
 */
export const shouldShowFieldForLiabilityCategory = (
  category: LiabilityCategory,
  fieldName: LiabilityFieldName
): boolean => {
  const fields = liabilityFieldsConfig[category];
  return fields.includes(fieldName);
};

/**
 * Get all fields for a specific category
 */
export const getFieldsForLiabilityCategory = (category: LiabilityCategory): LiabilityFieldName[] => {
  return liabilityFieldsConfig[category] || [];
};

/**
 * Field metadata for display purposes
 */
export const liabilityFieldMetadata: Record<LiabilityFieldName, {
  label: string;
  helperText?: string;
  placeholder?: string;
}> = {
  interestRate: {
    label: 'Interest Rate (%)',
    placeholder: 'Enter interest rate',
  },
  dueDate: {
    label: 'Due Date',
  },
  institution: {
    label: 'Institution',
    helperText: 'Bank or financial institution name',
    placeholder: 'Enter institution name',
  },
};

