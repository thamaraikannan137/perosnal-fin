import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Typography,
} from '@mui/material';
import type { 
  Liability, 
  LiabilityCreateInput, 
  LiabilityCategory,
  CustomFieldDefinition,
  CustomCategoryTemplate,
} from '../../../types';
import { Button, CustomFieldsRenderer } from '../../common';
import { customCategoryService } from '../../../services/customCategoryService';
import { liabilityCategoryOptions, liabilityCategoryLabels } from '../../../config/categoryConfig';

type LiabilityFormValues = LiabilityCreateInput;

interface LiabilityFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LiabilityCreateInput) => void;
  initialLiability?: Liability | null;
}

const defaultValues: LiabilityFormValues = {
  name: '',
  category: 'loan',
  balance: 0,
  interestRate: undefined,
  dueDate: '',
  institution: '',
  owner: '',
  notes: '',
};

export const LiabilityFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialLiability,
}: LiabilityFormDialogProps) => {
  const [formValues, setFormValues] = useState<LiabilityFormValues>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customCategoryTemplates, setCustomCategoryTemplates] = useState<CustomCategoryTemplate[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([]);

  // Load liability custom categories
  useEffect(() => {
    const templates = customCategoryService.getTemplatesByType('liability');
    setCustomCategoryTemplates(templates);
  }, []);

  useEffect(() => {
    if (initialLiability) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, updatedAt: _updatedAt, ...rest } = initialLiability;
      setFormValues({
        ...defaultValues,
        ...rest,
      });
    } else {
      setFormValues(defaultValues);
    }
    setErrors({});
  }, [initialLiability, open]);

  const handleChange = (field: keyof LiabilityFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let parsedValue: unknown = value;

    if (field === 'balance') {
      parsedValue = Number(value);
    } else if (field === 'interestRate') {
      parsedValue = value === '' ? undefined : Number(value);
    }

    setFormValues((prev) => ({
      ...prev,
      [field]: parsedValue,
    }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = event.target.value;
    
    // Check if it's a custom category template
    const template = customCategoryTemplates.find((t) => t.id === newCategory);
    
    if (template) {
      // Load custom fields from template
      const fields = customCategoryService.createFieldsFromTemplate(template.id);
      setCustomFields(fields);
      setFormValues((prev) => ({
        ...prev,
        category: 'custom' as LiabilityCategory,
        customCategoryName: template.name,
        customFields: fields,
      }));
    } else {
      // Standard category
      setCustomFields([]);
      setFormValues((prev) => ({
        ...prev,
        category: newCategory as LiabilityCategory,
        customCategoryName: undefined,
        customFields: undefined,
      }));
    }
  };

  const handleCustomFieldChange = (fieldId: string, updates: Partial<CustomFieldDefinition>) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    setFormValues((prev) => ({
      ...prev,
      customFields: customFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const validate = () => {
    const currentErrors: Record<string, string> = {};
    if (!formValues.name.trim()) {
      currentErrors.name = 'Name is required';
    }
    if (!formValues.owner.trim()) {
      currentErrors.owner = 'Owner is required';
    }
    if (!Number.isFinite(formValues.balance) || formValues.balance <= 0) {
      currentErrors.balance = 'Balance must be greater than 0';
    }
    if (formValues.interestRate !== undefined && formValues.interestRate < 0) {
      currentErrors.interestRate = 'Interest rate cannot be negative';
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      ...formValues,
      balance: Number(formValues.balance),
      interestRate:
        formValues.interestRate === undefined ? undefined : Number(formValues.interestRate),
      customFields: formValues.category === 'custom' ? customFields : undefined,
      customCategoryName: formValues.customCategoryName,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialLiability ? 'Edit Liability' : 'Add Liability'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={formValues.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Category"
            select
            value={
              formValues.category === 'custom' && formValues.customCategoryName
                ? customCategoryTemplates.find((t) => t.name === formValues.customCategoryName)?.id || formValues.category
                : formValues.category
            }
            onChange={handleCategoryChange}
            fullWidth
            required
          >
            {liabilityCategoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {liabilityCategoryLabels[option]}
              </MenuItem>
            ))}
            {customCategoryTemplates.length > 0 && [
              <Divider key="custom-divider" sx={{ my: 1 }} />,
              <MenuItem key="custom-header" disabled>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Custom Categories
                </Typography>
              </MenuItem>,
              ...customCategoryTemplates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))
            ]}
          </TextField>
          <TextField
            label="Balance"
            type="number"
            value={formValues.balance}
            onChange={handleChange('balance')}
            error={Boolean(errors.balance)}
            helperText={errors.balance}
            fullWidth
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Interest Rate (%)"
            type="number"
            value={formValues.interestRate ?? ''}
            onChange={handleChange('interestRate')}
            error={Boolean(errors.interestRate)}
            helperText={errors.interestRate}
            fullWidth
            inputProps={{ min: 0, step: 0.1 }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={formValues.dueDate ?? ''}
            onChange={handleChange('dueDate')}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Institution"
            value={formValues.institution}
            onChange={handleChange('institution')}
            fullWidth
          />
          <TextField
            label="Owner"
            value={formValues.owner}
            onChange={handleChange('owner')}
            error={Boolean(errors.owner)}
            helperText={errors.owner}
            fullWidth
            required
          />
          <TextField
            label="Notes"
            value={formValues.notes}
            onChange={handleChange('notes')}
            fullWidth
            multiline
            minRows={3}
          />

          {/* Custom Fields */}
          {formValues.category === 'custom' && customFields.length > 0 && (
            <CustomFieldsRenderer
              customFields={customFields}
              onFieldChange={handleCustomFieldChange}
              categoryName={formValues.customCategoryName}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialLiability ? 'Save Changes' : 'Add Liability'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LiabilityFormDialog;

