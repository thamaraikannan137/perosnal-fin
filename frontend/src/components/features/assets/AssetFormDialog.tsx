import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Box,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import type { Asset, AssetCreateInput, AssetCategory, CustomFieldDefinition, CustomCategoryTemplate } from '../../../types';
import { Button } from '../../common';
import { customCategoryService } from '../../../services/customCategoryService';

const assetCategoryOptions: AssetCategory[] = [
  'savings',
  'fixed_deposit',
  'land',
  'gold',
  'gold_scheme',
  'lent_money',
  'investment',
  'property',
  'retirement',
  'other',
];

const categoryLabels: Record<AssetCategory, string> = {
  land: 'Land',
  gold: 'Gold',
  gold_scheme: 'Gold Scheme',
  lent_money: 'Lent Money',
  savings: 'Savings Account',
  fixed_deposit: 'Fixed Deposit',
  investment: 'Investment',
  property: 'Property',
  retirement: 'Retirement',
  other: 'Other',
  custom: 'Custom (Define Your Own Fields)',
};

type AssetFormValues = AssetCreateInput;

interface AssetFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AssetCreateInput) => void;
  initialAsset?: Asset | null;
}

const defaultValues: AssetFormValues = {
  name: '',
  category: 'savings',
  value: 0,
  institution: '',
  accountNumber: '',
  owner: '',
  notes: '',
};

export const AssetFormDialog = ({ open, onClose, onSubmit, initialAsset }: AssetFormDialogProps) => {
  const [formValues, setFormValues] = useState<AssetFormValues>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; url: string; type: string; uploadedAt: string }>>([]);
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([]);
  
  // Custom category state
  const [customCategoryTemplates, setCustomCategoryTemplates] = useState<CustomCategoryTemplate[]>([]);
  const [selectedCustomCategoryId, setSelectedCustomCategoryId] = useState<string>('');

  useEffect(() => {
    // Load custom asset category templates
    const templates = customCategoryService.getTemplatesByType('asset');
    setCustomCategoryTemplates(templates);

    if (initialAsset) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, updatedAt: _updatedAt, createdAt: _createdAt, ...rest } = initialAsset;
      setFormValues({
        ...defaultValues,
        ...rest,
      });
      setDocuments(initialAsset.documents || []);
      setCustomFields(initialAsset.customFields || []);
      
      // If editing a custom category asset, find matching template
      if (initialAsset.category === 'custom' && initialAsset.customCategoryName) {
        const template = customCategoryService.getTemplateByName(initialAsset.customCategoryName);
        if (template) {
          setSelectedCustomCategoryId(template.id);
        }
      }
    } else {
      setFormValues(defaultValues);
      setDocuments([]);
      setCustomFields([]);
      setSelectedCustomCategoryId('');
    }
    setErrors({});
  }, [initialAsset, open]);

  const handleChange = (field: keyof AssetFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = event.target.value;
    
    if (field === 'value' || field === 'initialValue' || field === 'rateOfReturn' || field === 'monthlyPayment') {
      value = event.target.value === '' ? 0 : Number(event.target.value);
    }
    
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle custom category selection
  const handleCategoryChange = (categoryValue: string) => {
    // Check if it's a custom category (template ID)
    const template = customCategoryTemplates.find(t => t.id === categoryValue);
    
    if (template) {
      // It's a custom category
      setFormValues((prev) => ({ ...prev, category: 'custom' }));
      setSelectedCustomCategoryId(template.id);
      
      // Load fields from template
      const fields = customCategoryService.createFieldsFromTemplate(template.id);
      setCustomFields(fields);
    } else {
      // It's a standard category
      setFormValues((prev) => ({ ...prev, category: categoryValue as AssetCategory }));
      setSelectedCustomCategoryId('');
      setCustomFields([]);
    }
  };

  // Helper to check which fields to show based on category
  const shouldShowField = (fieldName: string): boolean => {
    const category = formValues.category;
    
    switch (fieldName) {
      case 'location':
        return category === 'land' || category === 'property';
      
      case 'purchaseDate':
        return ['land', 'property', 'gold_scheme', 'lent_money', 'fixed_deposit'].includes(category);
      
      case 'endDate':
        return ['gold_scheme', 'lent_money', 'fixed_deposit'].includes(category);
      
      case 'rateOfReturn':
        return ['lent_money', 'fixed_deposit', 'investment'].includes(category);
      
      case 'monthlyPayment':
        return category === 'gold_scheme';
      
      case 'initialValue':
        return ['land', 'property', 'gold_scheme', 'lent_money', 'fixed_deposit', 'investment'].includes(category);
      
      case 'documentURL':
        return true; // Always show for all types
      
      case 'institution':
        return ['savings', 'fixed_deposit', 'investment', 'retirement', 'gold_scheme'].includes(category);
      
      case 'accountNumber':
        return ['savings', 'fixed_deposit', 'investment', 'retirement'].includes(category);
      
      case 'description':
        return ['land', 'property', 'lent_money'].includes(category);
      
      default:
        return true;
    }
  };

  const validate = () => {
    const currentErrors: Record<string, string> = {};
    if (!formValues.name.trim()) {
      currentErrors.name = 'Name is required';
    }
    if (!formValues.owner.trim()) {
      currentErrors.owner = 'Owner is required';
    }
    if (!Number.isFinite(formValues.value) || formValues.value <= 0) {
      currentErrors.value = 'Value must be greater than 0';
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newDoc = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: e.target?.result as string,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        };
        setDocuments((prev) => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'ri-file-pdf-line';
    if (type.includes('image')) return 'ri-image-line';
    if (type.includes('word') || type.includes('document')) return 'ri-file-word-line';
    return 'ri-file-line';
  };

  // Custom field handlers
  const handleCustomFieldChange = (fieldId: string, updates: Partial<CustomFieldDefinition>) => {
    setCustomFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const renderCustomFieldInput = (field: CustomFieldDefinition) => {
    const commonProps = {
      value: field.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string | number | null = e.target.value;
        if (['number', 'currency', 'percentage'].includes(field.type)) {
          value = e.target.value === '' ? null : Number(e.target.value);
        }
        handleCustomFieldChange(field.id, { value });
      },
      fullWidth: true,
      required: field.required,
      placeholder: field.placeholder || `Enter ${field.name}`,
    };

    switch (field.type) {
      case 'textarea':
        return <TextField {...commonProps} multiline minRows={3} />;
      
      case 'date':
        return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;
      
      case 'number':
        return <TextField {...commonProps} type="number" inputProps={{ step: 'any' }} />;
      
      case 'currency':
        return (
          <TextField
            {...commonProps}
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        );
      
      case 'percentage':
        return (
          <TextField
            {...commonProps}
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        );
      
      case 'email':
        return <TextField {...commonProps} type="email" />;
      
      case 'phone':
        return <TextField {...commonProps} type="tel" />;
      
      case 'url':
        return <TextField {...commonProps} type="url" />;
      
      case 'text':
      default:
        return <TextField {...commonProps} />;
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Get custom category name if applicable
    const customCategoryName = selectedCustomCategoryId 
      ? customCategoryTemplates.find(t => t.id === selectedCustomCategoryId)?.name 
      : undefined;

    onSubmit({
      ...formValues,
      value: Number(formValues.value),
      documents: documents.length > 0 ? documents : undefined,
      customFields: formValues.category === 'custom' && customFields.length > 0 ? customFields : undefined,
      customCategoryName: customCategoryName,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialAsset ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
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
            value={selectedCustomCategoryId || formValues.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            fullWidth
            required
          >
            {assetCategoryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {categoryLabels[option]}
              </MenuItem>
            ))}
            {customCategoryTemplates.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem disabled>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    Custom Categories
                  </Typography>
                </MenuItem>
                {customCategoryTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <i className={template.icon || 'ri-folder-line'} style={{ fontSize: '16px' }} />
                      <Typography>{template.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </>
            )}
          </TextField>

          {/* Custom Fields - Only shown for custom category */}
          {formValues.category === 'custom' && customFields.length > 0 && (
            <Box sx={{ p: 2, border: 1, borderColor: 'primary.main', borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.05)' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <i className="ri-settings-3-line" style={{ fontSize: '18px' }} />
                {customCategoryTemplates.find(t => t.id === selectedCustomCategoryId)?.name} Fields
              </Typography>
              
              <Stack spacing={2}>
                {customFields.map((field) => (
                  <Box key={field.id}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 500 }}>
                      {field.name} {field.required && <span style={{ color: '#d32f2f' }}>*</span>}
                    </Typography>
                    {renderCustomFieldInput(field)}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          <TextField
            label="Current Value"
            type="number"
            value={formValues.value}
            onChange={handleChange('value')}
            error={Boolean(errors.value)}
            helperText={errors.value}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />

          {shouldShowField('initialValue') && (
            <TextField
              label="Initial/Purchase Value"
              type="number"
              value={formValues.initialValue || ''}
              onChange={handleChange('initialValue')}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Original purchase price to track gains/losses"
            />
          )}

          {shouldShowField('purchaseDate') && (
            <TextField
              label="Purchase Date"
              type="date"
              value={formValues.purchaseDate || ''}
              onChange={handleChange('purchaseDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="When the asset was acquired"
            />
          )}

          {shouldShowField('endDate') && (
            <TextField
              label="End/Maturity Date"
              type="date"
              value={formValues.endDate || ''}
              onChange={handleChange('endDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Maturity date or expected end date"
            />
          )}

          {shouldShowField('rateOfReturn') && (
            <TextField
              label="Rate of Return / Interest Rate (%)"
              type="number"
              value={formValues.rateOfReturn || ''}
              onChange={handleChange('rateOfReturn')}
              fullWidth
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              helperText="Annual interest rate or ROI percentage"
            />
          )}

          {shouldShowField('monthlyPayment') && (
            <TextField
              label="Monthly Payment"
              type="number"
              value={formValues.monthlyPayment || ''}
              onChange={handleChange('monthlyPayment')}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Monthly investment amount"
            />
          )}

          {shouldShowField('location') && (
            <TextField
              label="Location"
              value={formValues.location || ''}
              onChange={handleChange('location')}
              fullWidth
              helperText="Physical location (e.g., Salem, Tamil Nadu)"
            />
          )}

          {shouldShowField('institution') && (
            <TextField
              label="Institution/Bank"
              value={formValues.institution}
              onChange={handleChange('institution')}
              fullWidth
              helperText="Bank or financial institution name"
            />
          )}

          {shouldShowField('accountNumber') && (
            <TextField
              label="Account Number"
              value={formValues.accountNumber}
              onChange={handleChange('accountNumber')}
              fullWidth
            />
          )}

          {shouldShowField('documentURL') && (
            <>
              <TextField
                label="Document URL (Optional)"
                value={formValues.documentURL || ''}
                onChange={handleChange('documentURL')}
                fullWidth
                helperText="External link to document"
              />
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Upload Documents
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<i className="ri-upload-cloud-line" style={{ fontSize: '18px' }} />}
                  sx={{ textTransform: 'none' }}
                >
                  Upload Files
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Supported: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
                </Typography>
              </Box>

              {documents.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Uploaded Documents ({documents.length})
                  </Typography>
                  <Stack spacing={1}>
                    {documents.map((doc) => (
                      <Box
                        key={doc.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          <i className={getFileIcon(doc.type)} style={{ fontSize: '24px', color: '#2196f3' }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap>
                              {doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => window.open(doc.url, '_blank')}
                            sx={{ color: 'primary.main' }}
                          >
                            <i className="ri-eye-line" style={{ fontSize: '18px' }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveDocument(doc.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <i className="ri-delete-bin-line" style={{ fontSize: '18px' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          )}

          <TextField
            label="Owner"
            value={formValues.owner}
            onChange={handleChange('owner')}
            error={Boolean(errors.owner)}
            helperText={errors.owner}
            fullWidth
            required
          />

          {shouldShowField('description') && (
            <TextField
              label="Description"
              value={formValues.description || ''}
              onChange={handleChange('description')}
              fullWidth
              multiline
              minRows={2}
              helperText="Detailed notes about this asset"
            />
          )}

          <TextField
            label="Additional Notes"
            value={formValues.notes}
            onChange={handleChange('notes')}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialAsset ? 'Save Changes' : 'Add Asset'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssetFormDialog;

